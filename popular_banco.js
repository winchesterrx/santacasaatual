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

    await db.query(`
      CREATE TABLE IF NOT EXISTS pagina_historia (
          id INT PRIMARY KEY,
          titulo VARCHAR(255) NOT NULL,
          subtitulo TEXT NULL,
          texto_historia LONGTEXT NOT NULL,
          missao TEXT NULL,
          visao TEXT NULL,
          valores TEXT NULL,
          imagem_principal LONGTEXT NULL,
          atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS historia_galeria (
          id INT AUTO_INCREMENT PRIMARY KEY,
          imagem_url LONGTEXT NOT NULL,
          legenda VARCHAR(255) NULL,
          ordem INT DEFAULT 0
      )
    `);

    console.log("✅ Todas as tabelas verificadas/criadas.");

    // Limpar tabelas existentes para evitar duplicatas
    await db.query("DELETE FROM servicos");
    await db.query("DELETE FROM infraestrutura");
    // Não vamos limpar a pagina_historia se ela já tiver conteúdo customizado, 
    // mas para o script de popular vamos garantir o conteúdo inicial.
    console.log("✅ Tabelas limpas.");

    // Inserir Conteúdo Inicial da História
    const textoHistoria = `
<h3 class="text-2xl font-bold text-navy mb-4">1. Fundação e Contexto Institucional</h3>
<p class="mb-6">A entidade foi oficialmente constituída em 16 de março de 1960. Sua fundação ocorreu em um período de amadurecimento administrativo da cidade, que buscava autonomia e infraestrutura própria para atender às demandas de saúde decorrentes do crescimento populacional e da atividade agrícola da época. Juridicamente, a Santa Casa é uma associação privada sem fins lucrativos, reconhecida como entidade filantrópica.</p>

<h3 class="text-2xl font-bold text-navy mb-4">2. Liderança e Administração</h3>
<p class="mb-4">A gestão da Irmandade é conduzida por uma Mesa Administrativa, órgão responsável pelas decisões estratégicas e pela manutenção da sustentabilidade institucional. Atualmente, a responsabilidade pela condução da entidade recai sobre:</p>
<p class="mb-6"><strong>Provedor:</strong> Manoel Cosmo Santana (conhecido como Cosminho). O cargo de provedor, seguindo a tradição secular das Misericórdias, é uma função de liderança que coordena as relações entre o hospital, o poder público e a comunidade local, zelando pelo cumprimento da missão assistencial da casa.</p>

<h3 class="text-2xl font-bold text-navy mb-4">3. Infraestrutura e Serviços</h3>
<p class="mb-4">Sediada na Rua Zenha Ribeiro, 958, no centro de Paulo de Faria, a unidade funciona como um Hospital Geral. A estrutura é fundamental para o suporte de média e baixa complexidade na região, oferecendo:</p>
<ul class="list-disc pl-6 mb-6 space-y-2">
  <li>Atendimento de Urgência e Emergência 24 horas;</li>
  <li>Internações clínicas e cirúrgicas;</li>
  <li>Serviços de diagnóstico e terapia vinculados ao Sistema Único de Saúde (SUS).</li>
</ul>

<h3 class="text-2xl font-bold text-navy mb-4">4. Sustentabilidade e Relevância Social</h3>
<p class="mb-6">A história da Santa Casa de Paulo de Faria é mantida por meio de um sistema misto de financiamento, que inclui repasses governamentais, convênios municipais e, historicamente, o apoio da sociedade civil. Eventos beneficentes e doações de produtores locais são práticas consolidadas que permitem a renovação de equipamentos e a manutenção das instalações, reforçando o hospital como um patrimônio coletivo da cidade.</p>
    `.trim();

    await db.query(`
      INSERT INTO pagina_historia (id, titulo, subtitulo, texto_historia, missao, visao, valores, imagem_principal)
      VALUES (1, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        titulo = VALUES(titulo), 
        subtitulo = VALUES(subtitulo), 
        texto_historia = VALUES(texto_historia)
    `, [
      "Registro Histórico: Irmandade da Santa Casa de Misericórdia de Paulo de Faria",
      "A trajetória da Irmandade da Santa Casa de Misericórdia de Paulo de Faria é um pilar central na cronologia do município de Paulo de Faria, estado de São Paulo.",
      textoHistoria,
      "Prestar assistência à saúde de forma humanizada, resolutiva e sustentável, promovendo o bem-estar da comunidade com excelência e ética.",
      "Ser reconhecida como a melhor instituição de saúde regional, destacando-se pela inovação, atendimento humanizado e segurança do paciente.",
      "Humanização, Ética e Transparência, Excelência Técnica, Responsabilidade Social",
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop"
    ]);

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
