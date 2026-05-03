import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ChevronLeft, Share2, Tag } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { buscarNoticiaPorId, type Noticia } from "@/services/mockApi";

const ImageCarousel = ({ images }: { images: string[] }) => {
// ... (rest of ImageCarousel remains the same)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] rounded-[32px] overflow-hidden shadow-2xl mb-12">
      <div 
        className="flex w-full h-full transition-transform duration-1000 ease-in-out" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 relative bg-slate-900">
            <img 
              src={img} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-110" 
            />
            <img 
              src={img} 
              alt={`Foto ${idx + 1}`} 
              className="relative z-10 w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
      
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, idx) => (
            <button 
              key={idx} 
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NewsDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<Noticia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      buscarNoticiaPorId(id).then((data) => {
        setNews(data);
        setLoading(false);
        window.scrollTo(0, 0);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald"></div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <h2 className="text-2xl font-bold text-navy mb-4">Notícia não encontrada</h2>
        <Link to="/" className="text-emerald font-bold hover:underline">Voltar para o início</Link>
      </div>
    );
  }

  let images: string[] = [];
  try {
    if (news.imagem && news.imagem.startsWith('[')) {
      images = JSON.parse(news.imagem);
    } else if (news.imagem) {
      images = [news.imagem];
    }
  } catch {
    if (news.imagem) images = [news.imagem];
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title={news.titulo}
        description={news.corpo.substring(0, 160)}
        image={images[0]}
        type="article"
      />
      <SiteHeader />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Breadcrumb / Back */}
          <a href="/#noticias" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald font-bold mb-8 transition-colors group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Voltar para Notícias
          </a>

          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald/10 text-emerald">
                {news.categoria || "Geral"}
              </span>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <Calendar className="w-4 h-4" />
                {news.data}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-navy leading-[1.1] mb-8">
              {news.titulo}
            </h1>

            <div className="flex items-center justify-between py-6 border-y border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center p-2 border border-slate-100">
                  <img src="/logo.png" alt="Santa Casa" className="w-full h-full object-contain" />
                </div>
                <div>
                  <div className="text-sm font-black text-navy uppercase tracking-widest">Santa Casa</div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Comunicação Oficial</div>
                </div>
              </div>
              <button className="flex items-center gap-2 text-slate-400 hover:text-navy transition-colors font-bold text-sm uppercase tracking-widest">
                <Share2 className="w-4 h-4" /> Compartilhar
              </button>
            </div>
          </div>

          {/* Media */}
          <ImageCarousel images={images} />

          {/* Content */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-navy prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-navy">
            {news.corpo.split('\n').map((para, idx) => (
              para.trim() && <p key={idx}>{para}</p>
            ))}
          </div>

          {/* Footer of the article */}
          <div className="mt-16 pt-12 border-t border-slate-100 flex flex-wrap gap-4">
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
               <Tag className="w-4 h-4" /> {news.categoria}
             </div>
             <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
               <Tag className="w-4 h-4" /> Santa Casa
             </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default NewsDetail;
