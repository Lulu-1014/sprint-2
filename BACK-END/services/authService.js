const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usuarioRepository = require("../repositories/usuarioRepository");

async function cadastrar(dados) {
  const usuarioExistente = await usuarioRepository.buscarPorEmail(dados.email);

  if (usuarioExistente) {
    throw new Error("Este email já está cadastrado.");
  }

  const senhaCriptografada = await bcrypt.hash(dados.senha, 10);

  const id = await usuarioRepository.criar({
    nome_usuario: dados.nome_usuario,
    email: dados.email,
    senha: senhaCriptografada,
    idade: dados.idade
  });

  return {
    id,
    nome_usuario: dados.nome_usuario,
    email: dados.email,
    idade: dados.idade
  };
}

async function login(email, senha, lembrar) {
  const usuario = await usuarioRepository.buscarPorEmail(email);

  if (!usuario) {
    throw new Error("Email ou senha incorretos.");
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

  if (!senhaCorreta) {
    throw new Error("Email ou senha incorretos.");
  }

  const tempoToken = lembrar ? "7d" : "24h";
  const segredo = process.env.JWT_SECRET || "never_alone_secret_key_2026_super_segura";

  const userId = usuario.id_usuario || usuario.id;

  const token = jwt.sign(
    {
      id: userId,
      nome_usuario: usuario.nome_usuario,
      email: usuario.email
    },
    segredo,
    {
      expiresIn: tempoToken
    }
  );

  return {
    mensagem: "Login realizado com sucesso!",
    token,
    usuario: {
      id: userId,
      nome_usuario: usuario.nome_usuario,
      email: usuario.email,
      idade: usuario.idade
    }
  };
}

async function obterPerfil(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }
  return usuario;
}

async function atualizarPerfil(id, dados) {
  return await usuarioRepository.atualizar(id, dados);
}

async function getMe(userId) {
    const user = await usuarioRepository.getById(userId);
    if (!user) throw new Error("Usuário não encontrado!");
    return user;
  }

module.exports = {
  cadastrar,
  login,
  obterPerfil,
  atualizarPerfil,
  getMe
};

