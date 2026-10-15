const postRepository = require("../repositories/postRepository");

async function listarPublicacoes(id_usuario) {
  return await postRepository.listar(id_usuario);
}

async function criarPublicacao(id_usuario, dados) {
  if (!dados.conteudo || !dados.conteudo.trim()) {
    throw new Error("O conteúdo da publicação não pode estar vazio.");
  }

  const id = await postRepository.criar({
    id_usuario,
    conteudo: dados.conteudo.trim(),
    categoria: dados.categoria || "Outros",
    anonimo: dados.anonimo ?? true,
  });

  return { id, ...dados };
}

async function alternarCurtida(id_usuario, id_publicacao) {
  return await postRepository.alternarCurtida(id_usuario, id_publicacao);
}

async function criarComentario(
  id_usuario,
  id_publicacao,
  comentario,
  anonimo = true,
) {
  if (!comentario || !comentario.trim()) {
    throw new Error("O comentário não pode estar vazio.");
  }

  const id = await postRepository.criarComentario(
    id_usuario,
    id_publicacao,
    comentario.trim(),
    anonimo,
  );

  return id;
}

async function listarComentarios(id_publicacao) {
  return await postRepository.listarComentarios(id_publicacao);
}

async function atualizarComentario(
  id_usuario,
  id_publicacao,
  id_comentario,
  comentario,
) {
  return await postRepository.atualizarComentario(
    id_usuario,
    id_publicacao,
    id_comentario,
    comentario,
  );
}

async function deletarComentario(id_usuario, id_publicacao, id_comentario) {
  return await postRepository.deletarComentario(
    id_usuario,
    id_publicacao,
    id_comentario,
  );
}

async function deletarPublicacao(id_publicacao, id_usuario) {
  return await postRepository.deletarPublicacao(id_publicacao, id_usuario);
}

module.exports = {
  listarPublicacoes,
  criarPublicacao,
  alternarCurtida,
  criarComentario,
  listarComentarios,
  atualizarComentario,
  deletarComentario,
  deletarPublicacao,
};
