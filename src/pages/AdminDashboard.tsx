import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Heart, LogOut, MessageCircle, FileText, Newspaper,
  Send, Trash2, Edit, Plus, X, Filter, Star, CheckCircle, XCircle, UploadCloud, Settings, TrendingUp, Landmark
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Helper para converter File para Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
import {
  listarManifestacoes, responderManifestacao,
  listarDocumentos, criarDocumento, editarDocumento, excluirDocumento,
  listarNoticias, criarNoticia, editarNoticia, excluirNoticia,
  listarDepoimentosAdmin, alterarStatusDepoimento, editarDepoimento, excluirDepoimento,
  listarDoacoes, criarDoacao, editarDoacao, excluirDoacao,
  listarNumeros, criarNumero, editarNumero, excluirNumero,
  listarContasDoacao, criarContaDoacao, editarContaDoacao, excluirContaDoacao,
  type Manifestacao, type DocumentoTransparencia, type Noticia, type Depoimento, type DoacaoTransparencia, type NumeroEstatistico, type ContaDoacao
} from "@/services/mockApi";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem("sc_admin_token")) navigate("/admin");
  }, [navigate]);

  const logout = () => {
    sessionStorage.removeItem("sc_admin_token");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Admin Header */}
      <header className="bg-navy sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="text-primary-foreground font-bold">Admin · Santa Casa</span>
          </Link>
          <Button variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="ouvidoria">
          <TabsList className="mb-8 h-12 flex flex-wrap h-auto">
            <TabsTrigger value="ouvidoria" className="gap-2"><MessageCircle className="w-4 h-4" /> Ouvidoria</TabsTrigger>
            <TabsTrigger value="transparencia" className="gap-2"><FileText className="w-4 h-4" /> Transparência</TabsTrigger>
            <TabsTrigger value="noticias" className="gap-2"><Newspaper className="w-4 h-4" /> Notícias</TabsTrigger>
            <TabsTrigger value="depoimentos" className="gap-2"><Star className="w-4 h-4" /> Depoimentos</TabsTrigger>
            <TabsTrigger value="doacoes" className="gap-2"><Heart className="w-4 h-4" /> Doações</TabsTrigger>
            <TabsTrigger value="contas" className="gap-2"><Landmark className="w-4 h-4" /> Recebimentos</TabsTrigger>
            <TabsTrigger value="numeros" className="gap-2"><TrendingUp className="w-4 h-4" /> Números</TabsTrigger>
          </TabsList>

          <TabsContent value="ouvidoria"><OuvidoriaPanel /></TabsContent>
          <TabsContent value="transparencia"><TransparenciaPanel /></TabsContent>
          <TabsContent value="noticias"><NoticiasPanel /></TabsContent>
          <TabsContent value="depoimentos"><DepoimentosPanel /></TabsContent>
          <TabsContent value="doacoes"><DoacoesPanel /></TabsContent>
          <TabsContent value="contas"><ContasPanel /></TabsContent>
          <TabsContent value="numeros"><NumerosPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// ========================
