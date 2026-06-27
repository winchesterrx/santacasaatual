// Script para inserir um documento de teste com URL real para validar botões de visualizar/baixar
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'santacasapf.mysql.uhserver.com',
  user: 'paulodefaria',
  password: '@Saopaulop45',
  database: 'santacasapf'
});

console.log('✅ Conectado ao banco!');

// Inserir documento com URL pública do CNS/DATASUS (PDF real)
const [result] = await conn.query(
  `INSERT INTO transparencia_documentos (nome, categoria, subcategoria, descricao, data_publicacao, arquivo_url, is_favorite)
   VALUES (?, ?, ?, ?, ?, ?, ?)`,
  [
    'Certificado de Entidade Beneficente (CEBAS) - Teste',
    '2025',
    'Geral',
    'Documento de teste para validar visualização e download. URL pública do Ministério da Saúde.',
    '2025-06-01',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/pdf-sample.pdf',
    0
  ]
);

console.log('✅ Documento de teste inserido! ID:', result.insertId);

// Verificar o que está no banco
const [docs] = await conn.query('SELECT id, nome, categoria, subcategoria, arquivo_url FROM transparencia_documentos');
console.log('\n📋 Documentos no banco:');
docs.forEach(d => {
  console.log(`  [${d.id}] ${d.nome} | ${d.categoria}/${d.subcategoria} | arquivo: ${d.arquivo_url ? '✅ OK' : '❌ sem arquivo'}`);
});

await conn.end();
console.log('\n✅ Pronto!');
