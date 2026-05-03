import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rota de teste para verificar se o servidor está online (sem DB)
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', message: 'Servidor da Santa Casa operando corretamente' });
});

// Rota para testar a conexão real com o Banco de Dados
app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 as test');
    res.json({ success: true, message: 'Conexão com o banco estabelecida com sucesso!', data: rows });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Falha na conexão com o banco', 
      error: error.message,
      code: error.code,
      host: process.env.DB_HOST,
      user: process.env.DB_USER
    });
  }
});

// ==========================================
// AUTH (MOCK SIMPLES -> EM BREVE COM BCRYPT E JWT)
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const [rows] = await db.query('SELECT * FROM usuarios WHERE usuario = ? AND senha_hash = ?', [usuario, senha]);
    if (rows.length > 0) {
      res.json({ success: true, token: 'fake-jwt-token-santa-casa', user: rows[0] });
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// OUVIDORIA
// ==========================================
app.get('/api/ouvidoria', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ouvidoria_manifestacoes ORDER BY data_criacao DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ouvidoria', async (req, res) => {
  try {
    const { protocolo, cpf, tipo, assunto, mensagem } = req.body;
    const [result] = await db.query(
      'INSERT INTO ouvidoria_manifestacoes (protocolo, cpf, tipo, assunto, mensagem) VALUES (?, ?, ?, ?, ?)',
      [protocolo, cpf, tipo, assunto, mensagem]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/ouvidoria/:id/responder', async (req, res) => {
  try {
    const { id } = req.params;
    const { resposta } = req.body;
    await db.query(
      'UPDATE ouvidoria_manifestacoes SET resposta = ?, status = "respondido", data_resposta = NOW() WHERE id = ?',
      [resposta, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// TRANSPARÊNCIA (DOCUMENTOS)
// ==========================================
app.get('/api/documentos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM transparencia_documentos ORDER BY data_publicacao DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/documentos', async (req, res) => {
  try {
    const { nome, categoria, data_publicacao, arquivo_url, is_favorite } = req.body;
    const [result] = await db.query(
      'INSERT INTO transparencia_documentos (nome, categoria, data_publicacao, arquivo_url, is_favorite) VALUES (?, ?, ?, ?, ?)',
      [nome, categoria, data_publicacao, arquivo_url || null, is_favorite ? 1 : 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/documentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, categoria, data_publicacao, arquivo_url, is_favorite } = req.body;
    await db.query(
      'UPDATE transparencia_documentos SET nome = ?, categoria = ?, data_publicacao = ?, arquivo_url = ?, is_favorite = ? WHERE id = ?',
      [nome, categoria, data_publicacao, arquivo_url || null, is_favorite ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/documentos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM transparencia_documentos WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// NOSSOS NÚMEROS
// ==========================================
app.get('/api/numeros', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM nossos_numeros ORDER BY ordem ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/numeros', async (req, res) => {
  try {
    const { icone, valor, titulo, descricao, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO nossos_numeros (icone, valor, titulo, descricao, ordem) VALUES (?, ?, ?, ?, ?)',
      [icone, valor, titulo, descricao, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/numeros/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { icone, valor, titulo, descricao, ordem } = req.body;
    await db.query(
      'UPDATE nossos_numeros SET icone = ?, valor = ?, titulo = ?, descricao = ?, ordem = ? WHERE id = ?',
      [icone, valor, titulo, descricao, ordem || 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/numeros/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM nossos_numeros WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// NOTÍCIAS
// ==========================================
app.get('/api/noticias', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM noticias ORDER BY data_publicacao DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/noticias', async (req, res) => {
  try {
    const { titulo, corpo, categoria, imagem_url, data_publicacao } = req.body;
    const [result] = await db.query(
      'INSERT INTO noticias (titulo, corpo, categoria, imagem_url, data_publicacao) VALUES (?, ?, ?, ?, ?)',
      [titulo, corpo, categoria || null, imagem_url || null, data_publicacao]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/noticias/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, corpo, categoria, imagem_url, data_publicacao } = req.body;
    await db.query(
      'UPDATE noticias SET titulo = ?, corpo = ?, categoria = ?, imagem_url = ?, data_publicacao = ? WHERE id = ?',
      [titulo, corpo, categoria || null, imagem_url || null, data_publicacao, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/noticias/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM noticias WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DEPOIMENTOS
// ==========================================
app.get('/api/depoimentos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM depoimentos ORDER BY data_criacao DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/depoimentos', async (req, res) => {
  try {
    const { autor, papel, texto, estrelas } = req.body;
    const [result] = await db.query(
      'INSERT INTO depoimentos (autor, papel, texto, estrelas, status) VALUES (?, ?, ?, ?, "pendente")',
      [autor, papel, texto, estrelas || 5]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/depoimentos/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE depoimentos SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/depoimentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { autor, papel, texto, estrelas } = req.body;
    await db.query(
      'UPDATE depoimentos SET autor = ?, papel = ?, texto = ?, estrelas = ? WHERE id = ?',
      [autor, papel, texto, estrelas, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/depoimentos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM depoimentos WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// DOAÇÕES (FEED TRANSPARÊNCIA)
// ==========================================
app.get('/api/doacoes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doacoes_transparencia ORDER BY data_publicacao DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/doacoes', async (req, res) => {
  try {
    const { descricao, imagem_url } = req.body;
    const [result] = await db.query(
      'INSERT INTO doacoes_transparencia (descricao, imagem_url) VALUES (?, ?)',
      [descricao, imagem_url]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/doacoes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, imagem_url } = req.body;
    await db.query(
      'UPDATE doacoes_transparencia SET descricao = ?, imagem_url = ? WHERE id = ?',
      [descricao, imagem_url, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/doacoes/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM doacoes_transparencia WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SERVIÇOS (ESPECIALIDADES)
// ==========================================
app.get('/api/servicos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM servicos ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/servicos', async (req, res) => {
  try {
    const { icone, titulo, descricao, destaque, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO servicos (icone, titulo, descricao, destaque, ordem) VALUES (?, ?, ?, ?, ?)',
      [icone, titulo, descricao, destaque ? 1 : 0, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/servicos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { icone, titulo, descricao, destaque, ordem } = req.body;
    await db.query(
      'UPDATE servicos SET icone = ?, titulo = ?, descricao = ?, destaque = ?, ordem = ? WHERE id = ?',
      [icone, titulo, descricao, destaque ? 1 : 0, ordem || 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/servicos/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM servicos WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// INFRAESTRUTURA
// ==========================================
app.get('/api/infraestrutura', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM infraestrutura ORDER BY ordem ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/infraestrutura', async (req, res) => {
  try {
    const { icone, nome, quantidade, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO infraestrutura (icone, nome, quantidade, ordem) VALUES (?, ?, ?, ?)',
      [icone, nome, quantidade || 1, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/infraestrutura/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { icone, nome, quantidade, ordem } = req.body;
    await db.query(
      'UPDATE infraestrutura SET icone = ?, nome = ?, quantidade = ?, ordem = ? WHERE id = ?',
      [icone, nome, quantidade || 1, ordem || 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/infraestrutura/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM infraestrutura WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONTAS DE DOAÇÃO
// ==========================================
app.get('/api/contas-doacao', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contas_doacao ORDER BY ordem ASC, criado_em DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/contas-doacao', async (req, res) => {
  try {
    const { tipo, banco, agencia, conta, chave_pix, descricao, favorecido, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO contas_doacao (tipo, banco, agencia, conta, chave_pix, descricao, favorecido, ordem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [tipo, banco || null, agencia || null, conta || null, chave_pix || null, descricao || null, favorecido, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/contas-doacao/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, banco, agencia, conta, chave_pix, descricao, favorecido, ordem } = req.body;
    await db.query(
      'UPDATE contas_doacao SET tipo = ?, banco = ?, agencia = ?, conta = ?, chave_pix = ?, descricao = ?, favorecido = ?, ordem = ? WHERE id = ?',
      [tipo, banco || null, agencia || null, conta || null, chave_pix || null, descricao || null, favorecido, ordem || 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/contas-doacao/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM contas_doacao WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// CONFIGURAÇÕES GERAIS
// ==========================================
app.get('/api/configuracoes', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT chave, valor FROM configuracoes');
    const configs = rows.reduce((acc, row) => {
      acc[row.chave] = row.valor;
      return acc;
    }, {});
    res.json(configs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/configuracoes/:chave', async (req, res) => {
  try {
    const { chave } = req.params;
    const { valor } = req.body;
    await db.query(
      'INSERT INTO configuracoes (chave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = ?',
      [chave, valor, valor]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// PÁGINA HISTÓRIA
// ==========================================
app.get('/api/historia', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM pagina_historia WHERE id = 1');
    res.json(rows[0] || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/historia', async (req, res) => {
  try {
    const { 
      titulo, subtitulo, texto_historia, missao, visao, valores, imagem_principal,
      provedor_nome, provedor_cargo, provedor_citacao, infra_titulo, infra_subtitulo
    } = req.body;
    await db.query(
      `INSERT INTO pagina_historia (
        id, titulo, subtitulo, texto_historia, missao, visao, valores, imagem_principal,
        provedor_nome, provedor_cargo, provedor_citacao, infra_titulo, infra_subtitulo
       )
       VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
        titulo = VALUES(titulo), 
        subtitulo = VALUES(subtitulo), 
        texto_historia = VALUES(texto_historia),
        missao = VALUES(missao),
        visao = VALUES(visao),
        valores = VALUES(valores),
        imagem_principal = VALUES(imagem_principal),
        provedor_nome = VALUES(provedor_nome),
        provedor_cargo = VALUES(provedor_cargo),
        provedor_citacao = VALUES(provedor_citacao),
        infra_titulo = VALUES(infra_titulo),
        infra_subtitulo = VALUES(infra_subtitulo)`,
      [
        titulo, subtitulo, texto_historia, missao, visao, valores, imagem_principal,
        provedor_nome, provedor_cargo, provedor_citacao, infra_titulo, infra_subtitulo
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/historia/galeria', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM historia_galeria ORDER BY ordem ASC, id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/historia/galeria', async (req, res) => {
  try {
    const { imagem_url, legenda, ordem } = req.body;
    const [result] = await db.query(
      'INSERT INTO historia_galeria (imagem_url, legenda, ordem) VALUES (?, ?, ?)',
      [imagem_url, legenda || null, ordem || 0]
    );
    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/historia/galeria/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM historia_galeria WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exporta o app usando ES Modules
export default app;

// Execução local
import { fileURLToPath } from 'url';
import { dirname } from 'path';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Servidor da API rodando localmente na porta ${PORT}`);
  });
}