// Ouvidoria Panel
// ========================
const OuvidoriaPanel = () => {
  const [items, setItems] = useState<Manifestacao[]>([]);
  const [filter, setFilter] = useState<"todos" | "pendente" | "respondido">("todos");
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [respostaText, setRespostaText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => setItems(await listarManifestacoes());
  useEffect(() => { load(); }, []);

  const filtered = filter === "todos" ? items : items.filter((m) => m.status === filter);

  const handleResponder = async (id: string) => {
    if (!respostaText.trim()) return;
    setSaving(true);
    await responderManifestacao(id, respostaText);
    setRespostaText("");
    setRespondingId(null);
    setSaving(false);
    load();
  };

  return (
    <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-navy">Manifestações</h2>
        <div className="flex gap-2">
          {(["todos", "pendente", "respondido"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "navy-solid" : "outline"} size="sm" onClick={() => setFilter(f)}>
              <Filter className="w-3 h-3 mr-1" />
              {f === "todos" ? "Todos" : f === "pendente" ? "Pendentes" : "Respondidos"}
            </Button>
          ))}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Protocolo</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Assunto</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((m) => (
            <Fragment key={m.id}>
              <TableRow key={m.id}>
                <TableCell className="font-medium text-navy">{m.protocolo}</TableCell>
                <TableCell className="text-xs">{m.cpf}</TableCell>
                <TableCell className="capitalize">{m.tipo}</TableCell>
                <TableCell>{m.assunto}</TableCell>
                <TableCell className="text-xs">{m.dataCriacao}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${m.status === "respondido" ? "bg-secondary/15 text-secondary font-semibold" : "bg-amber-100 text-amber-700 font-semibold"}`}>
                    {m.status === "respondido" ? "Respondido" : "Pendente"}
                  </span>
                </TableCell>
                <TableCell>
                  {m.status === "pendente" && (
                    <Button size="sm" variant="outline" onClick={() => { setRespondingId(respondingId === m.id ? null : m.id); setRespostaText(""); }}>
                      <Send className="w-3 h-3 mr-1" /> Responder
                    </Button>
                  )}
                </TableCell>
              </TableRow>
              {respondingId === m.id && (
                <TableRow key={`${m.id}-resp`}>
                  <TableCell colSpan={7} className="bg-muted/50">
                    <div className="space-y-3 py-2">
                      <p className="text-sm"><strong>Mensagem do cidadão:</strong> {m.mensagem}</p>
                      <Textarea placeholder="Digite a resposta oficial..." value={respostaText} onChange={(e) => setRespostaText(e.target.value)} rows={3} />
                      <div className="flex gap-2">
                        <Button variant="navy-solid" size="sm" onClick={() => handleResponder(m.id)} disabled={saving}>
                          <Send className="w-3 h-3 mr-1" /> {saving ? "Salvando..." : "Enviar Resposta"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setRespondingId(null)}>Cancelar</Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

// ========================
// Transparência Panel
// ========================
const TransparenciaPanel = () => {
  const [docs, setDocs] = useState<DocumentoTransparencia[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentoTransparencia | null>(null);
  const [form, setForm] = useState({ nome: "", descricao: "", categoria: "", dataPublicacao: "", arquivo: "", is_favorite: false });
  
  const [categoriasLista, setCategoriasLista] = useState<string[]>(() => {
    const saved = localStorage.getItem("sc_transparencia_categorias");
    return saved ? JSON.parse(saved) : ["Estrutura Organizacional", "Financeiro", "Contrato de Gestão", "Convênios", "Documentos Institucionais", "Editais"];
  });
  const [novaCat, setNovaCat] = useState("");

  const load = async () => setDocs(await listarDocumentos());
  useEffect(() => { load(); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2.5 * 1024 * 1024) {
        toast.error("O arquivo deve ter no máximo 2.5MB.");
        return;
      }
      const base64 = await fileToBase64(file);
      setForm({ ...form, arquivo: base64 });
    }
  };

  const handleSave = async () => {
    if (!form.nome || !form.categoria || !form.dataPublicacao) return;
    if (editingDoc) {
      await editarDocumento(editingDoc.id, form);
    } else {
      await criarDocumento(form);
    }
    setShowForm(false);
    setEditingDoc(null);
    setForm({ nome: "", descricao: "", categoria: "", dataPublicacao: "", arquivo: "", is_favorite: false });
    load();
  };

  const handleEdit = (doc: DocumentoTransparencia) => {
    setEditingDoc(doc);
    setForm({ nome: doc.nome, descricao: doc.descricao || "", categoria: doc.categoria, dataPublicacao: doc.dataPublicacao, arquivo: doc.arquivo || "", is_favorite: doc.is_favorite || false });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await excluirDocumento(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Documentos de Transparência</h2>
        <Button variant="navy-solid" onClick={() => { setShowForm(!showForm); setEditingDoc(null); setForm({ nome: "", descricao: "", categoria: "", dataPublicacao: "", arquivo: "", is_favorite: false }); }}>
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          <span>{showForm ? "Cancelar" : "Novo Documento"}</span>
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 space-y-4">
          <h3 className="font-bold text-navy">{editingDoc ? "Editar Documento" : "Novo Documento"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Nome do Documento</label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Categoria (Aba)</label>
              <div className="flex gap-2">
                <Select value={form.categoria} onValueChange={(val) => setForm({ ...form, categoria: val })}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriasLista.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" title="Gerenciar Categorias">
                      <Settings className="w-4 h-4 text-navy" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Gerenciar Categorias</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex gap-2">
                        <Input placeholder="Nova categoria..." value={novaCat} onChange={e => setNovaCat(e.target.value)} />
                        <Button onClick={() => {
                          if (novaCat && !categoriasLista.includes(novaCat)) {
                            const novaLista = [...categoriasLista, novaCat];
                            setCategoriasLista(novaLista);
                            localStorage.setItem("sc_transparencia_categorias", JSON.stringify(novaLista));
                            setNovaCat("");
                          }
                        }}>Adicionar</Button>
                      </div>
                      <div className="max-h-60 overflow-y-auto space-y-2">
                        {categoriasLista.map(cat => (
                          <div key={cat} className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span className="text-sm font-medium">{cat}</span>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => {
                              const novaLista = categoriasLista.filter(c => c !== cat);
                              setCategoriasLista(novaLista);
                              localStorage.setItem("sc_transparencia_categorias", JSON.stringify(novaLista));
                              if (form.categoria === cat) setForm({ ...form, categoria: "" });
                            }}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Data de Publicação</label>
              <Input type="date" value={form.dataPublicacao} onChange={(e) => setForm({ ...form, dataPublicacao: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Breve Descrição (Opcional)</label>
            <Textarea 
              placeholder="Ex: Documento referente ao 3º trimestre..." 
              value={form.descricao} 
              onChange={(e) => setForm({ ...form, descricao: e.target.value })} 
              className="resize-none"
              rows={2}
            />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Switch 
              id="is_favorite" 
              checked={form.is_favorite} 
              onCheckedChange={(checked) => setForm({ ...form, is_favorite: checked })} 
            />
            <label htmlFor="is_favorite" className="text-sm font-semibold text-navy cursor-pointer">
              Destacar na Home (Seção Nossos Números)
            </label>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Arquivo Anexo (PDF/Imagem - Max 2.5MB)</label>
            <div className="flex items-center gap-4">
              <Input type="file" accept=".pdf,image/*" onChange={handleFileUpload} className="cursor-pointer file:cursor-pointer max-w-sm" />
              {form.arquivo && <span className="text-xs font-bold text-emerald whitespace-nowrap"><CheckCircle className="w-4 h-4 inline mr-1"/> Arquivo Anexado</span>}
            </div>
          </div>
          <Button variant="navy-solid" onClick={handleSave}>
            {editingDoc ? "Salvar Alterações" : "Publicar Documento"}
          </Button>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Destaque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {docs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium text-navy">{doc.nome}</TableCell>
                <TableCell>{doc.categoria}</TableCell>
                <TableCell className="text-xs">{doc.dataPublicacao}</TableCell>
                <TableCell>
                  {doc.is_favorite ? <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> : null}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(doc)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(doc.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ========================
// Notícias Panel
// ========================
const NoticiasPanel = () => {
  const [items, setItems] = useState<Noticia[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Noticia | null>(null);
  const [form, setForm] = useState({ titulo: "", corpo: "", categoria: "", images: [] as string[], data: "" });

  const load = async () => setItems(await listarNoticias());
  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages: string[] = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`A imagem ${file.name} excede o limite de 5MB.`);
          continue;
        }
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSave = async () => {
    if (!form.titulo || !form.data) return;
    
    const dataToSave = {
      titulo: form.titulo,
      corpo: form.corpo,
      categoria: form.categoria,
      imagem: form.images.length > 0 ? JSON.stringify(form.images) : "",
      data: form.data
    };

    if (editingItem) {
      await editarNoticia(editingItem.id, dataToSave);
    } else {
      await criarNoticia(dataToSave);
    }
    setShowForm(false);
    setEditingItem(null);
    setForm({ titulo: "", corpo: "", categoria: "", images: [], data: "" });
    load();
  };

  const handleEdit = (n: Noticia) => {
    setEditingItem(n);
    let parsedImages: string[] = [];
    try {
      if (n.imagem && n.imagem.startsWith('[')) {
        parsedImages = JSON.parse(n.imagem);
      } else if (n.imagem) {
        parsedImages = [n.imagem];
      }
    } catch {
      if (n.imagem) parsedImages = [n.imagem];
    }
    setForm({ titulo: n.titulo, corpo: n.corpo, categoria: n.categoria || "", images: parsedImages, data: n.data });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta notícia?")) {
      await excluirNoticia(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Notícias e Eventos</h2>
        <Button variant="navy-solid" onClick={() => { setShowForm(!showForm); setEditingItem(null); setForm({ titulo: "", corpo: "", categoria: "", images: [], data: "" }); }}>
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          <span>{showForm ? "Cancelar" : "Nova Notícia"}</span>
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 space-y-4">
          <h3 className="font-bold text-navy">{editingItem ? "Editar Notícia" : "Nova Notícia"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Título</label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Categoria</label>
              <Select value={form.categoria} onValueChange={(val) => setForm({ ...form, categoria: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comunidade">Comunidade</SelectItem>
                  <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                  <SelectItem value="Filantropia">Filantropia</SelectItem>
                  <SelectItem value="Institucional">Institucional</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Aviso">Aviso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Data</label>
              <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Imagens (Max 5MB cada)</label>
            <div className="flex flex-col gap-4 items-start">
              <div className="w-full">
                <Input type="file" accept="image/*" multiple onChange={handleImageUpload} className="cursor-pointer file:cursor-pointer mb-2" />
                <p className="text-xs text-muted-foreground">Pode selecionar várias de uma vez.</p>
              </div>
              
              {form.images.length > 0 && (
                <div className="flex gap-2 flex-wrap w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-border group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Corpo da Notícia</label>
            <Textarea rows={5} value={form.corpo} onChange={(e) => setForm({ ...form, corpo: e.target.value })} />
          </div>
          <Button variant="navy-solid" onClick={handleSave}>
            {editingItem ? "Salvar Alterações" : "Publicar Notícia"}
          </Button>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium text-navy">{n.titulo}</TableCell>
                <TableCell>{n.categoria}</TableCell>
                <TableCell className="text-xs">{n.data}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(n)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(n.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ========================
// Depoimentos Panel
// ========================
const DepoimentosPanel = () => {
  const [items, setItems] = useState<Depoimento[]>([]);
  const [filter, setFilter] = useState<"todos" | "pendente" | "aprovado" | "recusado">("todos");
  const [editingItem, setEditingItem] = useState<Depoimento | null>(null);
  const [form, setForm] = useState({ autor: "", papel: "", texto: "", estrelas: 5 });

  const load = async () => setItems(await listarDepoimentosAdmin());
  useEffect(() => { load(); }, []);

  const filtered = filter === "todos" ? items : items.filter((d) => d.status === filter);

  const handleStatus = async (id: string, status: "aprovado" | "recusado") => {
    await alterarStatusDepoimento(id, status);
    load();
  };

  const handleDelete = async (id: string) => {
    await excluirDepoimento(id);
    load();
  };

  const startEdit = (d: Depoimento) => {
    setEditingItem(d);
    setForm({ autor: d.autor, papel: d.papel, texto: d.texto, estrelas: d.estrelas });
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    await editarDepoimento(editingItem.id, form);
    setEditingItem(null);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-navy">Gerenciar Depoimentos</h2>
        <div className="flex gap-2 flex-wrap">
          {(["todos", "pendente", "aprovado", "recusado"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "navy-solid" : "outline"} size="sm" onClick={() => setFilter(f)}>
              <Filter className="w-3 h-3 mr-1" />
              <span className="capitalize">{f}</span>
            </Button>
          ))}
        </div>
      </div>

      {editingItem && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 space-y-4">
          <h3 className="font-bold text-navy">Editar Depoimento</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Autor</label>
              <Input value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Papel / Função</label>
              <Input value={form.papel} onChange={(e) => setForm({ ...form, papel: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Estrelas (1 a 5)</label>
              <Input type="number" min="1" max="5" value={form.estrelas} onChange={(e) => setForm({ ...form, estrelas: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Texto</label>
            <Textarea rows={3} value={form.texto} onChange={(e) => setForm({ ...form, texto: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button variant="navy-solid" onClick={handleSaveEdit}>Salvar Alterações</Button>
            <Button variant="ghost" onClick={() => setEditingItem(null)}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Autor / Papel</TableHead>
              <TableHead>Texto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((d) => (
              <TableRow key={d.id}>
                <TableCell>
                  <div className="font-medium text-navy">{d.autor}</div>
                  <div className="text-xs text-muted-foreground">{d.papel}</div>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: d.estrelas }).map((_, i) => (
                       <Star key={i} className="w-3 h-3 text-secondary fill-secondary" />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate" title={d.texto}>{d.texto}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    d.status === 'aprovado' ? 'bg-secondary/15 text-secondary' : 
                    d.status === 'recusado' ? 'bg-destructive/15 text-destructive' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {d.status === 'pendente' && (
                      <>
                        <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50" onClick={() => handleStatus(d.id, "aprovado")} title="Aprovar">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleStatus(d.id, "recusado")} title="Recusar">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => startEdit(d)} title="Editar"><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(d.id)} title="Excluir"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ========================
// Doações Panel
// ========================
const DoacoesPanel = () => {
  const [items, setItems] = useState<DoacaoTransparencia[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<DoacaoTransparencia | null>(null);
  const [form, setForm] = useState({ descricao: "", images: [] as string[] });

  const load = async () => setItems(await listarDoacoes());
  useEffect(() => { load(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newImages: string[] = [];
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`A imagem ${file.name} excede o limite de 5MB.`);
          continue;
        }
        const base64 = await fileToBase64(file);
        newImages.push(base64);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    }
  };

  const removeImage = (index: number) => {
    setForm(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const handleSave = async () => {
    if (!form.descricao || form.images.length === 0) return;
    
    // Converte o array de imagens para string JSON
    const dataToSave = {
      descricao: form.descricao,
      imagem_url: JSON.stringify(form.images)
    };

    if (editingItem) {
      await editarDoacao(editingItem.id, dataToSave);
    } else {
      await criarDoacao(dataToSave);
    }
    setShowForm(false);
    setEditingItem(null);
    setForm({ descricao: "", images: [] });
    load();
  };

  const handleEdit = (d: DoacaoTransparencia) => {
    setEditingItem(d);
    let parsedImages: string[] = [];
    try {
      if (d.imagem_url.startsWith('[')) {
        parsedImages = JSON.parse(d.imagem_url);
      } else {
        parsedImages = [d.imagem_url]; // legacy single image
      }
    } catch {
      parsedImages = [d.imagem_url];
    }
    setForm({ descricao: d.descricao, images: parsedImages });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta doação?")) {
      await excluirDoacao(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Feed de Transparência de Doações</h2>
        <Button variant="navy-solid" onClick={() => { setShowForm(!showForm); setEditingItem(null); setForm({ descricao: "", images: [] }); }}>
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          <span>{showForm ? "Cancelar" : "Novo Post"}</span>
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 space-y-4">
          <h3 className="font-bold text-navy">{editingItem ? "Editar Post" : "Novo Post de Doação"}</h3>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Fotos da Doação (Max 5MB cada)</label>
            <div className="flex flex-col gap-4 items-start">
              <div className="w-full">
                <div className="relative border-2 border-dashed border-border rounded-xl p-8 hover:bg-slate-50 transition-colors text-center cursor-pointer">
                  <Input type="file" accept="image/*" multiple onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-navy">Clique para anexar ou arraste as fotos</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG ou WEBP (Pode selecionar várias de uma vez)</p>
                </div>
              </div>
              
              {form.images.length > 0 && (
                <div className="flex gap-2 flex-wrap w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border shadow-sm group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Descrição</label>
            <Textarea rows={4} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <Button variant="navy-solid" onClick={handleSave}>
            {editingItem ? "Salvar Alterações" : "Publicar"}
          </Button>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((d) => {
              let firstImage = "";
              try {
                if (d.imagem_url.startsWith('[')) {
                  firstImage = JSON.parse(d.imagem_url)[0];
                } else {
                  firstImage = d.imagem_url;
                }
              } catch {
                firstImage = d.imagem_url;
              }

              return (
                <TableRow key={d.id}>
                  <TableCell>
                    <img src={firstImage} alt="Doação" className="w-16 h-16 object-cover rounded-md" />
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{d.descricao}</TableCell>
                  <TableCell className="text-xs">{d.data_publicacao}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(d)}><Edit className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(d.id)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ========================
// Numeros Panel
// ========================
const NumerosPanel = () => {
  const [items, setItems] = useState<NumeroEstatistico[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<NumeroEstatistico | null>(null);
  const [form, setForm] = useState({ icone: "Users", valor: "", titulo: "", descricao: "", ordem: 0 });

  const load = async () => setItems(await listarNumeros());
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.icone || !form.valor || !form.titulo) return;
    if (editingItem) {
      await editarNumero(editingItem.id, form);
    } else {
      await criarNumero(form as Omit<NumeroEstatistico, "id">);
    }
    setShowForm(false);
    setEditingItem(null);
    setForm({ icone: "Users", valor: "", titulo: "", descricao: "", ordem: 0 });
    load();
  };

  const handleEdit = (n: NumeroEstatistico) => {
    setEditingItem(n);
    setForm({ icone: n.icone, valor: n.valor, titulo: n.titulo, descricao: n.descricao, ordem: n.ordem });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await excluirNumero(id);
    load();
  };

  const iconesDisponiveis = ["Users", "HeartPulse", "Stethoscope", "BedDouble", "Award", "TrendingUp", "Activity", "Building", "Ambulance", "ClipboardList"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Estatísticas - Nossos Números</h2>
        <Button variant="navy-solid" onClick={() => { setShowForm(!showForm); setEditingItem(null); setForm({ icone: "Users", valor: "", titulo: "", descricao: "", ordem: 0 }); }}>
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          <span>{showForm ? "Cancelar" : "Novo Número"}</span>
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 space-y-4">
          <h3 className="font-bold text-navy">{editingItem ? "Editar Número" : "Novo Número Estatístico"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Ícone</label>
              <Select value={form.icone} onValueChange={(val) => setForm({ ...form, icone: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ícone" />
                </SelectTrigger>
                <SelectContent>
                  {iconesDisponiveis.map(icon => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Valor (Ex: 3.000+)</label>
              <Input value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Título (Ex: Atendimentos)</label>
              <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Ordem (Ex: 1, 2, 3)</label>
              <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-navy block mb-1">Descrição</label>
            <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <Button variant="navy-solid" onClick={handleSave}>
            {editingItem ? "Salvar Alterações" : "Adicionar Número"}
          </Button>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Ícone</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...items].sort((a,b) => a.ordem - b.ordem).map((n) => (
              <TableRow key={n.id}>
                <TableCell>{n.ordem}</TableCell>
                <TableCell className="font-mono text-xs">{n.icone}</TableCell>
                <TableCell className="font-bold text-navy">{n.valor}</TableCell>
                <TableCell>{n.titulo}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{n.descricao}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(n)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(n.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// ========================
// Contas Panel (Financeiro / Recebimentos)
// ========================
const ContasPanel = () => {
  const [items, setItems] = useState<ContaDoacao[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ContaDoacao | null>(null);
  
  const defaultForm = {
    tipo: "conta" as "pix" | "conta",
    banco: "",
    agencia: "",
    conta: "",
    chave_pix: "",
    descricao: "",
    favorecido: "Irmandade Santa Casa de Misericordia",
    ordem: 0
  };
  
  const [form, setForm] = useState(defaultForm);

  const load = async () => setItems(await listarContasDoacao());
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.tipo || !form.favorecido) return;
    if (form.tipo === 'pix' && !form.chave_pix) return;
    if (form.tipo === 'conta' && (!form.banco || !form.agencia || !form.conta)) return;

    if (editingItem) {
      await editarContaDoacao(editingItem.id, form);
    } else {
      await criarContaDoacao(form as Omit<ContaDoacao, "id">);
    }
    setShowForm(false);
    setEditingItem(null);
    setForm(defaultForm);
    load();
  };

  const handleEdit = (c: ContaDoacao) => {
    setEditingItem(c);
    setForm({
      tipo: c.tipo,
      banco: c.banco || "",
      agencia: c.agencia || "",
      conta: c.conta || "",
      chave_pix: c.chave_pix || "",
      descricao: c.descricao || "",
      favorecido: c.favorecido,
      ordem: c.ordem
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if(confirm("Tem certeza que deseja excluir esta conta?")) {
      await excluirContaDoacao(id);
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-navy">Gerenciar Contas e PIX (Doações)</h2>
        <Button variant="navy-solid" onClick={() => { setShowForm(!showForm); setEditingItem(null); setForm(defaultForm); }}>
          {showForm ? <X className="w-4 h-4 mr-1" /> : <Plus className="w-4 h-4 mr-1" />}
          <span>{showForm ? "Cancelar" : "Nova Conta/PIX"}</span>
        </Button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-6 border border-border/60 space-y-4">
          <h3 className="font-bold text-navy">{editingItem ? "Editar Conta/PIX" : "Adicionar Recebimento"}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Tipo</label>
              <Select value={form.tipo} onValueChange={(val: "pix" | "conta") => setForm({ ...form, tipo: val })}>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="conta">Conta Bancária</SelectItem>
                  <SelectItem value="pix">Chave PIX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Favorecido (Titular)</label>
              <Input value={form.favorecido} onChange={(e) => setForm({ ...form, favorecido: e.target.value })} />
            </div>
          </div>

          {form.tipo === 'conta' ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div>
                <label className="text-sm font-semibold text-navy block mb-1">Banco</label>
                <Input placeholder="Ex: Banco do Brasil" value={form.banco} onChange={(e) => setForm({ ...form, banco: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-navy block mb-1">Agência</label>
                <Input placeholder="Ex: 0507-X" value={form.agencia} onChange={(e) => setForm({ ...form, agencia: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-semibold text-navy block mb-1">Conta Corrente</label>
                <Input placeholder="Ex: 16580-8" value={form.conta} onChange={(e) => setForm({ ...form, conta: e.target.value })} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 bg-emerald/5 border border-emerald/10 rounded-xl">
              <div>
                <label className="text-sm font-semibold text-emerald-700 block mb-1">Chave PIX</label>
                <Input placeholder="Ex: 53.782.355/0001-46 ou (11) 99999-9999" value={form.chave_pix} onChange={(e) => setForm({ ...form, chave_pix: e.target.value })} />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Descrição Breve</label>
              <Input placeholder="Ex: Depósito Bancário ou Chave (CNPJ)" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-semibold text-navy block mb-1">Ordem (Ex: 1, 2, 3)</label>
              <Input type="number" value={form.ordem} onChange={(e) => setForm({ ...form, ordem: Number(e.target.value) })} />
            </div>
          </div>

          <Button variant="navy-solid" onClick={handleSave}>
            {editingItem ? "Salvar Alterações" : "Adicionar Recebimento"}
          </Button>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordem</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Detalhes</TableHead>
              <TableHead>Favorecido</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...items].sort((a,b) => a.ordem - b.ordem).map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.ordem}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${c.tipo === 'pix' ? 'bg-emerald/10 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {c.tipo}
                  </span>
                </TableCell>
                <TableCell>
                  {c.tipo === 'conta' ? (
                    <div>
                      <div className="font-bold text-navy text-sm">{c.banco}</div>
                      <div className="text-xs text-muted-foreground">Ag: {c.agencia} | CC: {c.conta}</div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-mono font-bold text-emerald-600 text-sm">{c.chave_pix}</div>
                      <div className="text-xs text-muted-foreground">{c.descricao}</div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{c.favorecido}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(c)}><Edit className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(c.id)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Nenhuma conta cadastrada.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminDashboard;
