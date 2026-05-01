import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[100] animate-in slide-in-from-bottom-10 duration-700">
      <div className="bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 p-6 md:p-8 overflow-hidden relative group">
        {/* Abstract background shape */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald/10 transition-colors" />
        
        <div className="relative flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 flex items-center justify-center">
              <Cookie className="w-5 h-5 text-emerald" />
            </div>
            <h4 className="text-navy font-black uppercase tracking-widest text-xs">Privacidade & Cookies</h4>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed">
            Utilizamos cookies para melhorar sua experiência e analisar o tráfego. 
            Ao clicar em "Aceitar", você concorda com o uso de cookies conforme nossa 
            <Link to="/politica-de-privacidade" className="text-emerald font-bold hover:underline ml-1">Política de Privacidade</Link>.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleAccept} 
              variant="navy-solid"
              className="flex-1 rounded-xl h-11 text-xs font-black uppercase tracking-widest"
            >
              Aceitar Tudo
            </Button>
            <Button 
              onClick={handleDecline} 
              variant="outline"
              className="flex-1 rounded-xl h-11 text-xs font-bold text-slate-400 border-slate-200"
            >
              Recusar
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald" />
            Em conformidade com a LGPD
          </div>
        </div>

        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-slate-300 hover:text-navy transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
