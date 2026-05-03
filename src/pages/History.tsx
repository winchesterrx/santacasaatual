import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Award, Heart, History as HistoryIcon, Target, Eye, Users, Camera, Quote, Activity, Clock, BedSingle, Stethoscope } from "lucide-react";
import { buscarHistoria, listarGaleriaHistoria, type Historia as HistoriaType, type HistoriaGaleria } from "@/services/mockApi";

const History = () => {
  const [data, setData] = useState<HistoriaType | null>(null);
  const [gallery, setGallery] = useState<HistoriaGaleria[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const [hist, gal] = await Promise.all([buscarHistoria(), listarGaleriaHistoria()]);
        setData(hist);
        setGallery(gal);
      } catch (error) {
        console.error("Erro ao carregar história", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald"></div>
      </div>
    );
  }

  const historia = data || {
    titulo: "Nossa História",
    subtitulo: "Carregando...",
    texto_historia: "",
    missao: "Prestar assistência à saúde com humanização.",
    visao: "Ser referência regional em saúde.",
    valores: "Humanização, Ética, Excelência",
    imagem_principal: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit  return (
    <div className="min-h-screen bg-[#faf9f6] text-navy selection:bg-emerald selection:text-white overflow-x-hidden">
      <SEO 
        title="Nossa História | Santa Casa de Paulo de Faria" 
        description="Uma jornada de dedicação, fé e cuidado que começou em 1960. Conheça o legado da Santa Casa de Paulo de Faria." 
      />
      <SiteHeader />
      
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      <main>
        {/* HERO - RESPONSIVE */}
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-navy">
          <div className="absolute inset-0 z-0">
            <img 
              src={historia.imagem_principal} 
              className="w-full h-full object-cover opacity-30 blur-[1px]" 
              alt="Santa Casa History"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-navy" />
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
                 <HistoryIcon className="w-4 h-4" /> Desde 1960
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-white leading-tight mb-6 tracking-tight">
                Nossa <span className="text-emerald">História</span>
              </h1>
              <p className="text-base md:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed italic opacity-90">
                "{historia.subtitulo}"
              </p>
            </div>
          </div>
        </section>

        {/* CHAPTER I - RESPONSIVE GRID */}
        <section className="py-12 md:py-20 relative bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="relative">
                <div className="inline-block px-3 py-1 rounded bg-emerald/10 text-emerald text-[10px] font-black uppercase tracking-widest mb-4">Capítulo 01</div>
                <h2 className="text-3xl md:text-5xl font-black text-navy mb-6 md:mb-8 leading-tight">
                  A Fundação <br className="hidden md:block" />& <span className="text-emerald">Propósito Social</span>
                </h2>
                <div className="w-16 h-1 bg-secondary mb-6 md:mb-8" />
                <div 
                  className="prose prose-slate prose-base md:prose-lg text-slate-600 leading-relaxed font-medium" 
                  dangerouslySetInnerHTML={{ __html: historia.texto_historia }}
                />
              </div>
              
              <div className="relative mt-8 lg:mt-0">
                <div className="bg-slate-100 rounded-[30px] md:rounded-[40px] p-8 md:p-12 border border-slate-200">
                  <Quote className="w-10 h-10 md:w-12 md:h-12 text-emerald/20 mb-6" />
                  <p className="text-xl md:text-2xl font-serif italic text-navy leading-snug">
                    "Juridicamente, a Santa Casa é uma associação privada sem fins lucrativos, reconhecida como entidade filantrópica."
                  </p>
                </div>
                <div className="absolute -bottom-8 -right-2 md:-bottom-10 md:-right-4 text-6xl md:text-8xl font-black text-slate-100 -z-10 select-none opacity-50 md:opacity-100">1960</div>
              </div>
            </div>
          </div>
        </section>

        {/* LIDERANÇA - STACKS ON MOBILE */}
        <section className="py-12 md:py-20 bg-navy relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-12 bg-white/5 backdrop-blur-md p-8 md:p-16 rounded-[30px] md:rounded-[40px] border border-white/10">
              <div className="w-full lg:w-1/3 flex flex-col items-center text-center lg:items-start lg:text-left">
                <div className="w-24 h-24 md:w-40 md:h-40 rounded-full bg-emerald flex items-center justify-center text-white text-3xl md:text-5xl font-black mb-6 shadow-xl border-4 border-white/5">
                  {historia.provedor_nome?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "SC"}
                </div>
                <span className="text-secondary font-black uppercase tracking-widest text-[9px] md:text-[10px] mb-2">{historia.provedor_cargo || "Provedor"}</span>
                <h3 className="text-xl md:text-3xl font-black text-white">{historia.provedor_nome || "Manoel Cosmo Santana"}</h3>
                <p className="text-slate-400 text-xs md:text-sm italic mt-2">"{historia.provedor_citacao || ""}"</p>
              </div>

              <div className="w-full lg:w-2/3 space-y-4 md:space-y-6">
                <h2 className="text-2xl md:text-4xl font-black text-white">Gestão e <span className="text-secondary">Liderança</span></h2>
                <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                  A gestão da Irmandade é conduzida por uma Mesa Administrativa, órgão responsável pelas decisões estratégicas e pela manutenção da sustentabilidade institucional. Atualmente, a responsabilidade pela condução da entidade recai sobre uma liderança comprometida com o bem-estar comunitário.
                </p>
                <div className="flex flex-wrap gap-2 md:gap-4 pt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-full text-white text-[9px] md:text-xs font-bold uppercase tracking-widest border border-white/5">
                    <Award className="w-3 h-3 md:w-4 md:h-4 text-secondary" /> Tradição Secular
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-full text-white text-[9px] md:text-xs font-bold uppercase tracking-widest border border-white/5">
                    <Users className="w-3 h-3 md:w-4 md:h-4 text-emerald" /> Esforço Coletivo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION/VISION - 1 COL ON MOBILE */}
        <section className="py-16 md:py-24 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-slate-50 p-8 md:p-10 rounded-[24px] md:rounded-[32px] border border-slate-100 flex flex-col items-start hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald mb-6 md:mb-8">
                  <Target className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-navy uppercase tracking-tight mb-4">Nossa Missão</h3>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base">{historia.missao}</p>
              </div>

              <div className="bg-slate-50 p-8 md:p-10 rounded-[24px] md:rounded-[32px] border border-slate-100 flex flex-col items-start hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 md:mb-8">
                  <Eye className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-xl font-black text-navy uppercase tracking-tight mb-4">Nossa Visão</h3>
                <p className="text-slate-600 leading-relaxed text-base">{historia.visao}</p>
              </div>

              <div className="bg-navy p-8 md:p-10 rounded-[24px] md:rounded-[32px] flex flex-col items-start shadow-2xl">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/10 flex items-center justify-center text-secondary mb-6 md:mb-8">
                  <Heart className="w-6 h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight mb-6">Nossos Valores</h3>
                <div className="flex flex-wrap gap-2">
                  {(historia.valores || "").split(',').map((v, i) => (
                    <span key={i} className="px-2 py-1 md:px-3 md:py-1.5 bg-white/10 text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                      {v.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INFRASTRUCTURE - RESPONSIVE */}
        <section className="py-12 md:py-20 bg-[#faf9f6]">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mb-10 md:mb-12">
              <h2 className="text-2xl md:text-4xl font-black text-navy mb-4">
                {historia.infra_titulo || "Infraestrutura & Serviços"}
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
                {historia.infra_subtitulo || "Localizada estrategicamente no centro de Paulo de Faria, oferecendo suporte contínuo à região."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[
                { icon: Clock, title: "Urgência 24h", text: "Atendimento ininterrupto de baixa e média complexidade.", color: "emerald" },
                { icon: BedSingle, title: "Internações", text: "Leitos clínicos e cirúrgicos preparados para recuperação.", color: "secondary" },
                { icon: Stethoscope, title: "Diagnóstico", text: "Serviços integrados ao Sistema Único de Saúde (SUS).", color: "navy" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 md:gap-5">
                   <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-${item.color}/10 flex items-center justify-center text-${item.color} shrink-0`}>
                      <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                   </div>
                   <div>
                      <h4 className="font-black text-navy text-base md:text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{item.text}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY - GRID ADAPTABILITY */}
        {gallery.length > 0 && (
          <section className="py-12 md:py-20 bg-white">
            <div className="container mx-auto px-6">
               <div className="flex items-center justify-between mb-8 md:mb-12">
                  <h2 className="text-2xl md:text-4xl font-black text-navy tracking-tight">Registro <span className="text-emerald">Visual</span></h2>
                  <Camera className="w-5 h-5 md:w-6 md:h-6 text-slate-300" />
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="group relative rounded-xl md:rounded-2xl overflow-hidden shadow-md h-48 md:h-64">
                       <img src={item.imagem_url} alt={item.legenda} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-navy/60 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 md:p-6">
                          <p className="text-white font-bold text-xs leading-tight">{item.legenda}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        )}

        {/* CTA - RESPONSIVE BUTTONS */}
        <section className="py-16 md:py-24 bg-slate-50 border-t border-slate-100">
           <div className="container mx-auto px-6 text-center">
              <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
                 <h2 className="text-3xl md:text-5xl font-black text-navy leading-tight tracking-tight">
                   Juntos, continuamos a <br className="hidden md:block" /><span className="text-emerald">escrever o futuro.</span>
                 </h2>
                 <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 pt-4">
                    <a href="/#doacoes" className="px-8 py-4 bg-emerald text-white font-black rounded-xl shadow-lg hover:bg-emerald-dark transition-all text-sm md:text-base">
                       Quero Contribuir
                    </a>
                    <a href="/#servicos" className="px-8 py-4 bg-navy text-white font-black rounded-xl shadow-lg hover:bg-navy-light transition-all text-sm md:text-base">
                       Ver Especialidades
                    </a>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default History;
