import db from './api/db.js';

async function migrate() {
  console.log('Iniciando migração da tabela contas_doacao...');

  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS contas_doacao (
          id INT AUTO_INCREMENT PRIMARY KEY,
          tipo ENUM('pix', 'conta') NOT NULL,
          banco VARCHAR(100) NULL,
          agencia VARCHAR(50) NULL,
          conta VARCHAR(50) NULL,
          chave_pix VARCHAR(100) NULL,
          descricao VARCHAR(100) NULL,
          favorecido VARCHAR(255) NOT NULL,
          ordem INT DEFAULT 0,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Tabela contas_doacao verificada/criada com sucesso.');

    // Verificar se já tem registros
    const [rows] = await db.query('SELECT COUNT(*) as count FROM contas_doacao');
    
    if (rows[0].count === 0) {
      console.log('Nenhuma conta encontrada. Inserindo contas padrão...');
      
      // Inserir Banco do Brasil
      await db.query(`
        INSERT INTO contas_doacao (tipo, banco, agencia, conta, descricao, favorecido, ordem)
        VALUES ('conta', 'Banco do Brasil', '0507-X', '16580-8', 'Depósito Bancário', 'Irmandade Santa Casa de Misericordia', 1)
      `);
      
      // Inserir PIX
      await db.query(`
        INSERT INTO contas_doacao (tipo, chave_pix, descricao, favorecido, ordem)
        VALUES ('pix', '53.782.355/0001-46', 'Chave (CNPJ)', 'Irmandade Santa Casa de Misericordia', 2)
      `);
      console.log('Contas padrão inseridas com sucesso.');
    } else {
      console.log('Contas já existentes no banco. Pulando inserção padrão.');
    }

    console.log('Migração finalizada com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro durante a migração:', error);
    process.exit(1);
  }
}

migrate();
