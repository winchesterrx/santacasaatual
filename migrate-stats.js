import db from './api/db.js';

async function migrate() {
  try {
    console.log('Iniciando migração do banco de dados...');

    // 1. Criar a tabela nossos_numeros
    console.log('Criando tabela nossos_numeros...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS nossos_numeros (
          id INT AUTO_INCREMENT PRIMARY KEY,
          icone VARCHAR(50) NOT NULL,
          valor VARCHAR(50) NOT NULL,
          titulo VARCHAR(100) NOT NULL,
          descricao VARCHAR(255) NOT NULL,
          ordem INT DEFAULT 0
      )
    `);
    console.log('Tabela nossos_numeros criada/verificada com sucesso.');

    // Inserir dados padrão caso esteja vazia
    const [rows] = await db.query('SELECT COUNT(*) as count FROM nossos_numeros');
    if (rows[0].count === 0) {
      console.log('Inserindo dados padrão na tabela nossos_numeros...');
      await db.query(`
        INSERT INTO nossos_numeros (icone, valor, titulo, descricao, ordem) VALUES
        ('Users', '3.000+', 'Atendimentos / Mês', 'Consultas, exames e procedimentos', 1),
        ('HeartPulse', '1.200+', 'Cirurgias / Ano', 'Procedimentos cirúrgicos realizados', 2),
        ('Stethoscope', '8', 'Especialidades', 'Credenciadas no CNES', 3),
        ('BedDouble', '12', 'Salas e Ambientes', 'Estrutura física hospitalar', 4),
        ('Award', '80+', 'Anos de História', 'Servindo a comunidade desde 1940', 5),
        ('TrendingUp', '100%', 'SUS', 'Atendimento filantrópico', 6)
      `);
      console.log('Dados padrão inseridos.');
    }

    // 2. Adicionar is_favorite na tabela transparencia_documentos
    console.log('Verificando/adicionando coluna is_favorite na tabela transparencia_documentos...');
    try {
      await db.query(`ALTER TABLE transparencia_documentos ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE`);
      console.log('Coluna is_favorite adicionada com sucesso.');
    } catch (alterError) {
      // Ignorar se a coluna já existir (código de erro 1060 em MySQL)
      if (alterError.code === 'ER_DUP_FIELDNAME') {
        console.log('A coluna is_favorite já existe. Nenhuma ação necessária.');
      } else {
        throw alterError; // Lançar outros erros
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
