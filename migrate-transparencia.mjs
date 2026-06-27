import mysql from 'mysql2/promise';

const conn = await mysql.createConnection({
  host: 'santacasapf.mysql.uhserver.com',
  user: 'paulodefaria',
  password: '@Saopaulop45',
  database: 'santacasapf'
});

console.log('✅ Conectado ao banco de dados!');

// Verificar colunas existentes
const [cols] = await conn.query('SHOW COLUMNS FROM transparencia_documentos');
const existingCols = cols.map(c => c.Field);
console.log('Colunas atuais:', existingCols.join(', '));

// Adicionar subcategoria se não existir
if (!existingCols.includes('subcategoria')) {
  await conn.query('ALTER TABLE transparencia_documentos ADD COLUMN subcategoria VARCHAR(100) NULL AFTER categoria');
  console.log('✅ Coluna subcategoria adicionada!');
} else {
  console.log('ℹ️  Coluna subcategoria já existe, pulando...');
}

// Adicionar descricao se não existir
if (!existingCols.includes('descricao')) {
  await conn.query('ALTER TABLE transparencia_documentos ADD COLUMN descricao TEXT NULL AFTER subcategoria');
  console.log('✅ Coluna descricao adicionada!');
} else {
  console.log('ℹ️  Coluna descricao já existe, pulando...');
}

// Adicionar is_favorite se não existir
if (!existingCols.includes('is_favorite')) {
  await conn.query('ALTER TABLE transparencia_documentos ADD COLUMN is_favorite TINYINT(1) DEFAULT 0 AFTER arquivo_url');
  console.log('✅ Coluna is_favorite adicionada!');
} else {
  console.log('ℹ️  Coluna is_favorite já existe, pulando...');
}

// Confirmar estrutura final
const [finalCols] = await conn.query('SHOW COLUMNS FROM transparencia_documentos');
console.log('\n📋 Estrutura final da tabela transparencia_documentos:');
finalCols.forEach(c => console.log(`   - ${c.Field.padEnd(20)} ${c.Type}`));

await conn.end();
console.log('\n✅ Migração concluída com sucesso!');
