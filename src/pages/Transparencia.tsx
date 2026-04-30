import { useState, useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { listarDocumentos, type DocumentoTransparencia } from "@/services/mockApi";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
              <Tabs defaultValue={categoriasKeys[0]} className="w-full">
                <div className="overflow-x-auto pb-4 mb-6 scrollbar-hide">
                  <TabsList className="flex w-max bg-transparent h-auto p-0 gap-2 border-b border-border/40 pb-2">
                    {categoriasKeys.map((cat) => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat}
                        className="rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-emerald data-[state=active]:bg-emerald/5 data-[state=active]:text-emerald data-[state=active]:shadow-none px-6 py-3 font-semibold text-navy hover:bg-slate-50 transition-colors whitespace-nowrap"
                      >
                        {cat}
                        <span className="ml-2 inline-flex items-center justify-center bg-muted text-muted-foreground text-[10px] w-5 h-5 rounded-full font-bold">
                          {categorias[cat].length}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {categoriasKeys.map((cat) => (
                  <TabsContent key={cat} value={cat} className="mt-0 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorias[cat].map((doc) => {
                        const isImage = doc.arquivo?.startsWith('data:image');
                        const isPdf = doc.arquivo?.startsWith('data:application/pdf');

                        return (
                          <div key={doc.id} className="bg-white border border-border/80 rounded-xl p-5 hover:bg-slate-50 hover:border-emerald/40 hover:shadow-md transition-all flex flex-col group">
                            
                            {/* Preview Area */}
                            <div className="w-full h-40 bg-slate-50 border border-border/80 rounded-lg mb-4 overflow-hidden relative flex items-center justify-center shadow-sm">
                              {isImage ? (
                                <img src={doc.arquivo} alt={doc.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              ) : isPdf ? (
                                <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-500">
                                  <iframe src={`${doc.arquivo}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} className="w-full h-[150%] pointer-events-none border-none overflow-hidden" title={doc.nome} />
                                  <div className="absolute inset-0 bg-transparent z-10" />
                                </div>
                              ) : (
                                <FileText className="w-12 h-12 text-navy/20" />
                              )}
                              
                              <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-md z-20 ${isPdf ? 'bg-red-100 text-red-600' : isImage ? 'bg-blue-100 text-blue-600' : 'bg-emerald/10 text-emerald'}`}>
                                {isPdf ? 'PDF' : isImage ? 'IMG' : 'DOC'}
                              </span>
                            </div>

                            <h4 className="font-bold text-navy mb-1.5 line-clamp-2 leading-snug" title={doc.nome}>
                              {doc.nome}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-5">
                              Publicado em {doc.dataPublicacao}
                            </p>
                            
                            <div className="mt-auto">
                              {doc.arquivo ? (
                                <a 
                                  href={doc.arquivo} 
                                  download={doc.nome}
                                  className="w-full inline-flex items-center justify-center gap-2 bg-transparent border border-border text-navy hover:bg-emerald hover:text-white hover:border-emerald font-semibold py-2 px-4 rounded-lg transition-colors text-sm group-hover:shadow-sm"
                                >
                                  <Download className="w-4 h-4" />
                                  Baixar
                                </a>
                              ) : (
                                <span className="w-full inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground font-semibold py-2 px-4 rounded-lg text-sm cursor-not-allowed">
                                  Indisponível
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default Transparencia;
