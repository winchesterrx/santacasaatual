import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageCircle, ClipboardList, Search, ChevronDown, ChevronUp, Send, Copy, Check } from "lucide-react";
import { criarManifestacao, buscarPorProtocolo, buscarPorCpf, type Manifestacao } from "@/services/mockApi";

const formatCpf = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

const tipoLabels: Record<string, string> = {
  elogio: "Elogio",
  sugestao: "Sugestão",
  reclamacao: "Reclamação",
  denuncia: "Denúncia",
};

const statusBadge = (status: string) =>
  status === "respondido"
    ? "bg-secondary/15 text-secondary font-semibold"
    : "bg-amber-100 text-amber-700 font-semibold";

const OuvidoriaSection = () => {
  // New manifestation form
  const [formData, setFormData] = useState({ cpf: "", tipo: "reclamacao" as Manifestacao["tipo"], assunto: "", mensagem: "" });
  const [submitted, setSubmitted] = useState<Manifestacao | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (submitted?.protocolo) {
      navigator.clipboard.writeText(submitted.protocolo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Search by protocol
  const [protocoloInput, setProtocoloInput] = useState("");
  const [protocoloResult, setProtocoloResult] = useState<Manifestacao | null | undefined>(undefined);
  const [searchingProtocolo, setSearchingProtocolo] = useState(false);

  // Search by CPF
  const [cpfInput, setCpfInput] = useState("");
  const [cpfResults, setCpfResults] = useState<Manifestacao[]>([]);
  const [searchedCpf, setSearchedCpf] = useState(false);
  const [searchingCpf, setSearchingCpf] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assunto || !formData.mensagem) return;
    setSubmitting(true);
    const result = await criarManifestacao(formData);
    setSubmitted(result);
    setSubmitting(false);
  };

  const handleSearchProtocolo = async () => {
    if (!protocoloInput.trim()) return;
    setSearchingProtocolo(true);
    const result = await buscarPorProtocolo(protocoloInput.trim());
    setProtocoloResult(result);
    setSearchingProtocolo(false);
  };

  const handleSearchCpf = async () => {
    if (cpfInput.replace(/\D/g, "").length < 11) return;
    setSearchingCpf(true);
    const results = await buscarPorCpf(cpfInput);
    setCpfResults(results);
    setSearchedCpf(true);
    setSearchingCpf(false);
  };

  return (
    <section id="ouvidoria" className="section-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 relative">
          <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 items-center" aria-hidden="true">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-xs font-bold uppercase tracking-widest text-emerald">
              Fale Conosco
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-navy mt-6 mb-4">
            Ouvidoria, Dúvidas, Sugestões e Reclamações
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            Seu canal direto e confidencial com a Santa Casa. Registre sua manifestação com segurança e acompanhe o andamento pelo protocolo gerado.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="nova" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-8 h-12">
              <TabsTrigger value="nova" className="text-sm font-semibold gap-2">
                <MessageCircle className="w-4 h-4" />
                Nova Manifestação
              </TabsTrigger>
              <TabsTrigger value="consultar" className="text-sm font-semibold gap-2">
                <Search className="w-4 h-4" />
                Consultar Status
              </TabsTrigger>
            </TabsList>

            {/* ===== Nova Manifestação ===== */}
            <TabsContent value="nova">
              {submitted ? (
                <div className="bg-secondary/10 rounded-2xl p-8 text-center border border-secondary/20">
                  <ClipboardList className="w-12 h-12 text-secondary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-navy mb-2">Manifestação Registrada!</h3>
                  <p className="text-muted-foreground mb-4">Seu protocolo é:</p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-3xl font-extrabold text-white bg-emerald rounded-xl py-4 px-8 inline-block shadow-lg border border-emerald/20">
                      {submitted.protocolo}
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={handleCopy} 
                      className="h-16 w-16 rounded-xl border-emerald/20 hover:bg-emerald/10 shadow-sm" 
                      title="Copiar Protocolo"
                    >
                      {copied ? <Check className="w-7 h-7 text-emerald" /> : <Copy className="w-7 h-7 text-navy" />}
                    </Button>
                  </div>
                  <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-5 max-w-md mx-auto shadow-sm">
                    <p className="text-sm text-amber-800 font-bold flex items-center justify-center gap-2 mb-2">
                      <span className="text-xl">⚠️</span> Muito Importante:
                    </p>
                    <p className="text-sm text-amber-700 leading-relaxed">
                      Anote ou tire um print do número do seu protocolo acima. Ele é a <strong>única forma</strong> de você acompanhar a resposta da sua manifestação no futuro.
                    </p>
                  </div>
                  <Button variant="outline" className="mt-6" onClick={() => { setSubmitted(null); setFormData({ cpf: "", tipo: "reclamacao", assunto: "", mensagem: "" }); }}>
                    Nova Manifestação
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 bg-card rounded-2xl p-8 border border-border/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-1.5">CPF <span className="text-muted-foreground font-normal">(Opcional - Anônimo)</span></label>
                      <Input
                        placeholder="000.000.000-00"
                        value={formData.cpf}
                        onChange={(e) => setFormData({ ...formData, cpf: formatCpf(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-navy block mb-1.5">Tipo</label>
                      <select
                        value={formData.tipo}
                        onChange={(e) => setFormData({ ...formData, tipo: e.target.value as Manifestacao["tipo"] })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="elogio">Elogio</option>
                        <option value="sugestao">Sugestão</option>
                        <option value="reclamacao">Reclamação</option>
                        <option value="denuncia">Denúncia</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-navy block mb-1.5">Assunto</label>
                    <Input
                      placeholder="Resumo da sua manifestação"
                      value={formData.assunto}
                      onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-navy block mb-1.5">Mensagem</label>
                    <Textarea
                      placeholder="Descreva detalhadamente..."
                      rows={5}
                      value={formData.mensagem}
                      onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" variant="navy-solid" size="lg" className="w-full rounded-full" disabled={submitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? "Enviando..." : "Enviar Manifestação"}
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* ===== Consultar Status ===== */}
            <TabsContent value="consultar">
              <div className="space-y-8">
                {/* By Protocol */}
                <div className="bg-card rounded-2xl p-8 border border-border/60">
                  <h3 className="text-lg font-bold text-navy mb-4">Buscar por Protocolo</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Ex: OUV-2026-0001"
                      value={protocoloInput}
                      onChange={(e) => { setProtocoloInput(e.target.value); setProtocoloResult(undefined); }}
                    />
                    <Button variant="navy-solid" onClick={handleSearchProtocolo} disabled={searchingProtocolo}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  {protocoloResult === null && (
                    <p className="text-sm text-muted-foreground mt-4">Nenhuma manifestação encontrada com este protocolo.</p>
                  )}
                  {protocoloResult && (
                    <div className="mt-4 bg-muted rounded-xl p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-navy">{protocoloResult.protocolo}</span>
                        <span className={`text-xs px-3 py-1 rounded-full ${statusBadge(protocoloResult.status)}`}>
                          {protocoloResult.status === "respondido" ? "Respondido" : "Pendente"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground"><strong>Tipo:</strong> {tipoLabels[protocoloResult.tipo]}</p>
                      <p className="text-sm text-muted-foreground"><strong>Assunto:</strong> {protocoloResult.assunto}</p>
                      <p className="text-sm text-muted-foreground"><strong>Data:</strong> {protocoloResult.dataCriacao}</p>
                      {protocoloResult.resposta && (
                        <div className="mt-3 bg-secondary/10 rounded-lg p-4 border border-secondary/20">
                          <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-1">Resposta Oficial</p>
                          <p className="text-sm text-foreground">{protocoloResult.resposta}</p>
                          <p className="text-xs text-muted-foreground mt-2">Respondido em: {protocoloResult.dataResposta}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* By CPF */}
                <div className="bg-card rounded-2xl p-8 border border-border/60">
                  <h3 className="text-lg font-bold text-navy mb-4">Buscar por CPF</h3>
                  <div className="flex gap-3">
                    <Input
                      placeholder="000.000.000-00"
                      value={cpfInput}
                      onChange={(e) => { setCpfInput(formatCpf(e.target.value)); setSearchedCpf(false); }}
                    />
                    <Button variant="navy-solid" onClick={handleSearchCpf} disabled={searchingCpf}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                  {searchedCpf && cpfResults.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-4">Nenhuma manifestação encontrada para este CPF.</p>
                  )}
                  {cpfResults.length > 0 && (
                    <div className="mt-4 overflow-auto rounded-xl border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Protocolo</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Assunto</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-10"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {cpfResults.map((m) => (
                            <>
                              <TableRow key={m.id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === m.id ? null : m.id)}>
                                <TableCell className="font-medium text-navy">{m.protocolo}</TableCell>
                                <TableCell>{tipoLabels[m.tipo]}</TableCell>
                                <TableCell>{m.assunto}</TableCell>
                                <TableCell>
                                  <span className={`text-xs px-2.5 py-0.5 rounded-full ${statusBadge(m.status)}`}>
                                    {m.status === "respondido" ? "Respondido" : "Pendente"}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {expandedId === m.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </TableCell>
                              </TableRow>
                              {expandedId === m.id && (
                                <TableRow key={`${m.id}-detail`}>
                                  <TableCell colSpan={5} className="bg-muted/50">
                                    <div className="space-y-2 py-2">
                                      <p className="text-sm"><strong>Mensagem:</strong> {m.mensagem}</p>
                                      <p className="text-xs text-muted-foreground">Registrado em: {m.dataCriacao}</p>
                                      {m.resposta ? (
                                        <div className="bg-secondary/10 rounded-lg p-4 border border-secondary/20 mt-2">
                                          <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-1">Resposta Oficial</p>
                                          <p className="text-sm">{m.resposta}</p>
                                          <p className="text-xs text-muted-foreground mt-2">Respondido em: {m.dataResposta}</p>
                                        </div>
                                      ) : (
                                        <p className="text-sm text-amber-600 font-medium">Aguardando resposta da Ouvidoria.</p>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default OuvidoriaSection;
