import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, UserPlus, Search, HeartHandshake } from "lucide-react";

export default function NotaFiscalPaulista() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const steps = [
    {
      icon: <ExternalLink className="w-5 h-5" />,
      title: "Acesse o Sistema",
      desc: "Acesse o site da Secretaria da Fazenda e faça seu login no sistema da Nota Fiscal Paulista (via senha ou Gov.br).",
      action: { label: "Acessar Portal da NFP", url: "https://www.nfp.fazenda.sp.gov.br/login" }
    },
    {
      icon: <UserPlus className="w-5 h-5" />,
      title: "Vá em Entidades",
      desc: "No menu principal superior, clique na opção 'Entidades' e em seguida 'Doação de Cupons com CPF (Automática)'."
    },
    {
      icon: <Search className="w-5 h-5" />,
      title: "Busque a Santa Casa",
      desc: "Pesquise pelo nosso nome 'Santa Casa de Misericordia de Paulo de Faria' ou pelo CNPJ: 53.782.355/0001-46."
    },
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: "Confirme a Doação",
      desc: "Selecione o período desejado para a doação (ex: 2º Semestre) e clique no botão 'Confirmar Doação Automática'."
    },
    {
      icon: <HeartHandshake className="w-5 h-5" />,
      title: "Tudo Certo!",
      desc: "A partir de agora, basta pedir CPF na nota em todas as suas compras. Suas notas serão doadas automaticamente e ajudarão a salvar vidas!"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="pt-24 pb-20 bg-white relative overflow-hidden">
          {/* Subtle background element */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[40rem] h-[40rem] bg-emerald/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-block px-4 py-1.5 bg-navy/5 text-navy rounded-full text-sm font-semibold mb-6">
                  Ajude sem gastar nada
                </div>
                <h1 className="text-4xl lg:text-6xl font-light mb-2 text-navy">
                  Nota Fiscal
                </h1>
                <h2 className="text-5xl lg:text-7xl font-extrabold mb-6 tracking-tight text-navy">
                  Paulista
                </h2>
                <p className="text-xl lg:text-2xl font-light mb-10 max-w-lg mx-auto lg:mx-0 text-slate-600 leading-relaxed">
                  Transforme seus cupons fiscais em esperança. <strong className="font-semibold text-navy">Sua doação salva vidas!</strong>
                </p>
                <Button
                  size="lg"
                  className="rounded-full px-8 bg-emerald hover:bg-emerald-dark text-white h-14 text-lg shadow-lg font-bold transition-all hover:scale-105"
                  onClick={() => document.getElementById('passo-a-passo')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Quero aprender a doar
                </Button>
              </div>

              <div className="flex-1 w-full max-w-lg mx-auto relative group flex items-center justify-center">
                <img
                  src="/urna-nfp.png"
                  alt="Urna da Nota Fiscal Paulista"
                  className="w-full h-auto object-contain hover:-translate-y-2 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* BANNERS SECTION */}
        <section className="py-16 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto items-center">
              <a href="https://www.nfp.fazenda.sp.gov.br/login" target="_blank" rel="noopener noreferrer" className="block group">
                <img
                  src="/banner-doe-nfp.png"
                  alt="Doe NFP - Transforme seus cupons fiscais em esperança"
                  className="w-full h-auto rounded-[2rem] shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300 object-cover border border-slate-100"
                />
              </a>
              <a href="https://sso.acesso.gov.br/" target="_blank" rel="noopener noreferrer" className="block group">
                <img
                  src="/banner-gov-br.png"
                  alt="Acesse o sistema via Gov.br"
                  className="w-full h-auto rounded-[2rem] shadow-lg group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300 object-cover border border-slate-100"
                />
              </a>
            </div>
          </div>
        </section>

        {/* COMO DOAR SECTION */}
        <section id="passo-a-passo" className="py-24 bg-slate-50 relative">
          <div className="container mx-auto px-6 max-w-7xl relative z-10">
            <div className="text-center mb-16">
              <h3 className="text-3xl lg:text-4xl font-extrabold text-navy mb-4">Como doar sua Nota Fiscal?</h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                É rápido, seguro e você faz tudo pelo celular ou computador em poucos minutos. Siga o passo a passo ou assista ao vídeo explicativo.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

              {/* VIDEO & INFO (Left Side) */}
              <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-xl aspect-video border-4 border-white relative group">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/ML8q3Xr3jlw"
                    title="Como doar Nota Fiscal Paulista"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center shrink-0">
                      <HeartHandshake className="w-6 h-6 text-emerald" />
                    </div>
                    <h4 className="font-bold text-navy text-xl">Por que sua doação importa?</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Os recursos arrecadados através da doação automática da Nota Fiscal Paulista são fundamentais para a manutenção dos nossos atendimentos e para a compra de insumos hospitalares. <strong>Não custa nada para você, mas vale muito para quem precisa!</strong>
                  </p>
                </div>
              </div>

              {/* STEPS TIMELINE (Right Side) */}
              <div className="lg:col-span-7">
                <div className="flex flex-col gap-6">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 md:gap-8 items-start hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald/10 text-emerald font-black text-xl shrink-0 group-hover:bg-emerald group-hover:text-white transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-navy text-xl mb-3 flex items-center gap-2">
                          <span className="text-emerald group-hover:scale-110 transition-transform">{step.icon}</span>
                          {step.title}
                        </h4>
                        <p className="text-slate-600 leading-relaxed text-[15px]">
                          {step.desc}
                        </p>
                        {step.action && (
                          <div className="mt-4">
                            <a
                              href={step.action.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald/10 text-emerald font-bold rounded-xl hover:bg-emerald hover:text-white transition-colors text-sm"
                            >
                              {step.action.label}
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 bg-navy rounded-3xl p-8 text-white text-center shadow-xl">
                  <h4 className="text-2xl font-bold mb-4">Ficou com alguma dúvida?</h4>
                  <p className="text-white/80 mb-6 max-w-md mx-auto">
                    Nossa equipe está à disposição para ajudar você a configurar sua doação automática.
                  </p>
                  <Button variant="outline" className="rounded-full bg-transparent border-white/30 hover:bg-white hover:text-navy text-white px-8">
                    Fale Conosco
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
