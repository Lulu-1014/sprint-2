id_usuario INT PRIMARY KEY AUTO_INCREMENT, 
    nome VARCHAR(100) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    senha VARCHAR(255) NOT NULL, 
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP, 
    idade number NOT NULL

); 


CREATE TABLE publicacoes ( 

    id_publicacao INT PRIMARY KEY AUTO_INCREMENT, 
    id_usuario INT NOT NULL, 
    conteudo TEXT NOT NULL, 
    data_publicacao DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) 
); 

  

CREATE TABLE comentarios ( 

    id_comentario INT PRIMARY KEY AUTO_INCREMENT, 
    id_publicacao INT NOT NULL, 
    id_usuario INT NOT NULL, 
    comentario TEXT NOT NULL, 
    ADD COLUMN anonimo BOOLEAN NOT NULL DEFAULT TRUE,
    data_comentario DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (id_publicacao) REFERENCES publicacoes(id_publicacao), 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) 
); 

  

CREATE TABLE curtidas ( 
    id_curtida INT PRIMARY KEY AUTO_INCREMENT, 
    id_usuario INT NOT NULL, 
    id_publicacao INT NOT NULL, 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario), 
    FOREIGN KEY (id_publicacao) REFERENCES publicacoes(id_publicacao) 
); 

  

CREATE TABLE denuncias ( 
    id_denuncia INT PRIMARY KEY AUTO_INCREMENT, 
    id_usuario INT NOT NULL, 
    id_publicacao INT, 
    motivo TEXT NOT NULL, 
    status VARCHAR(20) DEFAULT 'pendente', 
    data_denuncia DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario), 
    FOREIGN KEY (id_publicacao) REFERENCES publicacoes(id_publicacao) 

); 

  

CREATE TABLE mensagens ( 
    id_mensagem INT PRIMARY KEY AUTO_INCREMENT, 
    remetente INT NOT NULL, 
    destinatario INT NOT NULL, 
    mensagem TEXT NOT NULL, 
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (remetente) REFERENCES usuarios(id_usuario), 
    FOREIGN KEY (destinatario) REFERENCES usuarios(id_usuario) 

); 

CREATE TABLE instituicoes_apoio ( 
    id_instituicao INT PRIMARY KEY AUTO_INCREMENT, 
    nome VARCHAR(100) NOT NULL, 
    descricao TEXT, 
    telefone VARCHAR(20), 
    email VARCHAR(100), 
    site VARCHAR(255) 

);w