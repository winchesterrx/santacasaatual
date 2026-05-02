import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listarConfiguracoes } from "@/services/mockApi";

const STORAGE_KEY = "sc_popup_dismissed_v2";

const EntryPopup = () => {
  const [visible, setVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [closing, setClosing] = useState(false);
  const [config, setConfig] = useState<{ active: boolean; image: string }>({ active: false, image: "" });

  useEffect(() => {
    const init = async () => {
      try {
        const configs = await listarConfiguracoes();
        const active = configs.popup_ativo === 'true';
        const image = configs.popup_imagem || '/campanha.png';
        
        setConfig({ active, image });

        if (!active) return;

        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed) {
          const data = JSON.parse(dismissed);
          const dismissedDate = new Date(data.date).toDateString();
          const today = new Date().toDateString();
          
          // Se foi dispensado hoje E a imagem não mudou, não mostramos
          if (dismissedDate === today && data.image === image) return;
        }

        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Erro ao carregar config do popup:", err);
      }
    };

    init();
  }, []);

  const close = () => {
    setClosing(true);
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        date: new Date().toISOString(),
        image: config.image
      }));
    }
    setTimeout(() => setVisible(false), 250);
  };

  if (!visible || !config.active) return null;

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center bg-foreground/60 backdrop-blur-sm transition-opacity duration-300 ${closing ? "opacity-0" : "animate-in fade-in duration-300"}`}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className={`relative bg-card rounded-2xl shadow-2xl max-w-lg w-[94%] overflow-hidden transition-transform duration-300 ${closing ? "scale-95" : "animate-in zoom-in-95 duration-300"}`}>
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4 text-primary-foreground" />
        </button>

        {/* Header visual — uploaded campaign image */}
        <div className="w-full relative">
          <img 
            src={config.image} 
            alt="Campanha da Santa Casa" 
            className="w-full h-auto object-cover block max-h-[80vh]" 
          />
        </div>

        {/* Action Buttons */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-emerald"
              />
              <span className="text-xs text-muted-foreground">Não mostrar hoje</span>
            </label>
            <Button variant="cta" size="sm" className="rounded-full px-5" onClick={close}>
              Entendi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPopup;
