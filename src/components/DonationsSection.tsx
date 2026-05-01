import { Heart, Landmark, Copy, Check, Info, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { listarDoacoes, DoacaoTransparencia, listarContasDoacao, ContaDoacao } from "@/services/mockApi";

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // 4 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images || images.length === 0) return null;
  
  if (images.length === 1) {
    return (
      <img 
        src={images[0]} 
        alt="Doação recebida" 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
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
      
      {/* Controles do Carrossel */}
      <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={(e) => { e.preventDefault(); setCurrentIndex((prev) => (prev - 1 + images.length) % images.length); }}
          className="bg-black/20 hover:bg-black/40 text-white rounded-full p-1 backdrop-blur-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); setCurrentIndex((prev) => (prev + 1) % images.length); }}
          className="bg-black/20 hover:bg-black/40 text-white rounded-full p-1 backdrop-blur-sm transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
        {images.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const DonationsSection = () => {
  const [copiedPix, setCopiedPix] = useState(false);
  const [donations, setDonations] = useState<DoacaoTransparencia[]>([]);
  const [contas, setContas] = useState<ContaDoacao[]>([]);

  useEffect(() => {
    listarDoacoes().then(setDonations).catch(console.error);
    listarContasDoacao().then(setContas).catch(console.error);
  }, []);

  const handleCopyPix = (chave: string) => {
    navigator.clipboard.writeText(chave);
    setCopiedPix(true);
    toast.success("Chave PIX copiada com sucesso!");
    setTimeout(() => setCopiedPix(false), 2500);
  };

  return (
    <section id="doacoes" className="py-24 bg-slate-50/80">
      <div className="container mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Left Column: Call to Action & Bank Info */}
          <div className="w-full lg:w-5/12 space-y-10 sticky top-24">
            <div>
              <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald/10 text-emerald font-extrabold uppercase tracking-widest text-[11px] rounded-full mb-6">
                <Heart className="w-3.5 h-3.5" fill="currentColor" /> Solidariedade
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-navy mb-5 tracking-tight">
                Apoie a Santa Casa
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Qualquer quantia faz uma diferença enorme para nossos pacientes. Utilize os dados oficiais abaixo para realizar sua contribuição de forma segura.
              </p>
            </div>

            <div className="space-y-6">
              {contas.map((contaItem) => (
                contaItem.tipo === 'pix' ? (
                  /* PIX */
                  <div key={contaItem.id} className="bg-white border-2 border-emerald/20 rounded-3xl p-6 sm:p-8 shadow-xl shadow-emerald/5 relative overflow-hidden group hover:border-emerald/40 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald/5 rounded-bl-full -z-10 blur-2xl group-hover:bg-emerald/10 transition-colors" />
                    
                    <div className="flex items-center gap-3 text-emerald-600 font-black mb-6">
                      <div className="px-2.5 py-1 bg-emerald text-white rounded text-[11px] font-black italic shadow-md shadow-emerald/20 tracking-tighter">
                        pix
                      </div>
                      {contaItem.descricao || "Chave PIX"}
                    </div>
                    
                    <div className="mb-6">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Favorecido
                      </span>
                      <span className="font-bold text-navy text-sm">
                        {contaItem.favorecido}
                      </span>
                    </div>

                    <div className="flex items-center mt-auto bg-slate-50 border border-slate-200 rounded-2xl p-1.5 pl-4 gap-2">
                      <div className="flex-1 font-mono font-black text-base sm:text-lg text-emerald tracking-wide truncate">
                        {contaItem.chave_pix}
                      </div>
                      <Button 
                        onClick={() => handleCopyPix(contaItem.chave_pix || "")}
                        className={`h-12 w-12 shrink-0 rounded-xl transition-all shadow-md ${copiedPix ? "bg-emerald text-white" : "bg-emerald text-white hover:bg-emerald-dark hover:scale-105"}`}
                        aria-label="Copiar PIX"
                      >
                        {copiedPix ? <Check className="w-5 h-5" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Depósito Bancário */
                  <div key={contaItem.id} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                    <div className="flex items-center gap-3 text-navy font-black mb-6">
                      <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <Landmark className="w-5 h-5 text-emerald" />
                      </div>
                      {contaItem.descricao || "Depósito Bancário"}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[11px]">Banco</span>
                        <span className="font-bold text-navy">{contaItem.banco}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest text-[11px]">Agência</span>
                        <span className="font-bold text-navy font-mono tracking-widest">{contaItem.agencia}</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mt-4">
                        <span className="text-sm font-bold text-slate-500">Conta</span>
                        <span className="font-black text-emerald text-lg font-mono tracking-wider">{contaItem.conta}</span>
                      </div>
                    </div>
                  </div>
                )
              ))}
              {contas.length === 0 && (
                <div className="text-slate-500 text-sm text-center py-4">Nenhuma conta configurada no momento.</div>
              )}
            </div>
            
            <div className="flex items-start gap-3 bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-blue-800">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs font-medium leading-relaxed">
                Para doações de alimentos, medicamentos, itens de higiene ou outras dúvidas, entre em contato pelo telefone <strong>(17) 3292-1373</strong>.
              </p>
            </div>
          </div>

          {/* Right Column: Donation Impact Feed */}
          <div className="w-full lg:w-7/12">
            <div className="mb-8 flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-2xl font-bold text-navy">Impacto das Doações</h3>
              <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                Atualizações recentes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {donations.length > 0 ? donations.map((post) => {
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
                  <div key={post.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300 group">
                    {/* Imagem */}
                    <div className="w-full aspect-[4/3] bg-slate-100 overflow-hidden relative">
                      <ImageCarousel images={images} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>

                    {/* Conteúdo */}
                    <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-emerald" />
                      <span className="text-xs font-bold text-emerald uppercase tracking-wider">{post.data_publicacao}</span>
                    </div>
                    <p className="text-[14px] text-navy leading-relaxed font-medium">
                      {post.descricao}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Heart className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="text-lg font-bold text-navy mb-2">Sem atualizações</h4>
                  <p className="text-sm text-slate-500 max-w-sm">
                    As novas fotos de doações e manutenções aparecerão aqui.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default DonationsSection;
