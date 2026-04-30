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
        <section className="relative py-16 md:py-24 text-center overflow-hidden">
          {/* Background with overlay */}
          <div className="absolute inset-0 z-0">
            <img src="/fundo.png" alt="Santa Casa" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy/80 mix-blend-multiply" />
            <div className="absolute inset-0 bg-navy/60" />
          </div>

          <div className="container relative z-10 mx-auto px-6">
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
          <div className="container mx-auto px-4 md:px-8 max-w-6xl">
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
              <Tabs defaultValue={categoriasKeys[0]} className="w-full">
                
                {/* Top Tabs Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-border/60 p-2 mb-8 overflow-x-auto scrollbar-hide">
                  <TabsList className="flex items-center justify-start h-auto bg-transparent p-0 gap-1 w-max min-w-full">
                    {categoriasKeys.map((cat) => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat}
                        className="rounded-lg px-6 py-3 text-sm data-[state=active]:bg-emerald data-[state=active]:text-white data-[state=active]:shadow text-navy font-bold hover:bg-slate-100 data-[state=active]:hover:bg-emerald transition-all whitespace-nowrap flex items-center gap-2"
                      >
                        {cat}
                        <span className="inline-flex items-center justify-center bg-black/10 data-[state=active]:bg-white/20 text-current text-[10px] w-5 h-5 rounded-full font-bold">
                          {categorias[cat].length}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                {/* Main Content (List) */}
                <div className="w-full">
                  {categoriasKeys.map((cat) => (
                    <TabsContent key={cat} value={cat} className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      
                      {/* Professional Container Box */}
                      <div className="bg-white border border-border/60 rounded-2xl shadow-sm overflow-hidden">
                        
                        {/* Header of the table/list */}
                        <div className="bg-slate-50 border-b border-border/60 px-6 py-4">
                          <h2 className="text-lg font-extrabold text-navy">{cat}</h2>
                          <p className="text-sm text-muted-foreground mt-1">Visualize ou faça o download dos arquivos desta categoria.</p>
                        </div>

                        <div className="flex flex-col divide-y divide-border/40">
                          {categorias[cat].map((doc) => {
                            const isImage = doc.arquivo?.startsWith('data:image');
                            const isPdf = doc.arquivo?.startsWith('data:application/pdf');

                            return (
                              <div key={doc.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors group">
                                
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center shrink-0 border border-emerald/20 group-hover:bg-emerald group-hover:border-emerald transition-colors">
                                    <FileText className="w-6 h-6 text-emerald group-hover:text-white transition-colors" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-navy text-sm md:text-base mb-1">
                                      {doc.nome}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                      <span className="text-xs text-muted-foreground font-medium">
                                        Publicado em {doc.dataPublicacao}
                                      </span>
                                      <span className={`text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded shadow-sm ${isPdf ? 'bg-red-50 text-red-600 border border-red-100' : isImage ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                        {isPdf ? 'PDF' : isImage ? 'Imagem' : 'Documento'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3 sm:shrink-0">
                                  {doc.arquivo ? (
                                    <>
                                      <Dialog>
                                        <DialogTrigger asChild>
                                          <button className="flex items-center gap-2 bg-white border border-border text-navy hover:border-navy hover:text-navy font-bold py-2 px-4 rounded-lg transition-all text-xs shadow-sm hover:shadow">
                                            <Eye className="w-4 h-4" />
                                            Visualizar
                                          </button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-5xl w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden bg-muted">
                                          <DialogHeader className="p-4 pr-12 bg-white border-b border-border shadow-sm shrink-0 relative z-0">
                                            <DialogTitle className="text-navy text-lg">{doc.nome}</DialogTitle>
                                          </DialogHeader>
                                          <div className="flex-1 w-full h-full relative overflow-auto">
                                            {isImage ? (
                                              <img src={doc.arquivo} alt={doc.nome} className="w-full h-full object-contain p-4" />
                                            ) : isPdf ? (
                                              <iframe src={`${doc.arquivo}#toolbar=0&navpanes=0`} className="w-full h-full border-none" title={doc.nome} />
                                            ) : (
                                              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                                Visualização direta não disponível para este formato.
                                              </div>
                                            )}
                                          </div>
                                        </DialogContent>
                                      </Dialog>
                                      <a 
                                        href={doc.arquivo} 
                                        download={doc.nome}
                                        className="flex items-center gap-2 bg-emerald text-white hover:bg-emerald-dark font-bold py-2 px-4 rounded-lg transition-all text-xs shadow-sm hover:shadow"
                                      >
                                        <Download className="w-4 h-4" />
                                        Baixar
                                      </a>
                                    </>
                                  ) : (
                                    <span className="text-xs text-muted-foreground/60 font-bold py-2 px-4 bg-slate-50 rounded-lg border border-border/40">
                                      Indisponível
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
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
