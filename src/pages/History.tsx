import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import SEO from "@/components/SEO";
import { Award, Heart, History as HistoryIcon, Target, Eye, Users } from "lucide-react";

const History = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
               src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop" 
               className="w-full h-full object-cover opacity-20" 
               alt="Hospital Vintage"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-navy/50 to-navy" />
          </div>
          
          <div className="container relative z-10 mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-emerald text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-sm">
              <HistoryIcon className="w-4 h-4" /> Desde 1960 servindo com amor
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight">
              Uma trajetória de <span className="text-emerald">Cuidado</span> e <span className="text-secondary">Dedicatória</span>
            </h1>
            <p className="text-primary-foreground/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed">
              Há mais de seis décadas, a Santa Casa de Paulo de Faria é o pilar da saúde em nossa região, unindo tradição, tecnologia e um profundo compromisso com a vida humana.
            </p>
          </div>
        </section>

        {/* Timeline / Content */}
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
              <div className="relative">
                <div className="aspect-square rounded-[48px] overflow-hidden shadow-2xl relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover" 
                    alt="Santa Casa Antiga"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-emerald/10 rounded-[48px] -z-0 blur-2xl" />
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-secondary/10 rounded-[48px] -z-0 blur-2xl" />
              </div>
              
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-black text-navy leading-tight">
                  Nossa <span className="text-emerald">Origem</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  A Irmandade da Santa Casa de Misericórdia de Paulo de Faria nasceu do sonho de uma comunidade que acreditava no acesso digno à saúde para todos. Desde os primeiros passos, nossa instituição foi moldada pela filantropia e pelo espírito de ajuda mútua.
                </p>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Ao longo dos anos, evoluímos de um pequeno posto de atendimento para um Hospital Geral de referência, mantendo sempre a essência de acolhimento que nos define. Hoje, atendemos milhares de pessoas anualmente pelo SUS, garantindo que a excelência médica chegue a quem mais precisa.
                </p>
                <div className="flex items-center gap-4 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:shadow-md transition-shadow">
                   <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                      <Award className="w-8 h-8" />
                   </div>
                   <div>
                      <h4 className="font-bold text-navy">Referência Regional</h4>
                      <p className="text-sm text-slate-500">Reconhecida pela qualidade no atendimento e gestão hospitalar.</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Mission Vision Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center text-emerald mb-8">
                     <Target className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-4">Missão</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Prestar assistência à saúde de forma humanizada, resolutiva e sustentável, promovendo o bem-estar da comunidade com excelência e ética.
                  </p>
               </div>

               <div className="bg-navy p-10 rounded-[40px] shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-secondary mb-8">
                     <Eye className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-4">Visão</h3>
                  <p className="text-primary-foreground/70 leading-relaxed">
                    Ser reconhecida como a melhor instituição de saúde regional, destacando-se pela inovação, atendimento humanizado e segurança do paciente.
                  </p>
               </div>

               <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-8">
                     <Heart className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-navy mb-4">Valores</h3>
                  <ul className="space-y-3 text-slate-500">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald" /> Humanização</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald" /> Ética e Transparência</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald" /> Excelência Técnica</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald" /> Responsabilidade Social</li>
                  </ul>
               </div>
            </div>

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
