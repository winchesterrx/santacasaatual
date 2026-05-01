import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Users, HeartPulse, Stethoscope, BedDouble, Award, TrendingUp, Activity, Building, Ambulance, ClipboardList } from "lucide-react";
import { listarNumeros, listarDocumentos, type NumeroEstatistico, type DocumentoTransparencia } from "@/services/mockApi";

const iconMap: Record<string, any> = {
  Users, HeartPulse, Stethoscope, BedDouble, Award, TrendingUp, Activity, Building, Ambulance, ClipboardList
};

const AnimatedNumber = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extrair o número e o sufixo (ex: "1.000+" -> { num: 1000, suffix: "+" })
  const match = value.replace(/\./g, '').match(/(\d+)(.*)/);
  const targetNumber = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const isPercentage = value.includes('%');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`stat-${value}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [value, hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let start = 0;
    const duration = 2000; // 2 segundos
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (easeOutQuad)
      const easedProgress = progress * (2 - progress);
      
      const currentCount = Math.floor(easedProgress * targetNumber);
      setDisplayValue(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [hasAnimated, targetNumber]);

  const formattedNumber = displayValue.toLocaleString('pt-BR');

  return (
    <span id={`stat-${value}`}>
      {isPercentage ? `${displayValue}${suffix}` : `${formattedNumber}${suffix}`}
    </span>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState<NumeroEstatistico[]>([]);
  const [documents, setDocuments] = useState<DocumentoTransparencia[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const nums = await listarNumeros();
        setStats(nums);

        const docs = await listarDocumentos();
        setDocuments(docs.filter(d => d.is_favorite));
      } catch (error) {
        console.error("Failed to load stats or documents", error);
      }
    };
    loadData();
  }, []);

  const openDocument = (base64: string | undefined) => {
    if (!base64) return;
    try {
      if (base64.startsWith('data:')) {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], {type: mime});
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        window.open(base64, '_blank');
      }
    } catch (e) {
      console.error("Erro ao abrir documento", e);
    }
  };

  return (
    <section id="transparencia" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Image Medical */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1600&q=80" 
          alt="Hospital Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#022c22]/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/60 to-[#022c22]/80" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-white mb-3 bg-white/20 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
            Transparência e Prestação de Contas
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Nossos Números Falam
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Transparência é compromisso da Irmandade da Santa Casa de Misericórdia de Paulo de Faria.
            Confira nossos indicadores e acesse os documentos oficiais.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {stats.map((stat) => {
            const IconComponent = iconMap[stat.icone] || Users;
            return (
              <div
                key={stat.id}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10 hover:bg-white/15 transition-colors"
              >
                <IconComponent className="w-8 h-8 text-primary-foreground/70 mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-1">
                  <AnimatedNumber value={stat.valor} />
                </div>
                <div className="text-sm text-primary-foreground font-semibold mb-0.5">{stat.titulo}</div>
                <div className="text-xs text-primary-foreground/60">{stat.descricao}</div>
              </div>
            );
          })}
        </div>

        {/* Documents Section Splitter */}
        <div className="mt-20 mb-10 text-center border-t border-white/10 pt-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-300 mb-3 bg-white/10 px-4 py-1.5 rounded-full shadow-sm backdrop-blur-sm">
            Transparência
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Arquivos Oficiais
          </h3>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-sm">
            Acesse rapidamente as principais demonstrações de transparência da nossa instituição.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-4 bg-white/10 rounded-xl p-4 border border-white/10 group hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="text-sm font-semibold text-primary-foreground truncate" title={doc.nome}>{doc.nome}</div>
                  <div className="text-xs text-primary-foreground/60">{doc.categoria}</div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openDocument(doc.arquivo)}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/25 transition-colors"
                  title="Visualizar documento"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={doc.arquivo || "#"}
                  download={doc.nome}
                  className="w-8 h-8 flex items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/25 transition-colors"
                  title="Baixar arquivo"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
          {documents.length === 0 && (
            <div className="col-span-full text-center py-4 text-primary-foreground/70">
              Nenhum documento em destaque no momento.
            </div>
          )}
        </div>

        {/* Link for all documents */}
        <div className="mt-8 text-center">
          <Link 
            to="/transparencia" 
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-0.5"
          >
            Ver todos os dados de transparência pública
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
