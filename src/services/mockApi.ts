// API service layer - Agora conectada ao backend real via Proxy (/api)
import { withCache, cacheInvalidate } from './cache';

export interface Manifestacao {
  id: string;
  protocolo: string;
  cpf: string;
  tipo: "elogio" | "sugestao" | "reclamacao" | "denuncia";
  assunto: string;
  mensagem: string;
  status: "pendente" | "respondido";
  resposta?: string;
  dataCriacao: string;
  dataResposta?: string;
}

export interface DocumentoTransparencia {
  id: string;
  nome: string;
  categoria: string;
  dataPublicacao: string;
  arquivo?: string;
  descricao?: string;
  is_favorite?: boolean;
}

export interface NumeroEstatistico {
  id: string;
  icone: string;
  valor: string;
  titulo: string;
  descricao: string;
  ordem: number;
}

export interface Noticia {
  id: string;
  titulo: string;
  corpo: string;
  categoria?: string;
  imagem: string;
  data: string;
}

export interface Depoimento {
  id: string;
  autor: string;
  papel: string;
  texto: string;
  estrelas: number;
  status: 'pendente' | 'aprovado' | 'recusado';
  data: string;
}

export interface DoacaoTransparencia {
  id: string;
  descricao: string;
  imagem_url: string;
  curtidas: number;
  data_publicacao: string;
}

export interface ContaDoacao {
  id: string;
  tipo: 'pix' | 'conta';
  banco?: string;
  agencia?: string;
  conta?: string;
  chave_pix?: string;
  descricao?: string;
  favorecido: string;
  ordem: number;
}

export interface Servico {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
  destaque: boolean;
  ordem: number;
}

export interface Infraestrutura {
  id: string;
  icone: string;
  nome: string;
  quantidade: number;
  ordem: number;
}

// Helpers

const fetchApi = async (url: string, options: RequestInit = {}) => {
  const token = sessionStorage.getItem("sc_admin_token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, { ...options, headers: { ...headers, ...options.headers } });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Erro na requisição: ${response.status} - ${err}`);
  }
  return response.json();
};

// TTLs de cache (ms)
const TTL_LONGO  = 10 * 60 * 1000; // 10 min — dados que mudam pouco
const TTL_MEDIO  =  5 * 60 * 1000; //  5 min — dados moderadamente dinâmicos
const TTL_CURTO  =  2 * 60 * 1000; //  2 min — dados mais frequentes

// ========================
// Ouvidoria API
// ========================

