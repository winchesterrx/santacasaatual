import { useState, useEffect } from "react";
import {
  Stethoscope, Baby, HeartPulse, Microscope, Scan, Ambulance, Activity, Atom,
  Building2, ArrowRight, BedSingle, Bandage, Users, Scissors
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { listarServicos, listarInfraestrutura, type Servico, type Infraestrutura } from "@/services/mockApi";

const iconMap: Record<string, any> = {
  Ambulance, Microscope, Scan, Activity, Atom, Baby, HeartPulse, Stethoscope, Building2, BedSingle, Bandage, Users, Scissors
};

const ServicesSection = () => {
  const [services, setServices] = useState<Servico[]>([]);
  const [infra, setInfra] = useState<Infraestrutura[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [svcs, inf] = await Promise.all([listarServicos(), listarInfraestrutura()]);
        setServices(svcs);
        setInfra(inf);
      } catch (error) {
        console.error("Erro ao carregar serviços/infra", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading && services.length === 0) return null;

  return (
    <section id="servicos" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background Fachada Santa Casa */}
      <div className="absolute inset-0">
        <img 
          src="/fundo.png" 
          alt="Fachada do Hospital" 
          className="w-full h-full object-cover fixed-attachment"
        />
        {/* Glassmorphism Mask (Dark Emerald) */}
        <div className="absolute inset-0 bg-[#022c22]/80 backdrop-blur-[6px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#6ee7b7] mb-3">
            Nossos Serviços
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Especialidades e Atendimento
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            Hospital Geral filantrópico com <strong className="text-white">{services.length} especialidades médicas</strong>, atendendo a comunidade de Paulo de Faria e 
            municípios da região noroeste paulista pelo SUS.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {services.map((svc) => {
            const Icon = iconMap[svc.icone] || Stethoscope;
            return (
              <div
                key={svc.id}
                className={`group rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  svc.destaque
                    ? "bg-navy text-primary-foreground border-transparent"
                    : "bg-card border-border/60"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                  svc.destaque
                    ? "bg-white/15"
                    : "bg-emerald/10 group-hover:bg-emerald group-hover:text-primary-foreground"
                }`}>
                  <Icon className={`w-6 h-6 transition-colors ${
                    svc.destaque ? "text-secondary" : "text-emerald group-hover:text-primary-foreground"
                  }`} />
                </div>
                <h3 className={`text-base font-bold mb-1.5 ${svc.destaque ? "text-primary-foreground" : "text-navy"}`}>{svc.titulo}</h3>
                <p className={`text-sm leading-relaxed ${svc.destaque ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{svc.descricao}</p>
              </div>
            );
          })}
        </div>

        {/* Infrastructure */}
        <div className="mt-28 py-16 px-6 md:px-12 bg-black/20 rounded-[2.5rem] border border-white/10 backdrop-blur-sm shadow-xl">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-4 mb-14 text-center">
              <span className="px-4 py-1.5 bg-white/10 shadow-sm border border-white/20 text-[#6ee7b7] font-extrabold uppercase tracking-widest text-[10px] rounded-full backdrop-blur-md">
                Infraestrutura do Hospital
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Instalações e Capacidade
              </h3>
              <p className="text-white/80 text-sm md:text-base max-w-2xl">
                Ambientes físicos preparados para oferecer acolhimento, tecnologia e segurança nos atendimentos à população.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 lg:gap-5">
              {infra.map((item) => {
                const Icon = iconMap[item.icone] || Users;
                return (
                  <div 
                    key={item.id} 
                    className="bg-card w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.8rem)] lg:w-[calc(20%-1rem)] border border-border hover:border-emerald/40 hover:shadow-lg rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 group hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mb-5 group-hover:bg-emerald group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-bold text-navy mb-3 leading-snug">
                      {item.nome}
                    </h4>
                    <div className="mt-auto text-[11px] uppercase font-bold tracking-widest text-emerald bg-emerald/5 px-3 py-1.5 rounded-md w-full border border-emerald/10">
                      {item.quantidade} {item.quantidade === 1 ? 'Unidade' : 'Unidades'}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t border-white/20">
              <p className="text-xs text-white/50 font-medium mb-4 sm:mb-0">
                * Relatório base atualizado do Governo · CNES: 3536602080869
              </p>
              <Button variant="outline" size="sm" className="text-xs text-white hover:text-navy hover:bg-white border-white/30 gap-2 rounded-full font-bold bg-transparent">
                 Ver Ficha Completa <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
