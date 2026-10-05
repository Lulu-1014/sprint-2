const mysql = require("mysql2/promise");

async function inicializarBanco() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || ""
    });

    const dbName = process.env.DB_NAME || "never_alone";
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INT PRIMARY KEY AUTO_INCREMENT,
        nome_usuario VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        senha VARCHAR(255) NOT NULL,
        idade INT NOT NULL,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS publicacoes (
        id_publicacao INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        conteudo TEXT NOT NULL,
        categoria VARCHAR(50) DEFAULT 'Outros',
        anonimo BOOLEAN DEFAULT TRUE,
        data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS comentarios (
        id_comentario INT PRIMARY KEY AUTO_INCREMENT,
        id_publicacao INT NOT NULL,
        id_usuario INT NOT NULL,
        comentario TEXT NOT NULL,
        data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_publicacao) REFERENCES publicacoes(id_publicacao) ON DELETE CASCADE,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS curtidas (
        id_curtida INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        id_publicacao INT NOT NULL,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_publicacao) REFERENCES publicacoes(id_publicacao) ON DELETE CASCADE,
        UNIQUE KEY unique_curtida (id_usuario, id_publicacao)
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS denuncias (
        id_denuncia INT PRIMARY KEY AUTO_INCREMENT,
        id_usuario INT NOT NULL,
        id_publicacao INT,
        motivo TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pendente',
        data_denuncia DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (id_publicacao) REFERENCES publicacoes(id_publicacao) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
        remetente INT NOT NULL,
        destinatario INT NOT NULL,
        mensagem TEXT NOT NULL,
        data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (remetente) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
        FOREIGN KEY (destinatario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS instituicoes_apoio (
        id_instituicao INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT,
        telefone VARCHAR(20),
        email VARCHAR(100),
        site VARCHAR(255)
      );
    `);

    await connection.end();
    console.log("✅ Banco de dados e tabelas inicializados com sucesso!");
  } catch (erro) {
    console.error("⚠️ Aviso na inicialização do MySQL:", erro.message);
    console.error("Certifique-se de que o servidor MySQL (XAMPP/Docker/MySQL Service) está em execução.");
  }
}

module.exports = { inicializarBanco };
