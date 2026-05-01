import db from './api/db.js';

async function migrate() {
  console.log('Iniciando conversão do banco de dados para utf8mb4 (Suporte a Emojis)...');

  try {
    // Definindo o banco de dados e as tabelas para usar utf8mb4
    const dbName = process.env.DB_NAME || 'santacasa_db';
    await db.query(`ALTER DATABASE \`${dbName}\` CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci`);
    console.log('Database configurado para utf8mb4.');

    const tabelas = [
      'doacoes_transparencia',
      'noticias',
      'depoimentos',
      'ouvidoria_manifestacoes',
      'nossos_numeros',
      'transparencia_documentos',
      'contas_doacao'
    ];

    for (const tabela of tabelas) {
      try {
        await db.query(`ALTER TABLE \`${tabela}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        console.log(`Tabela ${tabela} convertida.`);
      } catch (e) {
        console.log(`Aviso: Tabela ${tabela} pode não existir ou deu erro na conversão. (${e.message})`);
      }
    }

    console.log('Migração de Emojis finalizada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

migrate();
