
const { conexao } = require("../config/database");

async function listar(id_usuario = 0) {
  const query = `
    SELECT 
      p.id_publicacao AS id,
      p.id_usuario,
      p.conteudo AS text,
      p.categoria AS category,
      p.anonimo AS anonymous,
      p.data_publicacao AS timestamp,

      IF(
        p.anonimo = 1,
        'Anônimo',
        u.nome_usuario
      ) AS username,

      IF(
        p.anonimo = 1,
        '😎',
        '👤'
      ) AS avatar,

      IF(
        p.anonimo = 1,
        '@anonimo',
        CONCAT('@', LOWER(REPLACE(u.nome_usuario, ' ', '')))
      ) AS handle,

      COUNT(DISTINCT c.id_curtida) AS likes,

      EXISTS(
        SELECT 1
        FROM curtidas c2
        WHERE c2.id_publicacao = p.id_publicacao
          AND c2.id_usuario = ?
      ) AS userLiked

    FROM publicacoes p

    JOIN usuarios u
      ON p.id_usuario = u.id_usuario

    LEFT JOIN curtidas c
      ON p.id_publicacao = c.id_publicacao

    GROUP BY p.id_publicacao

    ORDER BY p.data_publicacao DESC
  `;

  const [rows] = await conexao.execute(query, [id_usuario]);

  // Não existem publicações
  if (rows.length === 0) {
    return [];
  }

  // IDs das publicações
  const ids = rows.map(row => row.id);

  const placeholders = ids
    .map(() => "?")
    .join(", ");

  // Buscar comentários das publicações
  const [comentarios] = await conexao.execute(
    `
      SELECT
        c.id_comentario AS id,
        c.id_publicacao,
        c.id_usuario,
        c.comentario AS text,
        c.data_comentario AS timestamp,

        c.anonimo AS anonymous,

        IF(
          c.anonimo = 1,
          'Anônimo',
          u.nome_usuario
        ) AS username

      FROM comentarios c

      JOIN usuarios u
        ON c.id_usuario = u.id_usuario

      WHERE c.id_publicacao IN (${placeholders})

      ORDER BY c.data_comentario ASC
    `,
    ids
  );

  // Montar resultado final
  return rows.map(row => ({
    ...row,

    // Garantir que o MySQL BOOLEAN vire true/false
    userLiked: Boolean(row.userLiked),
    anonymous: Boolean(row.anonymous),

    comments: comentarios
      .filter(comentario =>
        Number(comentario.id_publicacao) === Number(row.id)
      )
      .map(comentario => ({
        id: comentario.id,
        id_usuario: comentario.id_usuario,
        text: comentario.text,
        timestamp: comentario.timestamp,
        username: comentario.username,

        // Retorna se o comentário é anônimo
        anonymous: Boolean(comentario.anonymous)
      }))
  }));
}


async function criar(post) {
  const [result] = await conexao.execute(
    `INSERT INTO publicacoes (id_usuario, conteudo, categoria, anonimo)
     VALUES (?, ?, ?, ?)`,
    [
      post.id_usuario,
      post.conteudo,
      post.categoria || "Outros",
      post.anonimo
    ]
  );
  return result.insertId;
}

async function alternarCurtida(id_usuario, id_publicacao) {
  const [existente] = await conexao.execute(
    `SELECT * FROM curtidas WHERE id_usuario = ? AND id_publicacao = ?`,
    [id_usuario, id_publicacao]
  );

  if (existente.length > 0) {
    await conexao.execute(
      `DELETE FROM curtidas WHERE id_usuario = ? AND id_publicacao = ?`,
      [id_usuario, id_publicacao]
    );
    return { curtido: false };
  } else {
    await conexao.execute(
      `INSERT INTO curtidas (id_usuario, id_publicacao) VALUES (?, ?)`,
      [id_usuario, id_publicacao]
    );
    return { curtido: true };
  }
}

async function criarComentario(id_usuario, id_publicacao, comentario, anonimo) {
  const [result] = await conexao.execute(
    `INSERT INTO comentarios
      (id_usuario, id_publicacao, comentario, anonimo)
     VALUES (?, ?, ?, ?)`,
    [id_usuario, id_publicacao, comentario, anonimo]
  );

  return result.insertId;
}

async function listarComentarios(id_publicacao) {
  const [rows] = await conexao.execute(
    `SELECT
      c.id_comentario AS id,
      c.id_publicacao,
      c.id_usuario,
      c.comentario AS text,
      c.data_comentario AS timestamp,
      u.nome_usuario AS username
    FROM comentarios c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_publicacao = ?
    ORDER BY c.data_comentario ASC`,
    [id_publicacao]
  );

  return rows;
}

module.exports = {
  listar,
  criar,
  alternarCurtida,
  criarComentario,
  listarComentarios
};