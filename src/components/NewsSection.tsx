import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import { listarNoticias, type Noticia } from "@/services/mockApi";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex w-full h-full transition-transform duration-700 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`Foto ${idx + 1}`} 
            className="w-full h-full object-cover flex-shrink-0"
            loading="lazy"
          />
        ))}
      </div>
      
      {images.length > 1 && (
        <>
          <button 
            onClick={prev}
            className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={next}
            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center backdrop-blur-sm transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1 bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<Noticia[]>([]);

  useEffect(() => {
    listarNoticias().then((data) => setNewsItems(data));
  }, []);

  return (
    <section id="noticias" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px w-8 bg-emerald"></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald">
                Fique por Dentro
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-navy leading-tight">
              Últimas Notícias <br /><span className="text-emerald">e Eventos</span>
            </h2>
          </div>
          <p className="text-slate-500 font-medium max-w-sm">
            Acompanhe em tempo real as novidades, campanhas e as transformações da Santa Casa de Paulo de Faria.
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
                className="group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold tracking-wider uppercase">{item.data}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-navy mb-4 group-hover:text-emerald transition-colors line-clamp-2 leading-snug">
                    {item.titulo}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium">
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
    </section>
  );
};

export default NewsSection;
