import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Award, Heart, History as HistoryIcon, Target, Eye, Users, Camera } from "lucide-react";
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
    <div className="min-h-screen bg-[#FDFCFB]">
      <SEO 
        title="Nossa História" 
        description="Conheça a trajetória, missão, visão e valores da Santa Casa de Misericórdia de Paulo de Faria." 
      />
      <SiteHeader />
      
      <main>
        {/* Hero Section - Ultra Premium */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-navy">
          <div className="absolute inset-0 z-0">
             <img 
               src={historia.imagem_principal} 
               className="w-full h-full object-cover opacity-30 scale-105 transition-transform duration-[10s] hover:scale-100" 
               alt="Fachada Santa Casa"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-navy/60 to-navy" />
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-20" />
          </div>
          
          <div className="container relative z-10 mx-auto px-6 pt-20">
            <div className="max-w-5xl mx-auto text-center">
              <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald/10 border border-emerald/20 text-emerald text-xs font-black uppercase tracking-[0.3em] mb-8 backdrop-blur-md animate-fade-in">
                <HistoryIcon className="w-4 h-4" /> Tradição desde 1960
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tighter">
                Nossa <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-secondary">História</span>
              </h1>
              <div className="h-1.5 w-24 bg-secondary mx-auto mb-8 rounded-full" />
              <p className="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed italic opacity-90">
                "{historia.subtitulo}"
              </p>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-secondary rounded-full" />
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-8 lg:col-start-3">
                <div className="relative">
                  <div className="absolute -left-12 top-0 text-[12rem] font-black text-slate-100 -z-10 leading-none select-none">
                    1960
                  </div>
                  <div 
                    className="prose prose-slate prose-xl max-w-none text-slate-700 leading-[1.8] font-medium 
                               first-letter:text-7xl first-letter:font-black first-letter:text-navy first-letter:mr-3 first-letter:float-left
                               [&>h3]:text-3xl [&>h3]:font-black [&>h3]:text-navy [&>h3]:mt-16 [&>h3]:mb-6 [&>h3]:flex [&>h3]:items-center [&>h3]:gap-4
                               [&>p]:mb-8 [&>ul]:space-y-4 [&>ul]:mb-8 [&>li]:flex [&>li]:gap-3 [&>li]:before:content-[''] [&>li]:before:w-2 [&>li]:before:h-2 [&>li]:before:bg-emerald [&>li]:before:rounded-full [&>li]:before:mt-3" 
                    dangerouslySetInnerHTML={{ __html: historia.texto_historia }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Vision Values - Modern Glassmorphism */}
        <section className="py-32 bg-navy relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-emerald rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Compromisso com a <span className="text-secondary">Vida</span></h2>
               <p className="text-slate-400 font-medium">Os pilares que sustentam nossa jornada diária.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {/* Missão */}
               <div className="group relative p-1 bg-gradient-to-br from-emerald/20 to-transparent rounded-[40px] transition-all hover:scale-105 duration-500">
                  <div className="h-full bg-navy-light/40 backdrop-blur-xl p-10 rounded-[38px] border border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-emerald flex items-center justify-center text-white mb-8 shadow-lg shadow-emerald/20">
                       <Target className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Missão</h3>
                    <p className="text-slate-300 leading-relaxed font-medium">{historia.missao}</p>
                  </div>
               </div>

               {/* Visão */}
               <div className="group relative p-1 bg-gradient-to-br from-secondary/20 to-transparent rounded-[40px] transition-all hover:scale-105 duration-500">
                  <div className="h-full bg-navy-light/40 backdrop-blur-xl p-10 rounded-[38px] border border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-white mb-8 shadow-lg shadow-secondary/20">
                       <Eye className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Visão</h3>
                    <p className="text-slate-300 leading-relaxed font-medium">{historia.visao}</p>
                  </div>
               </div>

               {/* Valores */}
               <div className="group relative p-1 bg-gradient-to-br from-white/10 to-transparent rounded-[40px] transition-all hover:scale-105 duration-500">
                  <div className="h-full bg-navy-light/40 backdrop-blur-xl p-10 rounded-[38px] border border-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-8">
                       <Heart className="w-8 h-8 text-secondary" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Valores</h3>
                    <div className="flex flex-wrap gap-3">
                      {historia.valores.split(',').map((v, i) => (
                        <span key={i} className="px-4 py-1.5 bg-white/5 text-slate-200 text-xs font-bold rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                          {v.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Gallery Section - Masonry-ish */}
        {gallery.length > 0 && (
          <section className="py-32 bg-slate-50">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-navy tracking-tight">Memórias em <span className="text-emerald">Foco</span></h2>
                  <p className="text-slate-500 font-medium mt-4 text-lg">Um registro visual das décadas de dedicação à Paulo de Faria.</p>
                </div>
                <div className="w-20 h-20 rounded-full border-2 border-emerald/20 flex items-center justify-center animate-pulse">
                   <Camera className="w-8 h-8 text-emerald" />
                </div>
              </div>

              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {gallery.map((item) => (
                  <div key={item.id} className="break-inside-avoid group relative rounded-[32px] overflow-hidden shadow-xl bg-white border-4 border-white transition-all hover:shadow-2xl hover:-translate-y-2">
                    <img 
                      src={item.imagem_url} 
                      alt={item.legenda} 
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                      <span className="text-secondary font-black uppercase tracking-widest text-[10px] mb-2">Registro Histórico</span>
                      <p className="text-white font-bold text-lg leading-tight">{item.legenda}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Impact Numbers - Elegant Dark Mode */}
        <section className="py-24 bg-white">
           <div className="container mx-auto px-6">
             <div className="bg-navy rounded-[60px] p-12 md:p-24 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
                   <div className="space-y-2">
                     <div className="text-6xl md:text-8xl font-black text-white tracking-tighter">60<span className="text-emerald">+</span></div>
                     <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Anos de Excelência</div>
                   </div>
                   <div className="space-y-2 border-y md:border-y-0 md:border-x border-white/10 py-12 md:py-0">
                     <div className="text-6xl md:text-8xl font-black text-secondary tracking-tighter">100<span className="text-white text-4xl">%</span></div>
                     <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Filantropia Real</div>
                   </div>
                   <div className="space-y-2">
                     <div className="text-6xl md:text-8xl font-black text-white tracking-tighter">24<span className="text-emerald">h</span></div>
                     <div className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Sempre Presentes</div>
                   </div>
                </div>
             </div>
           </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-[#FDFCFB]">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center space-y-12">
                 <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-[0.2em] border border-secondary/20">
                    <Users className="w-4 h-4" /> Comunidade Paulo-Fariense
                 </div>
                 <h2 className="text-4xl md:text-7xl font-black text-navy leading-[1.1] tracking-tight">
                    Ajude-nos a escrever os <span className="text-emerald">próximos 60 anos</span>.
                 </h2>
                 <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">
                   Cada doação e cada apoio fortalece nossa missão de cuidar de quem mais precisa. Seja parte desta corrente do bem.
                 </p>
                 <div className="flex flex-wrap justify-center gap-6 pt-6">
                    <a 
                      href="/#doacoes" 
                      className="px-12 py-5 bg-emerald text-white font-black rounded-2xl hover:bg-emerald-dark transition-all hover:scale-105 shadow-2xl shadow-emerald/30 text-lg"
                    >
                      Quero Contribuir
                    </a>
                    <a 
                      href="/#servicos" 
                      className="px-12 py-5 bg-navy text-white font-black rounded-2xl hover:bg-navy-light transition-all hover:scale-105 shadow-2xl shadow-navy/30 text-lg"
                    >
                      Conhecer Serviços
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
