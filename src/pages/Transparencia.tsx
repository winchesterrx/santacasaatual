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
        <section className="py-12 md:py-20 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            {loading ? (
              <div className="text-center text-muted-foreground py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald border-t-transparent rounded-full animate-spin mb-4"></div>
                Carregando documentos...
              </div>
            ) : categoriasKeys.length === 0 ? (
              <div className="text-center text-muted-foreground py-20 bg-white rounded-2xl shadow-sm border border-border/50 max-w-3xl mx-auto">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-navy mb-2">Nenhum documento</h3>
                <p>Ainda não há arquivos de transparência publicados.</p>
              </div>
            ) : (
              <Tabs defaultValue={categoriasKeys[0]} orientation="vertical" className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full">
                
                {/* Sidebar (Categories) */}
                <div className="w-full lg:w-1/4 shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-4 sticky top-28">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Categorias</h3>
                    <TabsList className="flex lg:flex-col justify-start items-stretch h-auto w-full bg-transparent p-0 gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                      {categoriasKeys.map((cat) => (
                        <TabsTrigger 
                          key={cat} 
                          value={cat}
                          className="justify-between rounded-xl px-4 py-3.5 data-[state=active]:bg-emerald data-[state=active]:text-white data-[state=active]:shadow-md text-navy font-semibold hover:bg-emerald/5 transition-all whitespace-nowrap text-left"
                        >
                          <span className="truncate pr-4">{cat}</span>
                          <span className="shrink-0 inline-flex items-center justify-center bg-black/10 data-[state=active]:bg-white/20 text-current text-[10px] w-6 h-6 rounded-full font-bold">
                            {categorias[cat].length}
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                </div>

                {/* Main Content (Grid) */}
                <div className="flex-1 w-full min-w-0">
                  {categoriasKeys.map((cat) => (
                    <TabsContent key={cat} value={cat} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="mb-8">
                        <h2 className="text-2xl font-extrabold text-navy mb-2">{cat}</h2>
                        <p className="text-muted-foreground">Visualize ou faça o download dos arquivos desta categoria.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {categorias[cat].map((doc) => {
                          const isImage = doc.arquivo?.startsWith('data:image');
                          const isPdf = doc.arquivo?.startsWith('data:application/pdf');

                          return (
                            <div key={doc.id} className="bg-white border border-border/60 rounded-2xl p-5 hover:border-emerald/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                              
                              {/* Preview Area */}
                              <div className="w-full h-44 bg-slate-100/50 border border-border/40 rounded-xl mb-5 overflow-hidden relative flex items-center justify-center shadow-inner">
                                {isImage ? (
                                  <img src={doc.arquivo} alt={doc.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : isPdf ? (
                                  <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700">
                                    <iframe src={`${doc.arquivo}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`} className="w-full h-[150%] pointer-events-none border-none overflow-hidden" title={doc.nome} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-100/20 to-transparent z-10" />
                                  </div>
                                ) : (
                                  <FileText className="w-12 h-12 text-navy/10 group-hover:text-emerald/30 transition-colors duration-300" />
                                )}
                                
                                <span className={`absolute top-3 right-3 text-[9px] font-black tracking-wider uppercase px-2.5 py-1 rounded-md z-20 shadow-sm backdrop-blur-md ${isPdf ? 'bg-red-500/10 text-red-600 border border-red-500/20' : isImage ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : 'bg-emerald/10 text-emerald border border-emerald/20'}`}>
                                  {isPdf ? 'PDF' : isImage ? 'Imagem' : 'Doc'}
                                </span>
                              </div>

                              <h4 className="font-bold text-navy mb-2 line-clamp-2 leading-snug group-hover:text-emerald transition-colors" title={doc.nome}>
                                {doc.nome}
                              </h4>
                              <p className="text-xs text-muted-foreground font-medium mb-6 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald/50"></span>
                                {doc.dataPublicacao}
                              </p>
                              
                              <div className="mt-auto">
                                {doc.arquivo ? (
                                  <a 
                                    href={doc.arquivo} 
                                    download={doc.nome}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 border border-border/60 text-navy hover:bg-emerald hover:text-white hover:border-emerald font-bold py-2.5 px-4 rounded-xl transition-all text-sm group-hover:shadow-md"
                                  >
                                    <Download className="w-4 h-4" />
                                    Baixar Arquivo
                                  </a>
                                ) : (
                                  <span className="w-full inline-flex items-center justify-center gap-2 bg-slate-50 text-muted-foreground/50 font-bold py-2.5 px-4 rounded-xl text-sm cursor-not-allowed border border-border/40">
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
                </div>
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
