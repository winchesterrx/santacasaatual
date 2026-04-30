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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileText, Download, Eye } from "lucide-react";

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
        <section className="py-8 md:py-16 bg-[#F8FAFC]">
          <div className="container mx-auto px-4 md:px-8 max-w-[1400px]">
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
              <Tabs defaultValue={categoriasKeys[0]} orientation="vertical" className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full">
                
                {/* Sidebar (Categories) */}
                <div className="w-full lg:w-[280px] shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm border border-border/60 p-4 lg:sticky lg:top-28">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Categorias</h3>
                    <TabsList className="flex lg:flex-col justify-start items-stretch h-auto w-full bg-transparent p-0 gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                      {categoriasKeys.map((cat) => (
                        <TabsTrigger 
                          key={cat} 
                          value={cat}
                          className="justify-between rounded-xl px-4 py-3 text-sm data-[state=active]:bg-emerald data-[state=active]:text-white data-[state=active]:shadow-md text-navy font-semibold hover:bg-emerald/5 transition-all whitespace-nowrap text-left"
                        >
                          <span className="truncate pr-4">{cat}</span>
                          <span className="shrink-0 inline-flex items-center justify-center bg-black/10 data-[state=active]:bg-white/20 text-current text-[10px] w-5 h-5 rounded-full font-bold">
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
                      <div className="mb-6">
                        <h2 className="text-xl font-extrabold text-navy mb-1">{cat}</h2>
                        <p className="text-sm text-muted-foreground">Visualize ou faça o download dos arquivos desta categoria.</p>
                      </div>

                      <div className="flex flex-col gap-3">
                        {categorias[cat].map((doc) => {
                          const isImage = doc.arquivo?.startsWith('data:image');
                          const isPdf = doc.arquivo?.startsWith('data:application/pdf');

                          return (
                            <div key={doc.id} className="bg-white border border-border/80 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition-all group">
                              
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-emerald/10 flex items-center justify-center shrink-0">
                                  <FileText className="w-5 h-5 text-emerald" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-navy text-sm md:text-base mb-0.5">
                                    {doc.nome}
                                  </h4>
                                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                                    <span>Publicado em {doc.dataPublicacao}</span>
                                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                      {isPdf ? 'PDF' : isImage ? 'Imagem' : 'Documento'}
                                    </span>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 sm:shrink-0">
                                {doc.arquivo ? (
                                  <>
                                    <Dialog>
                                      <DialogTrigger asChild>
                                        <button className="flex items-center gap-2 bg-transparent border border-border text-navy hover:bg-slate-100 font-medium py-1.5 px-3 rounded-md transition-colors text-xs">
                                          <Eye className="w-3.5 h-3.5" />
                                          Visualizar
                                        </button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col">
                                        <DialogHeader>
                                          <DialogTitle className="text-navy">{doc.nome}</DialogTitle>
                                        </DialogHeader>
                                        <div className="flex-1 bg-muted rounded-md overflow-hidden relative">
                                          {isImage ? (
                                            <img src={doc.arquivo} alt={doc.nome} className="w-full h-full object-contain" />
                                          ) : isPdf ? (
                                            <iframe src={`${doc.arquivo}#toolbar=0&navpanes=0&scrollbar=0`} className="w-full h-full border-none" title={doc.nome} />
                                          ) : (
                                            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                              Preview não disponível
                                            </div>
                                          )}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                    <a 
                                      href={doc.arquivo} 
                                      download={doc.nome}
                                      className="flex items-center gap-2 bg-emerald text-white hover:bg-emerald-dark font-medium py-1.5 px-3 rounded-md transition-colors text-xs"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      Baixar
                                    </a>
                                  </>
                                ) : (
                                  <span className="text-xs text-muted-foreground py-1.5 px-3 bg-muted rounded-md border border-transparent">
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
