const authService = require("../services/authService");

const {
  validarCadastro,
  validarLogin,
} = require("../validators/authValidator");

async function cadastrar(req, res) {
  try {
    const erro = validarCadastro(req.body);

    if (erro) {
      return res.status(400).json({ mensagem: erro });
    }

    const usuario = await authService.cadastrar(req.body);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: erro.message || "Erro ao cadastrar usuário.",
    });
  }
}

async function login(req, res) {
  try {
    const erro = validarLogin(req.body);

    if (erro) {
      return res.status(400).json({ mensagem: erro });
    }

    const { email, senha, lembrar } = req.body;

    const resultado = await authService.login(
      email,
      senha,
      lembrar === true
    );

    // Salva o JWT no cookie
    res.cookie("token", resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: lembrar
        ? 7 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: resultado.usuario,
    });
  } catch (erro) {
    console.error(erro);

    const status =
      erro.message === "Email ou senha incorretos." ? 401 : 500;

    return res.status(status).json({
      mensagem: erro.message || "Erro ao fazer login.",
    });
  }
}

async function perfil(req, res) {
  try {
    const usuario = await authService.obterPerfil(req.usuario.id);

    return res.status(200).json({
      usuario,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: erro.message || "Erro ao obter perfil.",
    });
  }
}

async function atualizarPerfil(req, res) {
  try {
    const usuarioAtualizado = await authService.atualizarPerfil(
      req.usuario.id,
      req.body
    );

    return res.status(200).json({
      mensagem: "Perfil atualizado com sucesso!",
      usuario: usuarioAtualizado,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: erro.message || "Erro ao atualizar perfil.",
    });
  }
}

async function me(req, res) {
  try {
    const usuario = await authService.obterPerfil(req.usuario.id);

    return res.status(200).json({
      usuario,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      mensagem: erro.message || "Erro ao obter usuário.",
    });
  }
}

module.exports = {
  cadastrar,
  login,
  perfil,
  atualizarPerfil,
  me,
};