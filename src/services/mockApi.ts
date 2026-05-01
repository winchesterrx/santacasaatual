// API service layer - Agora conectada ao backend real via Proxy (/api)

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
  const data = await fetchApi('/api/documentos');
  return data.map((d: any) => ({
    id: d.id.toString(),
    nome: d.nome,
    categoria: d.categoria,
    dataPublicacao: new Date(d.data_publicacao).toISOString().split('T')[0],
    arquivo: d.arquivo_url,
    is_favorite: d.is_favorite === 1 || d.is_favorite === true
  }));
}

export async function criarDocumento(data: Omit<DocumentoTransparencia, "id">): Promise<any> {
  return fetchApi('/api/documentos', {
    method: 'POST',
    body: JSON.stringify({
      nome: data.nome,
      categoria: data.categoria,
      data_publicacao: data.dataPublicacao,
      arquivo_url: data.arquivo || null,
      is_favorite: data.is_favorite
    }),
  });
}

export async function editarDocumento(id: string, data: Partial<DocumentoTransparencia>): Promise<any> {
  return fetchApi(`/api/documentos/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nome: data.nome,
      categoria: data.categoria,
      data_publicacao: data.dataPublicacao,
      arquivo_url: data.arquivo,
      is_favorite: data.is_favorite
    }),
  });
}

export async function excluirDocumento(id: string): Promise<any> {
  return fetchApi(`/api/documentos/${id}`, {
    method: 'DELETE',
  });
}

// ========================
// Notícias API
// ========================

// ========================
// Números API
// ========================

export async function listarNumeros(): Promise<NumeroEstatistico[]> {
  const data = await fetchApi('/api/numeros');
  return data.map((d: any) => ({
    id: d.id.toString(),
    icone: d.icone,
    valor: d.valor,
    titulo: d.titulo,
    descricao: d.descricao,
    ordem: d.ordem
  }));
}

export async function criarNumero(data: Omit<NumeroEstatistico, "id">): Promise<any> {
  return fetchApi('/api/numeros', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function editarNumero(id: string, data: Partial<NumeroEstatistico>): Promise<any> {
  return fetchApi(`/api/numeros/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function excluirNumero(id: string): Promise<any> {
  return fetchApi(`/api/numeros/${id}`, {
    method: 'DELETE',
  });
}

export async function listarNoticias(): Promise<Noticia[]> {
  const data = await fetchApi('/api/noticias');
  return data.map((d: any) => ({
    id: d.id.toString(),
    titulo: d.titulo,
    corpo: d.corpo,
    categoria: d.categoria || "Geral",
    imagem: d.imagem_url || "",
    data: new Date(d.data_publicacao).toISOString().split('T')[0]
  }));
}

export async function criarNoticia(data: any): Promise<any> {
  return fetchApi('/api/noticias', {
    method: 'POST',
    body: JSON.stringify({
      titulo: data.titulo,
      corpo: data.corpo,
      categoria: data.categoria,
      imagem_url: data.imagem,
      data_publicacao: data.data
    }),
  });
}

export async function editarNoticia(id: string, data: any): Promise<any> {
  return fetchApi(`/api/noticias/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      titulo: data.titulo,
      corpo: data.corpo,
      categoria: data.categoria,
      imagem_url: data.imagem,
      data_publicacao: data.data
    }),
  });
}

export async function excluirNoticia(id: string): Promise<any> {
  return fetchApi(`/api/noticias/${id}`, {
    method: 'DELETE',
  });
}

// ========================
// Depoimentos API
// ========================

export async function listarDepoimentosAdmin(): Promise<Depoimento[]> {
  const data = await fetchApi('/api/depoimentos');
  return data.map((d: any) => ({
    id: d.id.toString(),
    autor: d.autor,
    papel: d.papel,
    texto: d.texto,
    estrelas: d.estrelas,
    status: d.status,
    data: new Date(d.data_criacao).toISOString().split('T')[0]
  }));
}

export async function listarDepoimentosAprovados(): Promise<Depoimento[]> {
  const todos = await listarDepoimentosAdmin();
  return todos.filter((d: Depoimento) => d.status === 'aprovado');
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
  const data = await fetchApi('/api/doacoes');
  return data.map((d: any) => ({
    id: d.id.toString(),
    descricao: d.descricao,
    imagem_url: d.imagem_url,
    curtidas: d.curtidas,
    data_publicacao: new Date(d.data_publicacao).toISOString().split('T')[0]
  }));
}

export async function criarDoacao(data: Omit<DoacaoTransparencia, "id" | "data_publicacao" | "curtidas">): Promise<any> {
  return fetchApi('/api/doacoes', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function editarDoacao(id: string, data: Partial<DoacaoTransparencia>): Promise<any> {
  return fetchApi(`/api/doacoes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function excluirDoacao(id: string): Promise<any> {
  return fetchApi(`/api/doacoes/${id}`, {
    method: 'DELETE',
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
