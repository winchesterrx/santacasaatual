import db from './api/db.js';

async function migrate() {
  try {
    console.log('Iniciando migração da tabela de configurações...');

    // 1. Criar a tabela configuracoes
    console.log('Criando tabela configuracoes...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS configuracoes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          chave VARCHAR(50) UNIQUE NOT NULL,
          valor LONGTEXT NOT NULL
      )
    `);
    console.log('Tabela configuracoes criada/verificada com sucesso.');

    // Inserir dados padrão caso não existam
    const defaults = [
      { chave: 'popup_ativo', valor: 'true' },
      { chave: 'popup_imagem', valor: '/campanha.png' }
    ];

    for (const item of defaults) {
      const [rows] = await db.query('SELECT id FROM configuracoes WHERE chave = ?', [item.chave]);
      if (rows.length === 0) {
        console.log(`Inserindo configuração padrão: ${item.chave}`);
        await db.query('INSERT INTO configuracoes (chave, valor) VALUES (?, ?)', [item.chave, item.valor]);
      }
    }

    console.log('Migração concluída com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro na migração:', error);
    process.exit(1);
  }
}

migrate();
