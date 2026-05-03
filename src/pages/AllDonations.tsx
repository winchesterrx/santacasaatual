import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, ChevronLeft, Heart } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { listarDoacoes, type DoacaoTransparencia } from "@/services/mockApi";

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
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AllDonations = () => {
  const [donations, setDonations] = useState<DoacaoTransparencia[]>([]);

  useEffect(() => {
    listarDoacoes().then(setDonations).catch(console.error);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title="Histórico de Doações" 
        description="Veja como as doações estão transformando a Santa Casa de Paulo de Faria." 
      />
      <SiteHeader />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald font-bold mb-6 transition-colors group">
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Voltar para o Início
            </Link>
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-emerald/10 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-emerald" fill="currentColor" />
               </div>
               <h1 className="text-4xl md:text-6xl font-black text-navy">
                 Histórico de <span className="text-emerald">Doações</span>
               </h1>
            </div>
            <p className="text-slate-500 max-w-2xl font-medium">
              Confira como a sua ajuda está transformando a Santa Casa. Aqui você encontra todas as atualizações de recebimentos, compras e manutenções realizadas com as doações.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {donations.map((post) => {
              let images: string[] = [];
              try {
                if (post.imagem_url.startsWith('[')) {
                  images = JSON.parse(post.imagem_url);
                } else {
                  images = [post.imagem_url];
                }
              } catch {
                images = [post.imagem_url];
              }

              return (
                <div key={post.id} className="bg-white border border-slate-200 shadow-sm rounded-3xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group">
                  <div className="w-full aspect-square bg-slate-100 overflow-hidden relative">
                    <ImageCarousel images={images} />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-4 h-4 text-emerald" />
                      <span className="text-xs font-bold text-emerald uppercase tracking-wider">{post.data_publicacao}</span>
                    </div>
                    <p className="text-[15px] text-navy leading-relaxed font-semibold">
                      {post.descricao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {donations.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center p-20 bg-white rounded-[40px] border border-slate-200 border-dashed">
              <Heart className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">Nenhuma atualização disponível no momento.</p>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
};

export default AllDonations;
