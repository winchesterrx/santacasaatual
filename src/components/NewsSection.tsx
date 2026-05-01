import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from "lucide-react";
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
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40 select-none" 
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

const NewsSection = () => {
  const [newsItems, setNewsItems] = useState<Noticia[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    listarNoticias().then(setNewsItems);
  }, []);

  const next = useCallback(() => {
    if (newsItems.length === 0) return;
    // Em desktop mostramos 3, então o máximo index é total - 3
    const maxIndex = Math.max(0, newsItems.length - 3);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [newsItems.length]);

  const prev = () => {
    const maxIndex = Math.max(0, newsItems.length - 3);
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    if (newsItems.length <= 3) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, newsItems.length]);

  return (
    <section id="noticias" className="py-24 bg-slate-50 overflow-hidden">
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
          <div className="flex flex-col items-start md:items-end gap-4">
            <p className="text-slate-500 font-medium max-w-sm md:text-right">
              Acompanhe em tempo real as novidades e as transformações da Santa Casa.
            </p>
            <Link 
              to="/todas-noticias" 
              className="text-emerald font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-all"
            >
              Ver todas as notícias <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative group">
          {/* Slider Container */}
          <div className="relative overflow-hidden">
            <div 
              className="flex gap-6 transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / (window.innerWidth < 768 ? 1.1 : 3.08))}%)` }}
            >
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
                    className="min-w-[85%] md:min-w-[32%] group flex flex-col bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer"
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

                      <div className="mt-auto pt-6 border-t border-slate-100">
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

          {/* Slider Arrows */}
          {newsItems.length > 3 && (
            <>
              <button 
                onClick={prev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-navy hover:bg-emerald hover:text-white transition-all z-30 opacity-0 group-hover:opacity-100 max-md:hidden"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={next}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-navy hover:bg-emerald hover:text-white transition-all z-30 opacity-0 group-hover:opacity-100 max-md:hidden"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
