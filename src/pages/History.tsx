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
    missao: "Prestar assistência à saúde de forma humanizada, resolutiva e sustentável, promovendo o bem-estar da comunidade com excelência e ética.",
    visao: "Ser a principal referência em assistência médico-hospitalar e filantrópica na região noroeste paulista.",
    valores: "Humanização, Ética e Transparência, Excelência Técnica, Responsabilidade Social",
    imagem_principal: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop",
    provedor_nome: "Manoel Cosmo Santana",
    provedor_cargo: "O PROVEDOR",
    provedor_citacao: "Conhecido carinhosamente como Cosminho"
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-navy selection:bg-emerald selection:text-white overflow-x-hidden">
      <SEO 
        title="Nossa História | Santa Casa de Paulo de Faria" 
        description="Uma jornada de dedicação, fé e cuidado que começou em 1960. Conheça o legado da Santa Casa de Paulo de Faria." 
      />
      <SiteHeader />
      
      {/* Texture Layer */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      <main>
        {/* HERO - IMPACTFUL */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-navy">
          <div className="absolute inset-0 z-0">
            <img 
              src={historia.imagem_principal} 
              className="w-full h-full object-cover opacity-40 scale-105" 
              alt="Santa Casa History"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/20 to-navy" />
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald/20 border border-emerald/30 text-emerald-400 text-xs font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md animate-fade-in">
                 <HistoryIcon className="w-5 h-5" /> Legado desde 1960
              </div>
              <h1 className="text-6xl md:text-[100px] font-black text-white leading-none mb-8 tracking-tighter drop-shadow-2xl">
                Nossa <span className="text-emerald italic">História.</span>
              </h1>
              <p className="text-lg md:text-2xl text-slate-200 font-medium max-w-3xl mx-auto leading-relaxed italic opacity-90 border-l-4 border-emerald pl-6 text-left">
                "{historia.subtitulo}"
              </p>
            </div>
          </div>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-2">
              <div className="w-1 h-2 bg-emerald rounded-full" />
            </div>
          </div>
        </section>

        {/* CAPÍTULO I - FUNDAÇÃO */}
        <section className="py-24 md:py-32 relative bg-white overflow-hidden">
          <div className="absolute -left-20 top-0 text-[20vw] font-black text-slate-50 select-none">1960</div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <span className="text-emerald font-black uppercase tracking-widest text-sm mb-4 block">Capítulo Primeiro</span>
                <h2 className="text-5xl md:text-7xl font-black text-navy mb-8 leading-[0.9] tracking-tighter">
                  A Fundação & <br /> <span className="text-emerald">Propósito.</span>
                </h2>
                <div className="w-24 h-2 bg-secondary mb-10" />
                <div 
                  className="prose prose-slate prose-xl text-slate-600 leading-relaxed font-medium first-letter:text-7xl first-letter:font-black first-letter:text-emerald first-letter:mr-3 first-letter:float-left" 
                  dangerouslySetInnerHTML={{ __html: historia.texto_historia }}
                />
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-4 bg-emerald/5 rounded-[40px] -rotate-2 group-hover:rotate-0 transition-transform duration-500" />
                <div className="relative bg-slate-50 rounded-[40px] p-12 md:p-20 border border-slate-100 shadow-2xl">
                  <Quote className="w-16 h-16 text-emerald/10 absolute top-10 left-10" />
                  <p className="text-2xl md:text-3xl font-serif italic text-navy leading-tight relative z-10">
                    "Juridicamente, a Santa Casa é uma associação privada sem fins lucrativos, reconhecida como entidade filantrópica dedicada ao bem comum."
                  </p>
                  <div className="mt-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-emerald font-black uppercase tracking-widest text-xs">A Essência</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSÃO & VISÃO - THE "CARDS" STYLE */}
        <section className="py-24 bg-emerald relative overflow-hidden">
           {/* Background Circles */}
           <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
           <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-navy/10 rounded-full blur-3xl" />

           <div className="container mx-auto px-6 relative z-10">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Missão Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-12 md:p-16 rounded-[50px] flex flex-col items-start group hover:bg-white/15 transition-all duration-500">
                   <div className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center text-white mb-10 group-hover:scale-110 transition-transform">
                      <Target className="w-10 h-10" />
                   </div>
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 leading-none">Nossas <br /><span className="opacity-50">Missões</span></h3>
                   <p className="text-white text-xl md:text-2xl font-medium leading-relaxed italic border-l-2 border-white/30 pl-6">
                      "{historia.missao}"
                   </p>
                </div>

                {/* Visão Card */}
                <div className="bg-navy/30 backdrop-blur-xl border border-white/10 p-12 md:p-16 rounded-[50px] flex flex-col items-start group hover:bg-navy/40 transition-all duration-500">
                   <div className="w-20 h-20 rounded-full border-4 border-white/10 flex items-center justify-center text-white mb-10 group-hover:scale-110 transition-transform">
                      <Eye className="w-10 h-10" />
                   </div>
                   <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8 leading-none">Nossa <br /><span className="text-emerald">Visão</span></h3>
                   <p className="text-slate-200 text-xl md:text-2xl font-medium leading-relaxed italic border-l-2 border-white/10 pl-6">
                      "{historia.visao}"
                   </p>
                </div>
             </div>
           </div>
        </section>

        {/* VALORES - THE CLEAN WHITE CARDS ON GREEN */}
        <section className="py-24 bg-emerald relative border-t border-white/10">
          <div className="container mx-auto px-6">
             <div className="text-center mb-16 relative">
                <h2 className="text-[120px] md:text-[200px] font-black text-white opacity-10 absolute left-1/2 -top-20 md:-top-32 -translate-x-1/2 select-none uppercase">Valores</h2>
                <h3 className="text-3xl md:text-5xl font-black text-white relative z-10 tracking-tight">Os pilares que nos guiam.</h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {(historia.valores || "").split(',').map((v, i) => (
                  <div key={i} className="bg-white p-8 rounded-[30px] shadow-2xl flex items-center justify-center text-center transform hover:-translate-y-2 transition-all duration-300 min-h-[120px]">
                     <span className="text-navy font-black uppercase tracking-wider text-sm md:text-lg">{v.trim()}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* CHAPTER III - ONDE A VIDA ACONTECE */}
        <section className="py-24 md:py-40 bg-[#faf9f6] relative overflow-hidden">
          <div className="container mx-auto px-6">
             <div className="max-w-4xl">
                <span className="text-emerald font-black uppercase tracking-[0.4em] text-xs mb-6 block">Capítulo Terceiro</span>
                <h2 className="text-6xl md:text-8xl font-black text-navy leading-[0.8] tracking-tighter mb-12">
                   Onde a Vida <br /> <span className="text-emerald italic">Acontece.</span>
                </h2>
                <p className="text-2xl md:text-3xl text-slate-500 font-medium leading-tight max-w-2xl mb-20">
                   Sediada na Rua Zenha Ribeiro, 958, no coração de Paulo de Faria, nossa unidade é muito mais que um prédio; é um porto seguro.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: Clock, title: "Urgência 24h", text: "Prontos para atender qualquer intercorrência a qualquer hora do dia ou da noite.", color: "emerald" },
                    { icon: BedSingle, title: "Acolhimento", text: "Leitos preparados para o cuidado integral e recuperação do paciente.", color: "secondary" },
                    { icon: Stethoscope, title: "Excelência", text: "Corpo clínico altamente qualificado dedicado à saúde regional.", color: "navy" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 group hover:shadow-2xl transition-all">
                       <div className={`w-16 h-16 rounded-2xl bg-${item.color}/10 flex items-center justify-center text-${item.color} mb-8 group-hover:rotate-6 transition-transform`}>
                          <item.icon className="w-8 h-8" />
                       </div>
                       <h4 className="text-2xl font-black text-navy mb-4 tracking-tight">{item.title}</h4>
                       <p className="text-slate-500 leading-relaxed font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

        {/* LIDERANÇA - GESTÃO COM ALMA */}
        <section className="py-32 bg-navy relative overflow-hidden">
           {/* Big Background Text */}
           <h2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-white opacity-5 select-none tracking-tighter">LIDERANÇA</h2>

           <div className="container mx-auto px-6 relative z-10 text-center">
             <div className="max-w-4xl mx-auto mb-20">
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-none">
                   Gestão com <br /> <span className="text-emerald italic">Alma.</span>
                </h2>
                <p className="text-xl md:text-2xl text-slate-400 font-medium italic">
                   A responsabilidade de guiar uma instituição secular através dos tempos.
                </p>
             </div>

             <div className="max-w-md mx-auto relative">
                <div className="absolute -inset-6 bg-emerald/10 blur-3xl rounded-full" />
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-12 rounded-[50px] relative z-10 group hover:border-emerald/30 transition-all">
                   <div className="relative inline-block mb-8">
                      <div className="w-32 h-32 rounded-full bg-emerald flex items-center justify-center text-white text-4xl font-black shadow-2xl relative z-10">
                        {historia.provedor_nome?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "MC"}
                      </div>
                      <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-lg transform rotate-12 z-20">
                         <Award className="w-6 h-6 text-navy" />
                      </div>
                   </div>
                   <span className="text-emerald font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">O PROVEDOR</span>
                   <h3 className="text-3xl font-black text-white mb-4 tracking-tight">{historia.provedor_nome || "Manoel Cosmo Santana"}</h3>
                   <p className="text-slate-400 text-lg italic leading-relaxed border-t border-white/5 pt-6">
                      "{historia.provedor_citacao || "Conhecido carinhosamente como Cosminho"}"
                   </p>
                   <div className="mt-8 pt-8 border-t border-white/5 flex justify-center">
                      <div className="px-6 py-2 bg-white/5 rounded-full text-[10px] text-slate-500 font-black tracking-widest uppercase">
                         Desde 2017 sem carga
                      </div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* GALLERY - REGISTRO VISUAL */}
        {gallery.length > 0 && (
          <section className="py-32 bg-white">
            <div className="container mx-auto px-6">
               <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                  <div>
                    <h2 className="text-5xl md:text-7xl font-black text-navy tracking-tighter leading-none">Registro <br /> <span className="text-emerald italic">Visual.</span></h2>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
                     <Camera className="w-5 h-5 text-emerald" />
                     <span className="text-xs font-black text-navy uppercase tracking-widest">Memórias & Estrutura</span>
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {gallery.map((item) => (
                    <div key={item.id} className="group bg-white rounded-[40px] overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl transition-all h-[400px] flex flex-col">
                       <div className="flex-1 overflow-hidden">
                          <img 
                            src={item.imagem_url} 
                            alt={item.legenda} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          />
                       </div>
                       <div className="p-8 text-center border-t border-slate-50">
                          <h4 className="text-navy font-black uppercase tracking-tighter text-lg leading-tight">{item.legenda}</h4>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-32 bg-slate-50 relative overflow-hidden">
           <div className="container mx-auto px-6 text-center relative z-10">
              <div className="max-w-4xl mx-auto space-y-12">
                 <h2 className="text-5xl md:text-8xl font-black text-navy leading-none tracking-tighter">
                   Juntos, escrevemos o <br /><span className="text-emerald italic underline decoration-secondary decoration-4 underline-offset-8">futuro.</span>
                 </h2>
                 <div className="flex flex-col sm:flex-row justify-center gap-6 pt-10">
                    <a href="/#doacoes" className="px-12 py-6 bg-emerald text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(76,161,129,0.3)] hover:scale-105 hover:bg-emerald-dark transition-all text-lg group">
                       Quero Contribuir <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
                    </a>
                    <a href="/#servicos" className="px-12 py-6 bg-navy text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.2)] hover:scale-105 hover:bg-navy-light transition-all text-lg">
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
