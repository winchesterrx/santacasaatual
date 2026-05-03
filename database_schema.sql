-- Criação da tabela de Usuários (Admins)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(50) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo um usuário administrador padrão (senha: 123)
-- NOTA: Em produção, essa senha deve ser criptografada (hash). Estamos usando texto puro apenas para teste inicial se o seu backend ainda não estiver configurado com bcrypt.
INSERT INTO usuarios (usuario, senha_hash) VALUES ('admin', '123') ON DUPLICATE KEY UPDATE id=id;

-- Criação da tabela da Ouvidoria (Manifestações)
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
);

-- Criação da tabela de Transparência (Documentos)
CREATE TABLE IF NOT EXISTS transparencia_documentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    data_publicacao DATE NOT NULL,
    arquivo_url LONGTEXT NULL
);

-- Criação da tabela de Notícias
CREATE TABLE IF NOT EXISTS noticias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    corpo TEXT NOT NULL,
    categoria VARCHAR(100) NULL,
    imagem_url LONGTEXT NULL,
    data_publicacao DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Depoimentos (O que você corrigiu)
CREATE TABLE IF NOT EXISTS depoimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    autor VARCHAR(100) NOT NULL,
    papel VARCHAR(100) NOT NULL, -- Ex: Paciente, Médico, Doador
    texto TEXT NOT NULL,
    estrelas INT DEFAULT 5,
    status ENUM('pendente', 'aprovado', 'recusado') DEFAULT 'pendente',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Transparência nas Doações (O feed mostrado na imagem 1)
CREATE TABLE IF NOT EXISTS doacoes_transparencia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao TEXT NOT NULL,
    imagem_url LONGTEXT NOT NULL,
    curtidas INT DEFAULT 0,
    data_publicacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Serviços (Cards de Especialidades)
CREATE TABLE IF NOT EXISTS servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icone VARCHAR(50) NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    destaque BOOLEAN DEFAULT FALSE,
    ordem INT DEFAULT 0
);

-- Criação da tabela de Infraestrutura (Capacidade do Hospital)
CREATE TABLE IF NOT EXISTS infraestrutura (
    id INT AUTO_INCREMENT PRIMARY KEY,
    icone VARCHAR(50) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    quantidade INT DEFAULT 1,
    ordem INT DEFAULT 0
);
