import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ArrowRight, ChevronLeft } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { listarNoticias, type Noticia } from "@/services/mockApi";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative bg-slate-900/5">
            <img 
              src={img} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40" 
            />
            <img 
              src={img} 
              alt={`Foto ${idx + 1}`} 
              className="relative z-10 w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AllNews = () => {
  const [newsItems, setNewsItems] = useState<Noticia[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    listarNoticias().then(setNewsItems);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald font-bold mb-6 transition-colors group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Voltar para o Início
            </Link>
            <h1 className="text-4xl md:text-6xl font-black text-navy mb-4">
              Todas as <span className="text-emerald">Notícias</span>
            </h1>
            <p className="text-slate-500 max-w-2xl font-medium">
              Confira o histórico completo de acontecimentos, eventos e novidades da Santa Casa de Paulo de Faria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item, i) => {
              let images: string[] = [];
              try {
                if (item.imagem && item.imagem.startsWith('[')) {
                  images = JSON.parse(item.imagem);
                } else if (item.imagem) {
                  images = [item.imagem];
                }
              } catch {
                if (item.imagem) images = [item.imagem];
              }

              return (
                <article
                  key={item.id || i}
                  onClick={() => navigate(`/noticia/${item.id}`)}
                  className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <ImageCarousel images={images} />
                    {item.categoria && (
                      <div className="absolute top-4 left-4 z-20">
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald text-white shadow-lg shadow-emerald/20">
                          {item.categoria}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold tracking-wider uppercase">{item.data}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-emerald transition-colors line-clamp-2 leading-snug">
                      {item.titulo}
                    </h3>
                    
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium h-[4.5rem]">
                      {item.corpo}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-black text-navy uppercase tracking-widest group-hover:text-emerald transition-colors flex items-center gap-2">
                        Ler notícia completa <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AllNews;