export async function criarManifestacao(data: Omit<Manifestacao, "id" | "protocolo" | "status" | "dataCriacao" | "dataResposta" | "resposta">): Promise<any> {
  const protocolo = `OUV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  return fetchApi('/api/ouvidoria', {
    method: 'POST',
    body: JSON.stringify({ ...data, protocolo }),
  });
}

export async function buscarPorProtocolo(protocolo: string): Promise<Manifestacao | null> {
  const todas = await listarManifestacoes();
  return todas.find((m: Manifestacao) => m.protocolo.toLowerCase() === protocolo.toLowerCase()) || null;
}

export async function buscarPorCpf(cpf: string): Promise<Manifestacao[]> {
  const todas = await listarManifestacoes();
  return todas.filter((m: Manifestacao) => m.cpf === cpf);
}

export async function listarManifestacoes(): Promise<Manifestacao[]> {
  const data = await fetchApi('/api/ouvidoria');
  return data.map((d: any) => ({
    ...d,
    dataCriacao: new Date(d.data_criacao).toISOString().split('T')[0],
    dataResposta: d.data_resposta ? new Date(d.data_resposta).toISOString().split('T')[0] : undefined
  }));
}

// Invalida cache de ouvidoria após resposta
export async function responderManifestacaoComCache(id: string, resposta: string): Promise<any> {
  const r = await responderManifestacao(id, resposta);
  cacheInvalidate('ouvidoria');
  return r;
}

export async function responderManifestacao(id: string, resposta: string): Promise<any> {
  return fetchApi(`/api/ouvidoria/${id}/responder`, {
    method: 'PUT',
    body: JSON.stringify({ resposta }),
  });
}

// ========================
// Transparência API
// ========================

export async function listarDocumentos(): Promise<DocumentoTransparencia[]> {
  return withCache('documentos', async () => {
    const data = await fetchApi('/api/documentos');
    return data.map((d: any) => ({
      id: d.id.toString(),
      nome: d.nome,
      categoria: d.categoria,
      dataPublicacao: new Date(d.data_publicacao).toISOString().split('T')[0],
      arquivo: d.arquivo_url,
      is_favorite: d.is_favorite === 1 || d.is_favorite === true
    }));
  }, TTL_LONGO);
}

export async function criarDocumento(data: Omit<DocumentoTransparencia, "id">): Promise<any> {
  const r = await fetchApi('/api/documentos', { method: 'POST', body: JSON.stringify({ nome: data.nome, categoria: data.categoria, data_publicacao: data.dataPublicacao, arquivo_url: data.arquivo || null, is_favorite: data.is_favorite }) });
  cacheInvalidate('documentos');
  return r;
}

export async function editarDocumento(id: string, data: Partial<DocumentoTransparencia>): Promise<any> {
  const r = await fetchApi(`/api/documentos/${id}`, { method: 'PUT', body: JSON.stringify({ nome: data.nome, categoria: data.categoria, data_publicacao: data.dataPublicacao, arquivo_url: data.arquivo, is_favorite: data.is_favorite }) });
  cacheInvalidate('documentos');
  return r;
}

export async function excluirDocumento(id: string): Promise<any> {
  const r = await fetchApi(`/api/documentos/${id}`, { method: 'DELETE' });
  cacheInvalidate('documentos');
  return r;
}

// ========================
// Notícias API
// ========================

// ========================
// Números API
// ========================

export async function listarNumeros(): Promise<NumeroEstatistico[]> {
  return withCache('numeros', async () => {
    const data = await fetchApi('/api/numeros');
    return data.map((d: any) => ({ id: d.id.toString(), icone: d.icone, valor: d.valor, titulo: d.titulo, descricao: d.descricao, ordem: d.ordem }));
  }, TTL_LONGO);
}

export async function criarNumero(data: Omit<NumeroEstatistico, "id">): Promise<any> {
  const r = await fetchApi('/api/numeros', { method: 'POST', body: JSON.stringify(data) });
  cacheInvalidate('numeros');
  return r;
}

export async function editarNumero(id: string, data: Partial<NumeroEstatistico>): Promise<any> {
  const r = await fetchApi(`/api/numeros/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  cacheInvalidate('numeros');
  return r;
}

export async function excluirNumero(id: string): Promise<any> {
  const r = await fetchApi(`/api/numeros/${id}`, { method: 'DELETE' });
  cacheInvalidate('numeros');
  return r;
}

export async function buscarNoticiaPorId(id: string): Promise<Noticia | null> {
  const todas = await listarNoticias();
  return todas.find(n => n.id === id) || null;
}

export async function listarNoticias(): Promise<Noticia[]> {
  return withCache('noticias', async () => {
    const data = await fetchApi('/api/noticias');
    return data.map((d: any) => ({ id: d.id.toString(), titulo: d.titulo, corpo: d.corpo, categoria: d.categoria || "Geral", imagem: d.imagem_url || "", data: new Date(d.data_publicacao).toISOString().split('T')[0] }));
  }, TTL_MEDIO);
}

export async function criarNoticia(data: any): Promise<any> {
  const r = await fetchApi('/api/noticias', { method: 'POST', body: JSON.stringify({ titulo: data.titulo, corpo: data.corpo, categoria: data.categoria, imagem_url: data.imagem, data_publicacao: data.data }) });
  cacheInvalidate('noticias');
  return r;
}

export async function editarNoticia(id: string, data: any): Promise<any> {
  const r = await fetchApi(`/api/noticias/${id}`, { method: 'PUT', body: JSON.stringify({ titulo: data.titulo, corpo: data.corpo, categoria: data.categoria, imagem_url: data.imagem, data_publicacao: data.data }) });
  cacheInvalidate('noticias');
  return r;
}

