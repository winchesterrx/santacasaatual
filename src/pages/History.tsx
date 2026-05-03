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
    imagem_principal: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop"
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] text-navy selection:bg-emerald selection:text-white overflow-x-hidden">
      <SEO 
        title="Nossa História | Santa Casa de Paulo de Faria" 
        description="Uma jornada de dedicação, fé e cuidado que começou em 1960. Conheça o legado da Santa Casa de Paulo de Faria." 
      />
      <SiteHeader />
      
      {/* Grainy Paper Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />

      <main>
        {/* HERO - THE MONUMENTAL START */}
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-navy">
          <div className="absolute inset-0 z-0">
            <img 
              src={historia.imagem_principal} 
              className="w-full h-full object-cover opacity-40 scale-110 animate-subtle-zoom blur-[2px]" 
              alt="Santa Casa History"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-transparent to-navy" />
          </div>

          <div className="container relative z-10 mx-auto px-6 text-center">
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-center mb-8">
                 <div className="w-24 h-24 rounded-full border-2 border-secondary/30 flex items-center justify-center p-2 rotate-12">
                    <div className="w-full h-full rounded-full border border-secondary/50 flex items-center justify-center text-secondary font-black text-xs tracking-tighter uppercase">
                       Legacy<br/>1960
                    </div>
                 </div>
              </div>
              <h1 className="text-7xl md:text-[12rem] font-black text-white leading-[0.8] tracking-tighter mb-8 italic drop-shadow-2xl">
                Memórias <br />
                <span className="not-italic text-emerald drop-shadow-none">Vivas</span>
              </h1>
              <p className="text-2xl md:text-4xl text-slate-300 font-light max-w-3xl mx-auto leading-tight italic">
                "{historia.subtitulo}"
              </p>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
             <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em]">Scroll to Explore</span>
             <div className="w-[1px] h-20 bg-gradient-to-b from-emerald to-transparent" />
          </div>
        </section>

        {/* CHAPTER I: A FUNDAÇÃO (O SONHO) */}
        <section className="py-40 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
              <div className="lg:col-span-5 sticky top-32">
                <div className="relative">
                  <span className="text-[15rem] font-black text-slate-100 absolute -top-40 -left-10 -z-10 select-none">01</span>
                  <div className="inline-block px-4 py-1 rounded-full bg-emerald/10 text-emerald text-xs font-black uppercase tracking-[0.4em] mb-6">Capítulo Primeiro</div>
                  <h2 className="text-6xl md:text-8xl font-black text-navy leading-none mb-8 tracking-tighter">
                    A Fundação <br />& <span className="text-emerald">Propósito.</span>
                  </h2>
                  <div className="w-24 h-3 bg-secondary rounded-full mb-12" />
                  
                  {/* Decorative Stamp */}
                  <div className="w-32 h-32 rounded-full border-4 border-dashed border-emerald/20 flex items-center justify-center p-4 rotate-[-15deg]">
                     <div className="text-center text-[10px] font-black text-emerald/40 uppercase tracking-widest">
                        Reconhecida<br/>como<br/>Filantrópica
                     </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="bg-white p-12 md:p-20 rounded-[80px] shadow-2xl shadow-navy/5 border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-emerald/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="prose prose-slate prose-2xl max-w-none text-slate-600 leading-relaxed font-medium 
                                 first-letter:text-9xl first-letter:font-black first-letter:text-navy first-letter:mr-6 first-letter:float-left first-letter:leading-[0.8] first-letter:mt-2">
                    <p>
                      A entidade foi constituída oficialmente em 16 de março de 1960. Sua fundação ocorreu em um período de amadurecimento administrativo da cidade, que buscava autonomia e infraestrutura próprias para atender às demandas de saúde decorrentes do crescimento populacional e da atividade agrícola da época.
                    </p>
                    <div className="my-16 p-10 bg-navy rounded-[40px] text-white relative">
                       <Quote className="absolute -top-6 -left-6 w-16 h-16 text-emerald opacity-50" />
                       <p className="text-3xl font-serif italic mb-0 leading-snug">
                         "Juridicamente, a Santa Casa é uma associação privada sem fins lucrativos, um pilar de esforço comunitário."
                       </p>
                    </div>
                    <p>
                      A instituição representa a materialização do esforço comunitário para garantir assistência médico-hospitalar à população regional de Paulo de Faria e arredores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CHAPTER II: LIDERANÇA (O COMPROMISSO) */}
        <section className="py-40 bg-navy relative overflow-hidden">
           {/* Abstract medical cross background */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[100px] border-white/5 rotate-45 pointer-events-none" />
           
           <div className="container mx-auto px-6 relative z-10">
              <div className="text-center mb-24">
                 <span className="text-[12vw] font-black text-white/5 absolute left-0 right-0 top-0 leading-none -translate-y-1/2 select-none uppercase tracking-tighter">Liderança</span>
                 <h2 className="text-5xl md:text-8xl font-black text-white mb-6 tracking-tighter">Gestão com <span className="text-secondary italic">Alma.</span></h2>
                 <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">A responsabilidade de guiar uma instituição secular através dos tempos.</p>
              </div>

              <div className="max-w-6xl mx-auto">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div className="lg:col-span-5 order-2 lg:order-1">
                       <div className="space-y-10">
                          <div className="flex items-start gap-8 group">
                             <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-navy transition-all shrink-0">
                                <Users className="w-8 h-8" />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white mb-2">Mesa Administrativa</h4>
                                <p className="text-slate-400 text-lg leading-relaxed">Órgão responsável pelas decisões estratégicas e pela manutenção da sustentabilidade institucional.</p>
                             </div>
                          </div>
                          <div className="flex items-start gap-8 group">
                             <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-emerald group-hover:bg-emerald group-hover:text-navy transition-all shrink-0">
                                <Activity className="w-8 h-8" />
                             </div>
                             <div>
                                <h4 className="text-2xl font-black text-white mb-2">Missão Assistencial</h4>
                                <p className="text-slate-400 text-lg leading-relaxed">Zelar pelo cumprimento dos valores que regem a casa desde o seu primeiro dia.</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="lg:col-span-7 order-1 lg:order-2">
                       <div className="bg-gradient-to-br from-white/10 to-transparent p-1 rounded-[60px]">
                          <div className="bg-navy-light/60 backdrop-blur-2xl p-12 md:p-20 rounded-[58px] border border-white/10">
                             <div className="flex flex-col md:flex-row items-center gap-10">
                                <div className="relative">
                                   <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-emerald flex items-center justify-center text-white text-5xl md:text-7xl font-black shadow-2xl relative z-10 border-4 border-white/10">
                                      MC
                                   </div>
                                   <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg animate-bounce">
                                      <Award className="w-8 h-8 text-navy" />
                                   </div>
                                </div>
                                <div className="text-center md:text-left space-y-4">
                                   <span className="text-secondary font-black uppercase tracking-[0.3em] text-xs">O Provedor</span>
                                   <h3 className="text-4xl md:text-5xl font-black text-white leading-tight">Manoel Cosmo Santana</h3>
                                   <p className="text-slate-400 text-xl font-medium italic">"Conhecido carinhosamente como Cosminho"</p>
                                   <div className="pt-6 flex justify-center md:justify-start">
                                      <div className="px-6 py-2 rounded-full border border-white/20 text-white/60 text-sm font-bold uppercase tracking-widest">Desde 2017 no cargo</div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* CHAPTER III: INFRAESTRUTURA (A ESTRUTURA DO CUIDADO) */}
        <section className="py-40 relative">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mb-24">
               <span className="text-emerald font-black uppercase tracking-[0.4em] text-sm mb-6 block">Capítulo Terceiro</span>
               <h2 className="text-6xl md:text-[9rem] font-black text-navy leading-[0.8] tracking-tighter mb-12">
                 Onde a Vida <br /><span className="text-emerald">Acontece.</span>
               </h2>
               <p className="text-2xl text-slate-500 font-medium leading-relaxed">
                 Sediada na Rua Zenha Ribeiro, 958, no coração de Paulo de Faria, nossa unidade é muito mais que um prédio; é um porto seguro.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-xl shadow-navy/5 group hover:-translate-y-4 transition-all duration-500">
                  <div className="w-20 h-20 rounded-3xl bg-emerald/10 flex items-center justify-center text-emerald mb-10 group-hover:bg-emerald group-hover:text-white transition-all shadow-lg shadow-emerald/5">
                     <Clock className="w-10 h-10" />
                  </div>
                  <h4 className="text-3xl font-black mb-6">Urgência 24h</h4>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">Prontos para atender qualquer intercorrência a qualquer hora do dia ou da noite.</p>
               </div>

               <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-xl shadow-navy/5 group hover:-translate-y-4 transition-all duration-500">
                  <div className="w-20 h-20 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mb-10 group-hover:bg-secondary group-hover:text-white transition-all shadow-lg shadow-secondary/5">
                     <BedSingle className="w-10 h-10" />
                  </div>
                  <h4 className="text-3xl font-black mb-6">Internações</h4>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">Leitos clínicos e cirúrgicos equipados para garantir uma recuperação digna e segura.</p>
               </div>

               <div className="bg-white p-12 rounded-[60px] border border-slate-100 shadow-xl shadow-navy/5 group hover:-translate-y-4 transition-all duration-500">
                  <div className="w-20 h-20 rounded-3xl bg-navy/10 flex items-center justify-center text-navy mb-10 group-hover:bg-navy group-hover:text-white transition-all shadow-lg shadow-navy/5">
                     <Stethoscope className="w-10 h-10" />
                  </div>
                  <h4 className="text-3xl font-black mb-6">Diagnóstico</h4>
                  <p className="text-slate-500 text-lg leading-relaxed font-medium">Serviços de terapia e diagnósticos precisos integrados ao Sistema Único de Saúde (SUS).</p>
               </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION - THE CORE DNA */}
        <section className="py-40 bg-emerald relative overflow-hidden">
           <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cross-stripes.png')]" />
           <div className="container mx-auto px-6 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                 <div className="space-y-12">
                    <div className="p-12 bg-white/10 backdrop-blur-xl rounded-[60px] border border-white/20">
                       <Target className="w-16 h-16 text-white mb-8" />
                       <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Nossa Missão</h3>
                       <p className="text-2xl text-white/90 leading-relaxed font-light italic">"{historia.missao}"</p>
                    </div>
                    <div className="p-12 bg-navy/20 backdrop-blur-xl rounded-[60px] border border-white/5">
                       <Eye className="w-16 h-16 text-secondary mb-8" />
                       <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter">Nossa Visão</h3>
                       <p className="text-2xl text-white/80 leading-relaxed font-light italic">"{historia.visao}"</p>
                    </div>
                 </div>
                 
                 <div className="flex flex-col justify-center">
                    <h3 className="text-6xl md:text-[10rem] font-black text-white/20 leading-none tracking-tighter mb-12 select-none">Valores</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       {historia.valores.split(',').map((v, i) => (
                         <div key={i} className="px-10 py-8 bg-white rounded-[32px] shadow-2xl shadow-emerald/40 flex items-center justify-center text-center">
                            <span className="text-2xl font-black text-navy uppercase tracking-tighter">{v.trim()}</span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* GALLERY - THE CHRONICLE OF TIME */}
        {gallery.length > 0 && (
          <section className="py-40 bg-slate-50">
            <div className="container mx-auto px-6">
               <div className="flex items-center justify-between mb-24">
                  <h2 className="text-5xl md:text-8xl font-black text-navy tracking-tight">Registro <span className="text-emerald italic">Visual.</span></h2>
                  <div className="hidden md:flex items-center gap-6">
                     <div className="w-32 h-32 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300">
                        <Camera className="w-12 h-12" />
                     </div>
                  </div>
               </div>

               <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
                  {gallery.map((item, idx) => (
                    <div key={item.id} className="break-inside-avoid relative group">
                       <div className="relative rounded-[50px] overflow-hidden shadow-2xl bg-white p-4 border border-slate-100 transition-all duration-700 hover:rotate-1 hover:scale-105">
                          <img 
                            src={item.imagem_url} 
                            alt={item.legenda} 
                            className="w-full h-auto rounded-[40px] grayscale group-hover:grayscale-0 transition-all duration-1000" 
                          />
                          <div className="p-8 text-center">
                             <p className="text-navy font-black text-xl uppercase tracking-tighter leading-tight">{item.legenda}</p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        )}

        {/* FINAL CALL - THE FUTURE */}
        <section className="py-40 relative">
           <div className="container mx-auto px-6 text-center">
              <div className="max-w-5xl mx-auto space-y-16">
                 <h2 className="text-7xl md:text-[12rem] font-black text-navy leading-[0.8] tracking-[ -0.05em] mb-12">
                   O Cuidado <br /><span className="text-emerald">Continua.</span>
                 </h2>
                 <p className="text-3xl md:text-5xl text-slate-400 font-light max-w-4xl mx-auto leading-tight italic">
                   "A história não se encerra, ela se renova a cada batimento cardíaco em nossas salas de atendimento."
                 </p>
                 <div className="flex flex-wrap justify-center gap-10 pt-12">
                    <a href="/#doacoes" className="px-16 py-8 bg-emerald text-white font-black rounded-full text-2xl shadow-2xl shadow-emerald/30 hover:scale-105 transition-transform">
                       Contribuir com o Futuro
                    </a>
                    <a href="/#servicos" className="px-16 py-8 bg-navy text-white font-black rounded-full text-2xl shadow-2xl shadow-navy/30 hover:scale-105 transition-transform">
                       Conhecer Nossos Serviços
                    </a>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <SiteFooter />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes subtle-zoom {
          0% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-subtle-zoom { animation: subtle-zoom 30s infinite alternate ease-in-out; }
      `}} />
    </div>
  );
};

export default History;
