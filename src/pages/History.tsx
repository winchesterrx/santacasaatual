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
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title="Nossa História" 
        description="Conheça a trajetória, missão, visão e valores da Santa Casa de Misericórdia de Paulo de Faria." 
      />
      <SiteHeader />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-navy">
          <div className="absolute inset-0 z-0">
             <img 
               src={historia.imagem_principal} 
               className="w-full h-full object-cover opacity-20" 
               alt="Fachada Santa Casa"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-navy" />
          </div>
          
          <div className="container relative z-10 mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <HistoryIcon className="w-4 h-4" /> Desde 1960 servindo com amor
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight max-w-5xl mx-auto">
              {historia.titulo}
            </h1>
            <p className="text-primary-foreground/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed italic">
              "{historia.subtitulo}"
            </p>
          </div>
        </section>

        {/* Timeline / Content */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto mb-32">
              <div className="prose prose-slate prose-lg max-w-none text-slate-600 leading-relaxed" 
                   dangerouslySetInnerHTML={{ __html: historia.texto_historia }} />
            </div>

            {/* Mission Vision Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald mb-8">
                     <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-4">Missão</h3>
                  <p className="text-slate-500 leading-relaxed">{historia.missao}</p>
               </div>

               <div className="bg-navy p-10 rounded-[40px] shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-secondary mb-8">
                     <Eye className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Visão</h3>
                  <p className="text-primary-foreground/70 leading-relaxed">{historia.visao}</p>
               </div>

               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8">
                     <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-4">Valores</h3>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {historia.valores.split(',').map((v, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-bold rounded-full border border-slate-100">
                        {v.trim()}
                      </span>
                    ))}
                  </div>
               </div>
            </div>

            {/* Gallery Section */}
            {gallery.length > 0 && (
              <div className="mb-32">
                <div className="flex items-center justify-between mb-12">
                  <h2 className="text-3xl md:text-4xl font-black text-navy">Galeria <span className="text-emerald">Histórica</span></h2>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Camera className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-widest">Memórias Registradas</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gallery.map((item) => (
                    <div key={item.id} className="group relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-lg">
                      <img 
                        src={item.imagem_url} 
                        alt={item.legenda} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      {item.legenda && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                          <p className="text-white font-bold text-sm leading-snug">{item.legenda}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Numbers */}
            <div className="bg-emerald rounded-[48px] p-12 md:p-20 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
               <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center text-white">
                  <div>
                    <div className="text-5xl md:text-7xl font-black mb-2">60+</div>
                    <div className="text-emerald-100 font-bold uppercase tracking-widest text-sm">Anos de História</div>
                  </div>
                  <div>
                    <div className="text-5xl md:text-7xl font-black mb-2">100%</div>
                    <div className="text-emerald-100 font-bold uppercase tracking-widest text-sm">Foco no Paciente</div>
                  </div>
                  <div>
                    <div className="text-5xl md:text-7xl font-black mb-2">24h</div>
                    <div className="text-emerald-100 font-bold uppercase tracking-widest text-sm">Cuidado Ininterrupto</div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-32">
           <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center space-y-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest">
                    <Users className="w-4 h-4" /> Nossa Comunidade
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black text-navy leading-tight">
                    Faça parte da nossa história e ajude-nos a <span className="text-emerald">salvar vidas</span>.
                 </h2>
                 <div className="flex flex-wrap justify-center gap-4 pt-4">
                    <a 
                      href="/#doacoes" 
                      className="px-10 py-4 bg-emerald text-white font-black rounded-full hover:bg-emerald-dark transition-all hover:scale-105 shadow-xl shadow-emerald/20"
                    >
                      Quero Contribuir
                    </a>
                    <a 
                      href="/#servicos" 
                      className="px-10 py-4 bg-navy text-white font-black rounded-full hover:bg-navy-light transition-all hover:scale-105 shadow-xl shadow-navy/20"
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