export async function excluirNoticia(id: string): Promise<any> {
  const r = await fetchApi(`/api/noticias/${id}`, { method: 'DELETE' });
  cacheInvalidate('noticias');
  return r;
}

// ========================
// Depoimentos API
// ========================

export async function listarDepoimentosAdmin(): Promise<Depoimento[]> {
  const data = await fetchApi('/api/depoimentos');
  return data.map((d: any) => ({ id: d.id.toString(), autor: d.autor, papel: d.papel, texto: d.texto, estrelas: d.estrelas, status: d.status, data: new Date(d.data_criacao).toISOString().split('T')[0] }));
}

export async function listarDepoimentosAprovados(): Promise<Depoimento[]> {
  return withCache('depoimentos_aprovados', async () => {
    const todos = await listarDepoimentosAdmin();
    return todos.filter((d: Depoimento) => d.status === 'aprovado');
  }, TTL_MEDIO);
}

export async function criarDepoimento(data: Omit<Depoimento, "id" | "status" | "data">): Promise<any> {
  return fetchApi('/api/depoimentos', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function editarDepoimento(id: string, data: Partial<Depoimento>): Promise<any> {
  return fetchApi(`/api/depoimentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function alterarStatusDepoimento(id: string, status: 'pendente' | 'aprovado' | 'recusado'): Promise<any> {
  return fetchApi(`/api/depoimentos/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function excluirDepoimento(id: string): Promise<any> {
  return fetchApi(`/api/depoimentos/${id}`, {
    method: 'DELETE',
  });
}

// ========================
// Doações (Feed Transparência)
// ========================

export async function listarDoacoes(): Promise<DoacaoTransparencia[]> {
  return withCache('doacoes', async () => {
    const data = await fetchApi('/api/doacoes');
    return data.map((d: any) => ({ id: d.id.toString(), descricao: d.descricao, imagem_url: d.imagem_url, curtidas: d.curtidas, data_publicacao: new Date(d.data_publicacao).toISOString().split('T')[0] }));
  }, TTL_MEDIO);
}

export async function criarDoacao(data: Omit<DoacaoTransparencia, "id" | "data_publicacao" | "curtidas">): Promise<any> {
  const r = await fetchApi('/api/doacoes', { method: 'POST', body: JSON.stringify(data) });
  cacheInvalidate('doacoes');
  return r;
}

export async function editarDoacao(id: string, data: Partial<DoacaoTransparencia>): Promise<any> {
  const r = await fetchApi(`/api/doacoes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  cacheInvalidate('doacoes');
  return r;
}

export async function excluirDoacao(id: string): Promise<any> {
  const r = await fetchApi(`/api/doacoes/${id}`, { method: 'DELETE' });
  cacheInvalidate('doacoes');
  return r;
}

// ========================
// Contas de Doação API
// ========================

export async function listarContasDoacao(): Promise<ContaDoacao[]> {
  return withCache('contas_doacao', async () => {
    const data = await fetchApi('/api/contas-doacao');
    return data.map((d: any) => ({ id: d.id.toString(), tipo: d.tipo, banco: d.banco, agencia: d.agencia, conta: d.conta, chave_pix: d.chave_pix, descricao: d.descricao, favorecido: d.favorecido, ordem: d.ordem }));
  }, TTL_LONGO);
}

export async function criarContaDoacao(data: Omit<ContaDoacao, "id">): Promise<any> {
  const r = await fetchApi('/api/contas-doacao', { method: 'POST', body: JSON.stringify(data) });
  cacheInvalidate('contas_doacao');
  return r;
}

export async function editarContaDoacao(id: string, data: Partial<ContaDoacao>): Promise<any> {
  const r = await fetchApi(`/api/contas-doacao/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  cacheInvalidate('contas_doacao');
  return r;
}

export async function excluirContaDoacao(id: string): Promise<any> {
  const r = await fetchApi(`/api/contas-doacao/${id}`, { method: 'DELETE' });
  cacheInvalidate('contas_doacao');
  return r;
}

// ========================
// SERVIÇOS (ESPECIALIDADES) API
// ========================

export async function listarServicos(): Promise<Servico[]> {
  return withCache('servicos', async () => {
    const data = await fetchApi('/api/servicos');
    return data.map((d: any) => ({ ...d, id: d.id.toString(), destaque: d.destaque === 1 || d.destaque === true }));
  }, TTL_LONGO);
}

export async function criarServico(data: Omit<Servico, "id">): Promise<any> {
  const r = await fetchApi('/api/servicos', { method: 'POST', body: JSON.stringify(data) });
  cacheInvalidate('servicos');
  return r;
}

export async function editarServico(id: string, data: Partial<Servico>): Promise<any> {
  const r = await fetchApi(`/api/servicos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  cacheInvalidate('servicos');
  return r;
}

export async function excluirServico(id: string): Promise<any> {
  const r = await fetchApi(`/api/servicos/${id}`, { method: 'DELETE' });
  cacheInvalidate('servicos');
  return r;
}

// ========================
// INFRAESTRUTURA API
// ========================

export async function listarInfraestrutura(): Promise<Infraestrutura[]> {
  return withCache('infraestrutura', async () => {
    const data = await fetchApi('/api/infraestrutura');
    return data.map((d: any) => ({ ...d, id: d.id.toString() }));
  }, TTL_LONGO);
}

export async function criarInfraestrutura(data: Omit<Infraestrutura, "id">): Promise<any> {
  const r = await fetchApi('/api/infraestrutura', { method: 'POST', body: JSON.stringify(data) });
  cacheInvalidate('infraestrutura');
  return r;
}

export async function editarInfraestrutura(id: string, data: Partial<Infraestrutura>): Promise<any> {
  const r = await fetchApi(`/api/infraestrutura/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  cacheInvalidate('infraestrutura');
  return r;
}

export async function excluirInfraestrutura(id: string): Promise<any> {
  const r = await fetchApi(`/api/infraestrutura/${id}`, { method: 'DELETE' });
  cacheInvalidate('infraestrutura');
  return r;
}

// ========================
// CONFIGURAÇÕES GERAIS
// ========================

export async function listarConfiguracoes(): Promise<Record<string, string>> {
  return fetchApi('/api/configuracoes');
}

export async function atualizarConfiguracao(chave: string, valor: string): Promise<any> {
  return fetchApi(`/api/configuracoes/${chave}`, {
    method: 'PUT',
    body: JSON.stringify({ valor }),
  });
}

// ========================
// Auth API
// ========================

export async function loginAdmin(usuario: string, senha: string): Promise<{ success: boolean; token?: string; message?: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    return { success: false, message: 'Erro ao conectar ao servidor' };
  }
}

// ========================
// História API
// ========================

export interface Historia {
  id: number;
  titulo: string;
  subtitulo: string;
  texto_historia: string;
  missao: string;
  visao: string;
  valores: string;
  imagem_principal: string;
  provedor_nome: string;
  provedor_cargo: string;
  provedor_citacao: string;
  infra_titulo: string;
  infra_subtitulo: string;
}

export interface HistoriaGaleria {
  id: number;
  imagem_url: string;
  legenda: string;
  ordem: number;
}

export const buscarHistoria = () =>
  withCache('historia', () => fetchApi('/api/historia'), TTL_LONGO);

export const atualizarHistoria = async (data: Partial<Historia>) => {
  const r = await fetchApi('/api/historia', { method: 'PUT', body: JSON.stringify(data) });
  cacheInvalidate('historia');
  return r;
};

export const listarGaleriaHistoria = () =>
  withCache('historia_galeria', () => fetchApi('/api/historia/galeria'), TTL_LONGO);

export const adicionarGaleriaHistoria = async (data: Partial<HistoriaGaleria>) => {
  const r = await fetchApi('/api/historia/galeria', { method: 'POST', body: JSON.stringify(data) });
  cacheInvalidate('historia_galeria');
  return r;
};

export const excluirGaleriaHistoria = async (id: number) => {
  const r = await fetchApi(`/api/historia/galeria/${id}`, { method: 'DELETE' });
  cacheInvalidate('historia_galeria');
  return r;
};
