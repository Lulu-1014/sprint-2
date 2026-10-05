const { conexao } = require("../config/database");

async function buscarPorEmail(email) {
  const [resultado] = await conexao.execute(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );

  return resultado[0];
}

async function buscarPorId(id) {
  const [resultado] = await conexao.execute(
    "SELECT id_usuario as id, nome_usuario, email, idade, data_cadastro FROM usuarios WHERE id_usuario = ?",
    [id]
  );

  return resultado[0];
}

async function criar(usuario) {
  const [resultado] = await conexao.execute(
    `INSERT INTO usuarios
    (nome_usuario, email, senha, idade)
    VALUES (?, ?, ?, ?)`,
    [
      usuario.nome_usuario,
      usuario.email,
      usuario.senha,
      usuario.idade
    ]
  );

  return resultado.insertId;
}

async function atualizar(id, dados) {
  await conexao.execute(
    `UPDATE usuarios SET nome_usuario = ? WHERE id_usuario = ?`,
    [dados.nome_usuario, id]
  );

  return buscarPorId(id);
}

async function getById(id) {
    const [rows] = await database.query("SELECT id, nome, email, role, status FROM usuarios WHERE id = ?", [id])
    return rows[0];
  }

module.exports = {
  buscarPorEmail,
  buscarPorId,
  criar,
  atualizar,
  getById
};
