import { useState, useEffect, useMemo } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { listarDocumentos, type DocumentoTransparencia } from "@/services/mockApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Download,
  Eye,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  FileImage,
  Link2,
  Search,
  X,
} from "lucide-react";

// ─── Type detection ───────────────────────────────────────────────────────────
const detectFileType = (url: string): "pdf" | "image" | "external" | "unknown" => {
  if (!url) return "unknown";
  if (url.startsWith("data:application/pdf") || url.toLowerCase().endsWith(".pdf")) return "pdf";
  if (url.startsWith("data:image") || /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)) return "image";
  if (url.startsWith("http://") || url.startsWith("https://")) return "external";
  return "unknown";
};

// ─── File Icon by type ────────────────────────────────────────────────────────
const FileIcon = ({ url, className = "w-5 h-5" }: { url?: string; className?: string }) => {
  const tipo = detectFileType(url || "");
  if (tipo === "pdf") return <FileText className={className} />;
  if (tipo === "image") return <FileImage className={className} />;
  if (tipo === "external") return <Link2 className={className} />;
  return <FileSpreadsheet className={className} />;
};

// ─── Type Badge ───────────────────────────────────────────────────────────────
const TypeBadge = ({ url }: { url?: string }) => {
  const tipo = detectFileType(url || "");
  const config = {
    pdf: { label: "PDF", bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    image: { label: "Imagem", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    external: { label: "Link", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
    unknown: { label: "Arquivo", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200" },
  }[tipo];
  return (
    <span className={`inline-flex items-center text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

// ─── Safe URL Hook ────────────────────────────────────────────────────────────
// Previne bloqueio de data: URIs pelo Chrome em iframes e detecta blobs mortos
const useSafeFileUrl = (url?: string) => {
  const [safeUrl, setSafeUrl] = useState<string>("");
  const [isDeadBlob, setIsDeadBlob] = useState(false);

  useEffect(() => {
    if (!url) {
      setSafeUrl("");
      setIsDeadBlob(false);
      return;
    }
    // Detecta blobs antigos do admin salvos incorretamente
    if (url.startsWith("blob:")) {
      setIsDeadBlob(true);
      setSafeUrl(url);
      return;
    }
    setIsDeadBlob(false);
    
    // Converte base64 de PDF para Blob URL para contornar restrição do Chrome iframe
    if (url.startsWith("data:application/pdf")) {
      try {
        const arr = url.split(',');
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        setSafeUrl(blobUrl);
        return () => URL.revokeObjectURL(blobUrl);
      } catch(e) {
        setSafeUrl(url);
      }
    } else {
      setSafeUrl(url);
    }
  }, [url]);

  return { safeUrl, isDeadBlob };
};

// ─── Viewer Modal ─────────────────────────────────────────────────────────────
const VisualizarModal = ({ doc, open, onClose }: { doc: DocumentoTransparencia | null; open: boolean; onClose: () => void }) => {
  const { safeUrl, isDeadBlob } = useSafeFileUrl(doc?.arquivo);

  if (!doc) return null;
  const tipo = detectFileType(doc.arquivo || "");
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl w-[96vw] h-[92vh] flex flex-col p-0 overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 py-4 bg-white border-b border-slate-100 shrink-0 flex flex-row items-center gap-3 pr-14">
          <div className="w-9 h-9 rounded-lg bg-navy/10 flex items-center justify-center shrink-0">
            <FileIcon url={doc.arquivo} className="w-4.5 h-4.5 text-navy" />
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-navy text-base font-bold truncate leading-tight">{doc.nome}</DialogTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {doc.categoria}{doc.subcategoria ? ` › ${doc.subcategoria}` : ""} · Publicado em {doc.dataPublicacao}
            </p>
          </div>
          {doc.arquivo && (
            <a
              href={doc.arquivo}
              download={!doc.arquivo.startsWith("http") ? doc.nome : undefined}
              target={doc.arquivo.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 bg-emerald text-white text-xs font-bold py-1.5 px-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar
            </a>
          )}
        </DialogHeader>
        <div className="flex-1 w-full overflow-auto bg-slate-50">
          {isDeadBlob ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8 bg-red-50/50">
               <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mb-2">
                 <X className="w-8 h-8" />
               </div>
               <h3 className="text-lg font-bold text-red-900">Arquivo Corrompido</h3>
               <p className="text-sm text-red-700/80 max-w-md">
                 Este documento foi salvo incorretamente no sistema. Por favor, exclua-o e faça o upload novamente no Painel Administrativo.
               </p>
            </div>
          ) : tipo === "image" ? (
            <img src={safeUrl} alt={doc.nome} className="w-full h-full object-contain p-6" />
          ) : tipo === "pdf" ? (
            <div className="w-full h-full relative flex flex-col">
              <iframe 
                src={doc.arquivo?.startsWith('http') ? `https://docs.google.com/viewer?url=${encodeURIComponent(doc.arquivo)}&embedded=true` : `${safeUrl}#toolbar=1&navpanes=0`} 
                className="w-full h-full border-none flex-1" 
                title={doc.nome} 
              />
              {doc.arquivo?.startsWith('http') && (
                <div className="bg-amber-50 border-t border-amber-200 p-3 text-center shrink-0">
                  <p className="text-sm text-amber-800">
                    O documento não carregou? <a href={doc.arquivo} target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-amber-900">Clique aqui para abrir em uma nova aba</a>.
                  </p>
                </div>
              )}
            </div>
          ) : tipo === "external" ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
              <div className="w-24 h-24 rounded-3xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <Link2 className="w-10 h-10 text-violet-400" />
              </div>
              <div className="text-center max-w-xs">
                <h3 className="text-lg font-bold text-navy mb-2">Documento Externo</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Este arquivo está hospedado externamente. Clique para visualizar na origem.
                </p>
                <a href={doc.arquivo} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-violet-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-violet-700 transition-colors text-sm shadow-sm">
                  <Eye className="w-4 h-4" /> Abrir Link
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground">
              <FileSpreadsheet className="w-14 h-14 opacity-20" />
              <p className="text-sm">Pré-visualização indisponível para este formato.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ─── Document row ─────────────────────────────────────────────────────────────
const DocumentoItem = ({ doc, onVisualizar }: { doc: DocumentoTransparencia; onVisualizar: (d: DocumentoTransparencia) => void }) => {
  const tipo = detectFileType(doc.arquivo || "");
  const hasFile = !!doc.arquivo;

  const handleDownload = () => {
    if (!doc.arquivo) return;
    if (doc.arquivo.startsWith("http")) { window.open(doc.arquivo, "_blank", "noopener,noreferrer"); return; }
    const a = document.createElement("a");
    a.href = doc.arquivo;
    a.download = doc.nome;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="group flex items-center gap-4 px-5 py-4 hover:bg-slate-50/80 transition-colors border-b border-slate-100/80 last:border-0">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-200 ${
        hasFile
          ? "bg-emerald/8 border-emerald/20 group-hover:bg-emerald group-hover:border-emerald"
          : "bg-slate-100 border-slate-200"
      }`}>
        <FileIcon
          url={doc.arquivo}
          className={`w-4.5 h-4.5 transition-colors ${hasFile ? "text-emerald group-hover:text-white" : "text-slate-400"}`}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-semibold text-navy text-sm leading-snug">{doc.nome}</h4>
          {hasFile && <TypeBadge url={doc.arquivo} />}
        </div>
        {doc.descricao && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{doc.descricao}</p>
        )}
        <p className="text-[11px] text-muted-foreground/70 mt-0.5">Publicado em {doc.dataPublicacao}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {hasFile ? (
          <>
            <button onClick={() => onVisualizar(doc)}
              className="flex items-center gap-1.5 border border-navy/20 text-navy hover:bg-navy hover:text-white hover:border-navy font-semibold py-1.5 px-3 rounded-lg transition-all text-xs">
              <Eye className="w-3.5 h-3.5" /> Visualizar
            </button>
            <button onClick={handleDownload}
              className="flex items-center gap-1.5 bg-emerald text-white hover:bg-emerald/90 font-semibold py-1.5 px-3 rounded-lg transition-all text-xs shadow-sm">
              <Download className="w-3.5 h-3.5" /> Baixar
            </button>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground/50 italic">Sem arquivo</span>
        )}
      </div>
      {/* Always-visible buttons on mobile */}
      <div className="flex items-center gap-2 shrink-0 sm:hidden">
        {hasFile ? (
          <>
            <button onClick={() => onVisualizar(doc)} className="flex items-center gap-1 border border-navy/20 text-navy font-semibold py-1.5 px-2 rounded-lg text-xs">
              <Eye className="w-3 h-3" />
            </button>
            <button onClick={handleDownload} className="flex items-center gap-1 bg-emerald text-white font-semibold py-1.5 px-2 rounded-lg text-xs">
              <Download className="w-3 h-3" />
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

// ─── Subfolder accordion ──────────────────────────────────────────────────────
const SubpastaAccordion = ({
  nome,
  documentos,
  defaultOpen,
  isSearching,
  onVisualizar,
}: {
  nome: string;
  documentos: DocumentoTransparencia[];
  defaultOpen?: boolean;
  isSearching?: boolean;
  onVisualizar: (d: DocumentoTransparencia) => void;
}) => {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const count = documentos.length;

  useEffect(() => {
    // Quando uma busca está ativa, abre as pastas para revelar os resultados encontrados
    if (isSearching) setOpen(true);
  }, [isSearching]);

  return (
    <div className={`rounded-xl border transition-colors overflow-hidden mb-2 last:mb-0 ${open ? "border-emerald/30 shadow-sm" : "border-slate-200"}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${open ? "bg-emerald/5" : "bg-white hover:bg-slate-50"}`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${open ? "bg-emerald/15" : "bg-slate-100"}`}>
          {open
            ? <FolderOpen className="w-4 h-4 text-emerald" />
            : <Folder className="w-4 h-4 text-slate-500" />
          }
        </div>
        <span className={`font-bold text-sm flex-1 ${open ? "text-emerald" : "text-navy"}`}>{nome}</span>
        <span className="text-[11px] font-bold text-muted-foreground bg-slate-100 rounded-full px-2 py-0.5 mr-1">
          {count} {count === 1 ? "arquivo" : "arquivos"}
        </span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${open ? "text-emerald rotate-0" : "text-slate-400 -rotate-90"}`} />
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden bg-white border-t border-emerald/10">
          {documentos.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-muted-foreground/60">
              Nenhum arquivo nesta subpasta.
            </div>
          ) : (
            documentos.map((doc) => (
              <DocumentoItem key={doc.id} doc={doc} onVisualizar={onVisualizar} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
const Transparencia = () => {
  const [documentos, setDocumentos] = useState<DocumentoTransparencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [docModal, setDocModal] = useState<DocumentoTransparencia | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    listarDocumentos().then((data) => {
      setDocumentos(data);
      setLoading(false);
    });
  }, []);

  // Tree: categoria > subcategoria > docs
  const arvore = useMemo(() => {
    const filtered = search.trim()
      ? documentos.filter((d) => d.nome.toLowerCase().includes(search.toLowerCase()))
      : documentos;

    return filtered.reduce((acc, doc) => {
      const cat = doc.categoria || "Outros";
      const sub = doc.subcategoria || "Geral";
      if (!acc[cat]) acc[cat] = {};
      if (!acc[cat][sub]) acc[cat][sub] = [];
      acc[cat][sub].push(doc);
      return acc;
    }, {} as Record<string, Record<string, DocumentoTransparencia[]>>);
  }, [documentos, search]);

  const categoriasKeys = Object.keys(arvore).sort();

  useEffect(() => {
    if (categoriasKeys.length > 0 && (!categoriaAtiva || !arvore[categoriaAtiva])) {
      setCategoriaAtiva(categoriasKeys[0]);
    }
  }, [categoriasKeys.join(",")]);

  const totalDocs = documentos.length;
  const subpastasAtivas = categoriaAtiva && arvore[categoriaAtiva] ? Object.entries(arvore[categoriaAtiva]) : [];

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-28 text-center overflow-hidden">
          <div className="absolute inset-0">
            <img src="/fundo.png" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/75 to-navy/90" />
          </div>
          <div className="container relative z-10 mx-auto px-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald mb-5 bg-emerald/10 border border-emerald/20 px-4 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Prestação de Contas
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Nossa Transparência
            </h1>
            <p className="text-white/70 max-w-xl mx-auto text-base leading-relaxed">
              Acesse documentos institucionais, demonstrativos financeiros, editais e regulamentos da Santa Casa de Paulo de Faria.
            </p>
            {/* Search bar */}
            <div className="mt-8 max-w-md mx-auto relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar documento..."
                className="w-full bg-white/10 backdrop-blur border border-white/20 text-white placeholder:text-white/40 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-emerald/60 focus:bg-white/15 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-28 gap-4">
                <div className="w-10 h-10 border-4 border-emerald border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Carregando documentos...</p>
              </div>
            ) : categoriasKeys.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-lg mx-auto text-center px-8">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
                  <FolderOpen className="w-9 h-9 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">
                  {search ? "Nenhum resultado encontrado" : "Nenhum documento publicado"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {search ? `Não encontramos documentos para "${search}".` : "Os documentos de transparência serão publicados em breve."}
                </p>
                {search && (
                  <button onClick={() => setSearch("")} className="mt-4 text-sm text-emerald font-bold hover:underline">
                    Limpar busca
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6">

                {/* ── Sidebar ─────────────────────────────────────────────── */}
                <aside className="lg:w-64 xl:w-72 shrink-0">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-6">
                    {/* Sidebar header */}
                    <div className="px-5 py-4 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-0.5">
                        <Folder className="w-4 h-4 text-emerald" />
                        <h2 className="text-xs font-black uppercase tracking-wider text-slate-500">Categorias</h2>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {totalDocs} {totalDocs === 1 ? "documento" : "documentos"} · {categoriasKeys.length} {categoriasKeys.length === 1 ? "pasta" : "pastas"}
                      </p>
                    </div>

                    {/* Category list */}
                    <div className="p-2">
                      {categoriasKeys.map((cat) => {
                        const isActive = categoriaAtiva === cat;
                        const totalCat = Object.values(arvore[cat]).flat().length;
                        const totalSubs = Object.keys(arvore[cat]).length;
                        return (
                          <button
                            key={cat}
                            onClick={() => setCategoriaAtiva(cat)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all mb-0.5 last:mb-0 group ${
                              isActive ? "bg-navy text-white shadow-md" : "hover:bg-slate-50 text-navy"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isActive ? "bg-white/15" : "bg-slate-100 group-hover:bg-slate-200"
                            }`}>
                              {isActive
                                ? <FolderOpen className="w-4 h-4 text-emerald" />
                                : <Folder className="w-4 h-4 text-slate-500" />
                              }
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`font-bold text-sm truncate leading-tight ${isActive ? "text-white" : "text-navy"}`}>{cat}</p>
                              <p className={`text-[11px] mt-0.5 ${isActive ? "text-white/60" : "text-muted-foreground"}`}>
                                {totalSubs} subpasta{totalSubs !== 1 ? "s" : ""} · {totalCat} arquivo{totalCat !== 1 ? "s" : ""}
                              </p>
                            </div>
                            <span className={`text-[11px] font-black rounded-full w-6 h-6 flex items-center justify-center shrink-0 ${
                              isActive ? "bg-emerald text-white" : "bg-slate-200 text-slate-600"
                            }`}>
                              {totalCat}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                {/* ── Main content ─────────────────────────────────────────── */}
                <div className="flex-1 min-w-0">
                  {categoriaAtiva && (
                    <div key={categoriaAtiva}>
                      {/* Category header */}
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                          <div className="w-10 h-10 rounded-xl bg-navy/8 border border-navy/10 flex items-center justify-center shrink-0">
                            <FolderOpen className="w-5 h-5 text-navy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h2 className="text-base font-extrabold text-navy leading-tight">{categoriaAtiva}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {subpastasAtivas.length} {subpastasAtivas.length === 1 ? "subpasta" : "subpastas"} · {subpastasAtivas.reduce((acc, [, docs]) => acc + docs.length, 0)} arquivos
                            </p>
                          </div>
                          {search && (
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 font-bold px-2.5 py-1 rounded-lg">
                              Filtrado: "{search}"
                            </span>
                          )}
                        </div>

                        {/* Subfolders */}
                        <div className="p-4 space-y-0">
                          {subpastasAtivas.length === 0 ? (
                            <div className="py-10 text-center text-muted-foreground/50 text-sm">
                              Nenhum documento nesta categoria.
                            </div>
                          ) : (
                            subpastasAtivas
                              .sort(([a], [b]) => b.localeCompare(a))
                              .map(([sub, docs], idx) => (
                                <SubpastaAccordion
                                  key={sub}
                                  nome={sub}
                                  documentos={docs}
                                  defaultOpen={false}
                                  isSearching={!!search}
                                  onVisualizar={(d) => { setDocModal(d); setModalOpen(true); }}
                                />
                              ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />

      <VisualizarModal
        doc={docModal}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setDocModal(null); }}
      />
    </div>
  );
};

export default Transparencia;
