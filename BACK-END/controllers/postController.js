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
      publicacao,
    });
  } catch (erro) {
    console.error(erro);
    return res
      .status(400)
      .json({ mensagem: erro.message || "Erro ao criar publicação." });
  }
}

async function curtir(req, res) {
  try {
    const id_usuario = req.usuario.id;
    const id_publicacao = req.params.id;
    const resultado = await postService.alternarCurtida(
      id_usuario,
      id_publicacao,
    );
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
        mensagem: "O comentário não pode estar vazio.",
      });
    }

    const id_comentario = await postService.criarComentario(
      id_usuario,
      id_publicacao,
      comentario.trim(),
      anonimo,
    );

    return res.status(201).json({
      mensagem: "Comentário criado com sucesso!",
      id_comentario,
      anonimo,
    });
  } catch (erro) {
    console.error(erro);
    return res.status(400).json({
      mensagem: erro.message || "Erro ao criar comentário.",
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
      mensagem: "Erro ao listar comentários.",
    });
  }
}

async function atualizarComentario(req, res) {
  try {
    const id_usuario = req.usuario.id;
    const id_publicacao = req.params.id;
    const id_comentario = req.params.comentarioId;

    console.log("Usuário:", id_usuario);
    console.log("Publicação:", id_publicacao);
    console.log("Comentário:", id_comentario);

    const { comentario } = req.body;

    if (!comentario || !comentario.trim()) {
      return res.status(400).json({
        mensagem: "O comentário não pode estar vazio.",
      });
    }

    await postService.atualizarComentario(
      id_usuario,
      id_publicacao,
      id_comentario,
      comentario.trim()
    );

    return res.status(200).json({
      mensagem: "Comentário atualizado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao atualizar comentário:", erro);

    return res.status(400).json({
      mensagem: erro.message || "Erro ao atualizar comentário.",
    });
  }
}

async function deletarComentario(req, res) {
  try {
    const id_usuario = req.usuario.id;
    const id_publicacao = req.params.id;
    const id_comentario = req.params.comentarioId;

    await postService.deletarComentario(
      id_usuario,
      id_publicacao,
      id_comentario,
    );

    return res.status(200).json({
      mensagem: "Comentário excluído com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao excluir comentário:", erro);

    return res.status(400).json({
      mensagem: erro.message || "Erro ao excluir comentário.",
    });
  }
}

async function deletar(req, res) {
  try {
    const id_publicacao = req.params.id;
    const id_usuario = req.usuario.id;

    const excluida = await postService.deletarPublicacao(
      id_publicacao,
      id_usuario,
    );

    if (!excluida) {
      return res.status(404).json({
        mensagem:
          "Publicação não encontrada ou você não tem permissão para excluí-la.",
      });
    }

    return res.status(200).json({
      mensagem: "Publicação excluída com sucesso.",
    });
  } catch (erro) {
    console.error("Erro ao excluir publicação:", erro);

    return res.status(500).json({
      mensagem: erro.message || "Erro interno ao excluir a publicação.",
    });
  }
}

module.exports = {
  listar,
  criar,
  curtir,
  criarComentario,
  listarComentarios,
  atualizarComentario,
  deletarComentario,
  deletar,
};
