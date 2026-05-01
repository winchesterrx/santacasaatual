import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Quote, Star, PenTool } from "lucide-react";
import testimonialBg from "@/assets/testimonial-bg.jpg";
import { listarDepoimentosAprovados, criarDepoimento, type Depoimento } from "@/services/mockApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Depoimento[]>([]);
  const [current, setCurrent] = useState(0);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formAutor, setFormAutor] = useState("");
  const [formPapel, setFormPapel] = useState("");
  const [formTexto, setFormTexto] = useState("");
  const [formEstrelas, setFormEstrelas] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const loadTestimonials = async () => {
    const data = await listarDepoimentosAprovados();
    setTestimonials(data);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const next = useCallback(() => setCurrent((p) => (testimonials.length > 0 ? (p + 1) % testimonials.length : 0)), [testimonials.length]);
  const prev = useCallback(() => setCurrent((p) => (testimonials.length > 0 ? (p - 1 + testimonials.length) % testimonials.length : 0)), [testimonials.length]);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, testimonials.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAutor || !formTexto) return;
    setIsSubmitting(true);
    await criarDepoimento({ autor: formAutor, papel: formPapel, texto: formTexto, estrelas: formEstrelas });
    setIsSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setIsFormOpen(false);
      setFormAutor("");
      setFormPapel("");
      setFormTexto("");
      setFormEstrelas(5);
    }, 3000);
  };

  return (
    <section className="relative h-[650px] md:h-[600px] overflow-hidden flex flex-col justify-center">
      <img
        src={testimonialBg}
        alt="Equipe médica da Santa Casa de Paulo de Faria"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#022c22]/50 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b]/80 to-[#022c22]/90" />

      <div className="relative h-full flex flex-col items-center justify-center z-10 py-12">
        <div className="container mx-auto px-6 text-center max-w-3xl flex-1 flex flex-col justify-center">
          <Quote className="w-10 h-10 text-emerald mx-auto mb-4 opacity-100" />
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-white/90 mb-6 bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-sm">
            Depoimentos e Impacto Social
          </span>

          <div className="relative min-h-[200px] mb-8">
            {testimonials.length === 0 && (
              <div className="text-primary-foreground/70 flex items-center justify-center h-full">
                Nenhum depoimento ainda.
              </div>
            )}
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                className={`absolute inset-0 transition-all duration-500 ${
                  i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
                }`}
              >
                <div className="flex justify-center gap-1 mb-5">
                  {Array.from({ length: t.estrelas }).map((_, s) => (
                    <Star key={s} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-lg md:text-2xl text-primary-foreground font-medium leading-relaxed italic mb-6">
                  "{t.texto}"
                </blockquote>
                <div className="text-primary-foreground font-bold text-lg">{t.autor}</div>
                <div className="text-primary-foreground/60 text-sm mt-1">{t.papel}</div>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? "bg-emerald-400 w-8" : "bg-white/30 hover:bg-white/50 w-2"
                }`}
                aria-label={`Depoimento ${i + 1}`}
              />
            ))}
          </div>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm shadow-xl rounded-full">
                <PenTool className="w-4 h-4 mr-2" />
                Deixar meu depoimento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Conte-nos sua experiência</DialogTitle>
              </DialogHeader>
              {success ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                    <Star className="w-6 h-6 fill-amber-600" />
                  </div>
                  <h3 className="font-bold text-lg text-emerald-800">Muito obrigado!</h3>
                  <p className="text-sm text-foreground/80">
                    Seu depoimento foi enviado e será avaliado pela nossa equipe antes de ser publicado.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Seu Nome *</label>
                    <Input required value={formAutor} onChange={e => setFormAutor(e.target.value)} placeholder="Ex: Maria S." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Relação com a Santa Casa</label>
                    <Input value={formPapel} onChange={e => setFormPapel(e.target.value)} placeholder="Ex: Paciente, Familiar..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Depoimento *</label>
                    <Textarea required value={formTexto} onChange={e => setFormTexto(e.target.value)} placeholder="Deixe sua mensagem..." rows={4} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">Sua avaliação</label>
                    <div className="flex gap-1 justify-center py-2">
                      {[1, 2, 3, 4, 5].map(v => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setFormEstrelas(v)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-8 h-8 ${v <= formEstrelas ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" variant="navy-solid" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Depoimento"}
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>

        </div>

        {/* Arrows */}
        {testimonials.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-primary-foreground transition-colors backdrop-blur-sm"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-primary-foreground transition-colors backdrop-blur-sm"
              aria-label="Próximo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
