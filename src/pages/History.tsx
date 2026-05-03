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
    <div className="min-h-screen bg-[#faf9f6] text-navy selection:bg-emerald selection:text-white overflow-x-hidden">
      <SEO 
        title="Nossa História | Santa Casa de Paulo de Faria" 
        description="Uma jornada de dedicação, fé e cuidado que começou em 1960. Conheça o legado da Santa Casa de Paulo de Faria." 
      />
      <SiteHeader />
      
      {/* Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <main>
        {/* HERO SECTION - THE AWAKENING */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={historia.imagem_principal} 
              className="w-full h-full object-cover scale-110 animate-subtle-zoom" 
              alt="Santa Casa History"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/40 to-transparent" />
            
            {/* Geometric Masks */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald/20 skew-x-[-20deg] translate-x-1/2 backdrop-blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/10 rounded-full blur-[120px] -translate-x-1/4 translate-y-1/4" />
          </div>

          <div className="container relative z-10 mx-auto px-6">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="h-[2px] w-12 bg-secondary animate-width" />
                <span className="text-secondary font-black uppercase tracking-[0.4em] text-sm">Desde 1960</span>
              </div>
              <h1 className="text-6xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-12 mix-blend-difference">
                O Legado <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-emerald-light drop-shadow-2xl">do Cuidado</span>
              </h1>
              <p className="text-xl md:text-3xl text-white/80 font-light max-w-2xl leading-relaxed border-l-4 border-emerald pl-8 py-2">
                {historia.subtitulo}
              </p>
            </div>
          </div>

          {/* Floating Year Label */}
          <div className="absolute right-[-5%] bottom-[10%] text-[20vw] font-black text-white/5 select-none leading-none rotate-90">
            1960
          </div>
        </section>

        {/* STORYTELLING SECTION 1 - THE ORIGIN */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 rounded-[60px] overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-emerald/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <img 
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full aspect-[4/5] object-cover transition-transform duration-[2s] group-hover:scale-110" 
                    alt="Fundação"
                  />
                  {/* Image Mask Mask Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-navy/90 to-transparent">
                    <span className="text-emerald font-black text-xs uppercase tracking-widest block mb-2">Capítulo I</span>
                    <h3 className="text-3xl font-black text-white">A Fundação</h3>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 border-[20px] border-secondary/10 rounded-full animate-pulse" />
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald/5 rounded-[80px] rotate-12 -z-10" />
              </div>

              <div className="lg:w-1/2 space-y-8">
                <h2 className="text-5xl md:text-7xl font-black text-navy leading-none tracking-tight">
                  Nasceu do esforço <br /><span className="text-emerald">comunitário.</span>
                </h2>
                <div className="w-20 h-2 bg-secondary rounded-full" />
                <div 
                  className="text-xl text-slate-600 leading-relaxed font-medium space-y-6"
                  dangerouslySetInnerHTML={{ __html: historia.texto_historia.split('</h3>')[1]?.split('<h3')[0] || historia.texto_historia }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* LIDERANÇA - THE MESA ADMINISTRATIVA */}
        <section className="py-32 bg-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 text-secondary text-xs font-black uppercase tracking-[0.3em] mb-6">
                  Gestão Estratégica
                </div>
                <h2 className="text-5xl md:text-7xl font-black text-white mb-10 leading-none">
                  Liderança e <br /><span className="text-secondary">Tradição</span>
                </h2>
                <div className="bg-white/5 backdrop-blur-xl rounded-[40px] p-10 border border-white/10 relative">
                   <div className="absolute -top-6 -right-6 w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-navy shadow-xl rotate-12">
                      <Award className="w-10 h-10" />
                   </div>
                   <p className="text-2xl text-slate-300 font-serif italic mb-8 leading-relaxed">
                     "O cargo de provedor, seguindo a tradição secular das Misericórdias, é uma função de liderança que coordena as relações entre o hospital, o poder público e a comunidade local..."
                   </p>
                   <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-emerald flex items-center justify-center text-white text-3xl font-black">
                        MC
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white">Manoel Cosmo Santana</h4>
                        <p className="text-emerald font-bold uppercase tracking-widest text-sm">(Cosminho) · Provedor Atual</p>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 order-1 lg:order-2">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-emerald/30 rounded-[80px] blur-3xl group-hover:bg-secondary/20 transition-colors" />
                    <img 
                      src="https://images.unsplash.com/photo-1576091160550-2173bdb999ef?q=80&w=2070&auto=format&fit=crop" 
                      className="relative z-10 w-full aspect-square object-cover rounded-[80px] border-8 border-white/5 shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]" 
                      alt="Gestão"
                    />
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VALUES - THE DNA */}
        <section className="py-40 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-12 rounded-[50px] shadow-xl shadow-navy/5 border border-slate-100 flex flex-col items-center text-center group hover:bg-navy hover:text-white transition-all duration-500">
                <div className="w-24 h-24 rounded-[32px] bg-emerald/10 flex items-center justify-center text-emerald mb-10 group-hover:bg-emerald group-hover:text-white transition-all">
                  <Target className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-6">Missão</h3>
                <p className="text-lg text-slate-500 group-hover:text-slate-300 transition-colors leading-relaxed">
                  {historia.missao}
                </p>
              </div>

              <div className="bg-emerald p-12 rounded-[50px] shadow-2xl shadow-emerald/20 flex flex-col items-center text-center text-white scale-110 z-10 transition-transform hover:scale-[1.12]">
                <div className="w-24 h-24 rounded-[32px] bg-white/20 flex items-center justify-center text-white mb-10 backdrop-blur-md">
                  <Eye className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-6">Visão</h3>
                <p className="text-lg text-white/90 leading-relaxed">
                  {historia.visao}
                </p>
              </div>

              <div className="bg-white p-12 rounded-[50px] shadow-xl shadow-navy/5 border border-slate-100 flex flex-col items-center text-center group hover:bg-navy hover:text-white transition-all duration-500">
                <div className="w-24 h-24 rounded-[32px] bg-secondary/10 flex items-center justify-center text-secondary mb-10 group-hover:bg-secondary group-hover:text-white transition-all">
                  <Heart className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black mb-6">Valores</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {historia.valores.split(',').map((v, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 text-xs font-black rounded-full border border-slate-200 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20 transition-all">
                      {v.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY - THE VISUAL CHRONICLE */}
        {gallery.length > 0 && (
          <section className="py-32 bg-slate-100 relative">
            {/* SVG Background Mask/Shape */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] fill-white">
               <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[100px]">
                  <path d="M1200 120L0 120 309.19 8C444.79 3.1 482.9 4.4 588.19 33.3 700.5 64.7 723.2 63.1 857.47 33.3 968.8 8.7 1011.6 3.1 1200 120z"></path>
               </svg>
            </div>

            <div className="container mx-auto px-6 pt-20">
               <div className="max-w-3xl mb-20">
                  <div className="inline-flex items-center gap-2 text-emerald font-black uppercase tracking-[0.2em] text-xs mb-4">
                     <Camera className="w-5 h-5" /> Crônica Visual
                  </div>
                  <h2 className="text-5xl md:text-7xl font-black text-navy leading-none">
                    Momentos que <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald to-secondary">eternizam</span> o cuidado.
                  </h2>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {gallery.map((item, idx) => (
                    <div 
                      key={item.id} 
                      className={`relative overflow-hidden shadow-2xl transition-all duration-700 hover:scale-[1.03]
                                  ${idx % 3 === 0 ? 'md:col-span-2 md:row-span-2 rounded-[60px]' : 'rounded-[40px]'}`}
                    >
                       <img 
                         src={item.imagem_url} 
                         alt={item.legenda} 
                         className="w-full h-full object-cover aspect-square" 
                       />
                       <div className="absolute inset-0 bg-navy/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-10 backdrop-blur-sm">
                          <p className="text-white font-black text-xl leading-snug">{item.legenda}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        )}

        {/* CTA - THE CONTINUATION */}
        <section className="py-40 bg-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/white-diamond.png')] opacity-20" />
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="max-w-5xl mx-auto">
               <h2 className="text-6xl md:text-[10rem] font-black text-navy/5 leading-none absolute left-0 right-0 top-1/2 -translate-y-1/2 select-none uppercase tracking-tighter">
                 Paulo de Faria
               </h2>
               <div className="relative z-20 space-y-12">
                  <h2 className="text-5xl md:text-8xl font-black text-navy leading-[0.9] tracking-tighter">
                    O futuro é <br /><span className="text-emerald">filantrópico.</span>
                  </h2>
                  <p className="text-xl md:text-3xl text-slate-400 font-light max-w-3xl mx-auto">
                    A Santa Casa não é apenas um prédio, é o coração pulsante de uma cidade que cuida de si mesma.
                  </p>
                  <div className="flex flex-wrap justify-center gap-8 pt-8">
                    <a href="/#doacoes" className="group relative px-12 py-6 bg-navy text-white font-black rounded-full overflow-hidden shadow-2xl">
                       <span className="relative z-10 text-xl">Quero Contribuir</span>
                       <div className="absolute inset-0 bg-emerald translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </a>
                    <a href="/#servicos" className="group relative px-12 py-6 border-4 border-navy text-navy font-black rounded-full overflow-hidden">
                       <span className="relative z-10 text-xl">Conhecer Especialidades</span>
                    </a>
                  </div>
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
        @keyframes width {
          0% { width: 0; }
          100% { width: 48px; }
        }
        .animate-subtle-zoom { animation: subtle-zoom 20s infinite alternate ease-in-out; }
        .animate-width { animation: width 1s forwards; }
      `}} />
    </div>
  );
};

export default History;
