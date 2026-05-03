import db from './api/db.js';

const services = [
  { icone: "Ambulance", titulo: "Urgência e Emergência", descricao: "Pronto-Socorro 24 horas com equipe médica de plantão, sala de estabilização e atendimento imediato.", destaque: 1, ordem: 1 },
  { icone: "Microscope", titulo: "Laboratório Clínico", descricao: "Análises clínicas completas com equipamentos modernos e resultados ágeis para diagnósticos precisos.", destaque: 0, ordem: 2 },
  { icone: "Scan", titulo: "Diagnóstico por Imagem", descricao: "Raio-X digital, ultrassonografia e exames de imagem de alta resolução.", destaque: 0, ordem: 3 },
  { icone: "Activity", titulo: "Métodos Gráficos Dinâmicos", descricao: "Eletrocardiograma (ECG), monitoramento cardíaco e exames gráficos especializados.", destaque: 0, ordem: 4 },
  { icone: "Atom", titulo: "Medicina Nuclear", descricao: "Cintilografia, PET-CT e exames nucleares para diagnósticos avançados.", destaque: 0, ordem: 5 },
  { icone: "Baby", titulo: "Pré-natal, Parto e Nascimento", descricao: "Acompanhamento gestacional, parto humanizado e alojamento conjunto para mãe e bebê.", destaque: 0, ordem: 6 },
  { icone: "HeartPulse", titulo: "Transplante", descricao: "Serviço credenciado de captação e transplante de órgãos e tecidos.", destaque: 0, ordem: 7 },
  { icone: "Stethoscope", titulo: "Clínica Médica", descricao: "Consultas ambulatoriais, internação clínica e acompanhamento multidisciplinar.", destaque: 0, ordem: 8 },
];

const infra = [
  { nome: "Atendimento Indiferenciado", quantidade: 1, icone: "Users", ordem: 1 },
  { nome: "Sala de Curativos", quantidade: 1, icone: "Bandage", ordem: 2 },
  { nome: "Clínicas Especializadas", quantidade: 1, icone: "Building2", ordem: 3 },
  { nome: "Consultórios (Outros)", quantidade: 1, icone: "Stethoscope", ordem: 4 },
  { nome: "Repouso e Observação", quantidade: 2, icone: "BedSingle", ordem: 5 },
  { nome: "Centros Cirúrgicos", quantidade: 2, icone: "Scissors", ordem: 6 },
  { nome: "Recuperação Pós-Anestésica", quantidade: 1, icone: "Activity", ordem: 7 },
  { nome: "Centro de Parto", quantidade: 1, icone: "Baby", ordem: 8 },
  { nome: "Estabilização / Risco", quantidade: 1, icone: "HeartPulse", ordem: 9 },
];

async function populate() {
  try {
    console.log("🚀 Iniciando povoamento do banco de dados...");

    // Criar tabelas se não existirem
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
          id INT AUTO_INCREMENT PRIMARY KEY,
          usuario VARCHAR(50) UNIQUE NOT NULL,
          senha_hash VARCHAR(255) NOT NULL,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS ouvidoria_manifestacoes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          protocolo VARCHAR(50) UNIQUE NOT NULL,
          cpf VARCHAR(14) NOT NULL,
          tipo ENUM('elogio', 'sugestao', 'reclamacao', 'denuncia') NOT NULL,
          assunto VARCHAR(255) NOT NULL,
          mensagem TEXT NOT NULL,
          status ENUM('pendente', 'respondido') DEFAULT 'pendente',
          resposta TEXT NULL,
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          data_resposta TIMESTAMP NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS transparencia_documentos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          categoria VARCHAR(100) NOT NULL,
          data_publicacao DATE NOT NULL,
          arquivo_url LONGTEXT NULL,
          is_favorite BOOLEAN DEFAULT FALSE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS noticias (
          id INT AUTO_INCREMENT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          corpo TEXT NOT NULL,
          categoria VARCHAR(100) NULL,
          imagem_url LONGTEXT NULL,
          data_publicacao DATE NOT NULL,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS depoimentos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          autor VARCHAR(100) NOT NULL,
          papel VARCHAR(100) NOT NULL,
          texto TEXT NOT NULL,
          estrelas INT DEFAULT 5,
          status ENUM('pendente', 'aprovado', 'recusado') DEFAULT 'pendente',
          data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS doacoes_transparencia (
          id INT AUTO_INCREMENT PRIMARY KEY,
          descricao TEXT NOT NULL,
          imagem_url LONGTEXT NOT NULL,
          curtidas INT DEFAULT 0,
          data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS nossos_numeros (
          id INT AUTO_INCREMENT PRIMARY KEY,
          icone VARCHAR(50) NOT NULL,
          valor VARCHAR(50) NOT NULL,
          titulo VARCHAR(100) NOT NULL,
          descricao TEXT NULL,
          ordem INT DEFAULT 0
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS contas_doacao (
          id INT AUTO_INCREMENT PRIMARY KEY,
          tipo VARCHAR(20) NOT NULL,
          banco VARCHAR(100) NULL,
          agencia VARCHAR(20) NULL,
          conta VARCHAR(50) NULL,
          chave_pix VARCHAR(255) NULL,
          descricao TEXT NULL,
          favorecido VARCHAR(255) NOT NULL,
          ordem INT DEFAULT 0,
          criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS configuracoes (
          chave VARCHAR(100) PRIMARY KEY,
          valor TEXT NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS servicos (
          id INT AUTO_INCREMENT PRIMARY KEY,
          icone VARCHAR(50) NOT NULL,
          titulo VARCHAR(100) NOT NULL,
          descricao TEXT NOT NULL,
          destaque BOOLEAN DEFAULT FALSE,
          ordem INT DEFAULT 0
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS infraestrutura (
          id INT AUTO_INCREMENT PRIMARY KEY,
          icone VARCHAR(50) NOT NULL,
          nome VARCHAR(100) NOT NULL,
          quantidade INT DEFAULT 1,
          ordem INT DEFAULT 0
      )
    `);
    console.log("✅ Todas as tabelas verificadas/criadas.");

    // Limpar tabelas existentes para evitar duplicatas
    await db.query("DELETE FROM servicos");
    await db.query("DELETE FROM infraestrutura");
    console.log("✅ Tabelas limpas.");

    // Inserir Serviços
    for (const s of services) {
      await db.query(
        "INSERT INTO servicos (icone, titulo, descricao, destaque, ordem) VALUES (?, ?, ?, ?, ?)",
        [s.icone, s.titulo, s.descricao, s.destaque, s.ordem]
      );
    }
    console.log(`✅ ${services.length} serviços inseridos.`);

    // Inserir Infraestrutura
    for (const i of infra) {
      await db.query(
        "INSERT INTO infraestrutura (nome, quantidade, icone, ordem) VALUES (?, ?, ?, ?)",
        [i.nome, i.quantidade, i.icone, i.ordem]
      );
    }
    console.log(`✅ ${infra.length} itens de infraestrutura inseridos.`);

    console.log("⭐ Banco de dados povoado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao popular banco:", error);
    process.exit(1);
  }
}

populate();
