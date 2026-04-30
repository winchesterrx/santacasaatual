import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { listarDocumentos, type DocumentoTransparencia } from "@/services/mockApi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, Download } from "lucide-react";

const Transparencia = () => {
  const [documentos, setDocumentos] = useState<DocumentoTransparencia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listarDocumentos().then((data) => {
      setDocumentos(data);
      setLoading(false);
    });
  }, []);

  // Agrupar documentos por categoria
  const categorias = documentos.reduce((acc, doc) => {
    const cat = doc.categoria || "Outros";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(doc);
    return acc;
  }, {} as Record<string, DocumentoTransparencia[]>);

  const categoriasKeys = Object.keys(categorias).sort();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-navy py-16 md:py-24 text-center">
          <div className="container mx-auto px-6">
            <span className="inline-block text-sm font-bold uppercase tracking-widest text-emerald mb-4">
              Prestação de Contas
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              Nossa Transparência
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              Compromisso com a ética, responsabilidade e clareza. Acesse abaixo os documentos institucionais, regulamentos, demonstrativos financeiros e termos de fomento da Santa Casa.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-6 max-w-4xl">
            {loading ? (
              <div className="text-center text-muted-foreground py-20">Carregando documentos...</div>
            ) : categoriasKeys.length === 0 ? (
              <div className="text-center text-muted-foreground py-20 bg-white rounded-2xl shadow-sm border border-border/50">
                Nenhum documento disponível no momento.
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {categoriasKeys.map((cat, index) => (
                  <AccordionItem 
                    key={cat} 
                    value={`item-${index}`}
                    className="bg-white border border-border/60 rounded-xl px-6 shadow-sm data-[state=open]:border-emerald/50 data-[state=open]:shadow-md transition-all"
                  >
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-4 text-left">
                        <div className="w-12 h-12 rounded-full bg-emerald/10 flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6 text-emerald" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-navy">{cat}</h3>
                          <p className="text-sm text-muted-foreground font-normal mt-1">
                            {categorias[cat].length} arquivo{categorias[cat].length !== 1 ? 's' : ''} disponível
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    
                    <AccordionContent className="pt-2 pb-8 border-t border-border/50">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
                        {categorias[cat].map((doc) => (
                          <div key={doc.id} className="bg-slate-50 border border-border rounded-xl p-5 hover:bg-slate-100 hover:border-emerald/30 transition-colors flex flex-col group">
                            <div className="flex items-start justify-between mb-4">
                              <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center shadow-sm">
                                <FileText className="w-5 h-5 text-navy/70" />
                              </div>
                              <span className="text-xs font-semibold bg-emerald/10 text-emerald px-2 py-1 rounded-md">
                                PDF
                              </span>
                            </div>
                            <h4 className="font-bold text-navy mb-2 line-clamp-2 leading-snug" title={doc.nome}>
                              {doc.nome}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-6">
                              Publicado em {doc.dataPublicacao}
                            </p>
                            
                            <div className="mt-auto">
                              {doc.arquivo ? (
                                <a 
                                  href={doc.arquivo} 
                                  download={doc.nome}
                                  className="w-full inline-flex items-center justify-center gap-2 bg-white border border-border text-navy hover:bg-emerald hover:text-white hover:border-emerald font-semibold py-2 px-4 rounded-lg transition-colors text-sm group-hover:shadow-sm"
                                >
                                  <Download className="w-4 h-4" />
                                  Fazer Download
                                </a>
                              ) : (
                                <span className="w-full inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground font-semibold py-2 px-4 rounded-lg text-sm cursor-not-allowed">
                                  Arquivo Indisponível
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Transparencia;
