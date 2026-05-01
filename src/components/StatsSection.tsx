import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Users, HeartPulse, Stethoscope, BedDouble, Award, TrendingUp, Activity, Building, Ambulance, ClipboardList } from "lucide-react";
import { listarNumeros, listarDocumentos, type NumeroEstatistico, type DocumentoTransparencia } from "@/services/mockApi";

const iconMap: Record<string, any> = {
  Users, HeartPulse, Stethoscope, BedDouble, Award, TrendingUp, Activity, Building, Ambulance, ClipboardList
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
                  {stat.valor}
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
            Acesso Rápido
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Documentos em Destaque
          </h3>
          <p className="text-primary-foreground/70 max-w-xl mx-auto text-sm">
            Acesse rapidamente os principais arquivos e demonstrações de transparência da nossa instituição.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.arquivo || "#"}
              download={doc.nome}
              className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-xl p-5 text-left transition-colors border border-white/10 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 group-hover:bg-white/25 transition-colors">
                <FileText className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-primary-foreground truncate">{doc.nome}</div>
                <div className="text-xs text-primary-foreground/60">{doc.categoria}</div>
              </div>
              <Download className="w-5 h-5 text-primary-foreground/60 shrink-0 group-hover:text-primary-foreground transition-colors" />
            </a>
          ))}
          {documents.length === 0 && (
            <div className="col-span-full text-center py-4 text-primary-foreground/70">
              Nenhum documento em destaque no momento.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
