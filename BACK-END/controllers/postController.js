
const postService = require("../services/postService");

async function listar(req, res) {
  try {
    const id_usuario = req.usuario ? req.usuario.id : 0;
    const publicacoes = await postService.listarPublicacoes(id_usuario);
    return res.status(200).json(publicacoes);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: "Erro ao listar publicações." });
  }
}

async function criar(req, res) {
  try {
    const id_usuario = req.usuario.id;
    const publicacao = await postService.criarPublicacao(id_usuario, req.body);
    return res.status(201).json({
      mensagem: "Publicação criada com sucesso!",
      publicacao
    });
  } catch (erro) {
    console.error(erro);
    return res.status(400).json({ mensagem: erro.message || "Erro ao criar publicação." });
  }
}

async function curtir(req, res) {
  try {
    const id_usuario = req.usuario.id;
    const id_publicacao = req.params.id;
    const resultado = await postService.alternarCurtida(id_usuario, id_publicacao);
    return res.status(200).json(resultado);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ mensagem: "Erro ao alternar curtida." });
  }
}

async function criarComentario(req, res) {
  try {
    const id_usuario = req.usuario.id;
    const id_publicacao = req.params.id;
    const { comentario, anonimo = true } = req.body;

    if (!comentario || !comentario.trim()) {
      return res.status(400).json({
        mensagem: "O comentário não pode estar vazio."
      });
    }

    const id_comentario = await postService.criarComentario(
      id_usuario,
      id_publicacao,
      comentario.trim(),
      anonimo
    );

    return res.status(201).json({
      mensagem: "Comentário criado com sucesso!",
      id_comentario,
      anonimo
    });
  } catch (erro) {
    console.error(erro);
    return res.status(400).json({
      mensagem: erro.message || "Erro ao criar comentário."
    });
  }
}

async function listarComentarios(req, res) {
  try {
    const id_publicacao = req.params.id;
    const comentarios = await postService.listarComentarios(id_publicacao);

    return res.status(200).json(comentarios);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({
      mensagem: "Erro ao listar comentários."
    });
  }
}

module.exports = {
  listar,
  criar,
  curtir,
  criarComentario,
  listarComentarios
};