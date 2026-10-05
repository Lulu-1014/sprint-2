class Usuario {
  constructor({ id, nome_usuario, email, senha, idade, criado_em }) {
    this.id = id;
    this.nome_usuario = nome_usuario;
    this.email = email;
    this.senha = senha;
    this.idade = idade;
    this.criado_em = criado_em;
  }
}

module.exports = Usuario;
