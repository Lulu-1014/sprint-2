import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

type User = {
  id?: string | number;
  username?: string;
  email?: string;
  avatar?: string;
  handle?: string;
};

type Comment = {
  id: number;
  text: string;
  username?: string;
  authorId?: string | number;
  anonymous: boolean;
};

type Post = {
  id: number;
  text: string;
  category: string;
  anonymous: boolean;
  username?: string;
  authorId?: string | number;
  comments: Comment[];
};

const API_URL = "http://localhost:3000/api/publicacoes";

export default function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  console.log(user)
  const [pagina, setPagina] = useState<"inicio" | "conta" | "apoio">("inicio");
  const [postText, setPostText] = useState("");
  const [category, setCategory] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [search, setSearch] = useState("");
  const [errorPost, setErrorPost] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [publishing, setPublishing] = useState(false);

  const [commentTexts, setCommentTexts] = useState<Record<number, string>>({});
  const [anonymousComment, setAnonymousComment] = useState<Record<number, boolean>>({});
  const [sendingComments, setSendingComments] = useState<Record<number, boolean>>({});

  const [comentarioEditando, setComentarioEditando] = useState<number | null>(null);
  const [textoComentarioEditado, setTextoComentarioEditado] = useState("");
  const [postComentarioEditando, setPostComentarioEditando] = useState<number | null>(null);
  const [atualizandoComentario, setAtualizandoComentario] = useState(false);
  const [menuComentarioAberto, setMenuComentarioAberto] = useState<number | null>(null);
  const [menuPostAberto, setMenuPostAberto] = useState<number | null>(null);

  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    const verificarTema = () => {
      setDark(localStorage.getItem("theme") !== "light");
    };

    window.addEventListener("storage", verificarTema);
    return () => window.removeEventListener("storage", verificarTema);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-theme", dark);
    document.body.classList.toggle("light-theme", !dark);
  }, [dark]);

  useEffect(() => {
    async function carregarPublicacoes() {
      try {
        setLoadingPosts(true);

        const resposta = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
        });

        if (!resposta.ok) {
          throw new Error("Não foi possível carregar as publicações.");
        }

        const dados = await resposta.json();


        const lista = Array.isArray(dados)
          ? dados
          : dados.publicacoes ?? dados.posts ?? [];

        const publicacoes: Post[] = lista.map((item: any) => ({
          id: Number(item.id ?? item.id_publicacao),
          text: item.text ?? item.conteudo ?? "",
          category: item.category ?? item.categoria ?? "Outros",
          anonymous: Boolean(item.anonymous ?? item.anonimo),
          username:
            item.username ??
            item.nome_usuario ??
            item.usuario?.nome_usuario,
          authorId:
            item.authorId ??
            item.id_usuario ??
            item.usuario?.id_usuario ??
            item.usuario?.id,
          comments: (item.comments ?? item.comentarios ?? []).map(
            (comentario: any) => ({
              id: Number(comentario.id ?? comentario.id_comentario),
              text: comentario.text ?? comentario.conteudo ?? "",
              username:
                comentario.username ??
                comentario.nome_usuario ??
                comentario.usuario?.nome_usuario,
              authorId:
                comentario.authorId ??
                comentario.id_usuario ??
                comentario.usuario?.id_usuario ??
                comentario.usuario?.id,
              anonymous: Boolean(
                comentario.anonymous ?? comentario.anonimo
              ),
            })
          ),
        }));

        setPosts(publicacoes);
      } catch (erro) {
        setErrorPost(
          erro instanceof Error
            ? erro.message
            : "Erro ao carregar as publicações."
        );
      } finally {
        setLoadingPosts(false);
      }
    }

    carregarPublicacoes();
  }, []);

  function sair() {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("never_alone_user");
    navigate("/login");
  }

  async function publicarPost() {
    setErrorPost("");

    if (!postText.trim()) {
      setErrorPost("Escreva algo antes de publicar.");
      return;
    }

    if (!category) {
      setErrorPost("Selecione uma categoria.");
      return;
    }

    try {
      setPublishing(true);

      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          conteudo: postText.trim(),
          categoria: category,
          anonimo: anonymous,
        }),
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ??
          dados.message ??
          "Não foi possível publicar."
        );
      }

      const item = dados.publicacao ?? dados.post ?? dados;

      const novoPost: Post = {
        id: Number(item.id ?? item.id_publicacao),
        text: item.text ?? item.conteudo ?? postText.trim(),
        category: item.category ?? item.categoria ?? category,
        anonymous: Boolean(item.anonymous ?? item.anonimo ?? anonymous),
        username:
          item.username ??
          item.nome_usuario ??
          user?.username,
        authorId:
          item.authorId ??
          item.id_usuario ??
          user?.id,
        comments: [],
      };

      if (!novoPost.id || Number.isNaN(novoPost.id)) {
        throw new Error(
          "A publicação foi enviada, mas a API não retornou o ID."
        );
      }

      setPosts((atuais) => [novoPost, ...atuais]);
      setPostText("");
      setCategory("");
      setAnonymous(true);
    } catch (erro) {
      setErrorPost(
        erro instanceof Error
          ? erro.message
          : "Erro ao publicar."
      );
    } finally {
      setPublishing(false);
    }
  }

  async function comentarPost(postId: number) {
    const texto = commentTexts[postId]?.trim();

    if (!texto || sendingComments[postId]) {
      return;
    }

    const comentarioAnonimo = anonymousComment[postId] ?? true;

    try {
      setSendingComments((atuais) => ({
        ...atuais,
        [postId]: true,
      }));

      const resposta = await fetch(
        `${API_URL}/${postId}/comentarios`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            comentario: texto,
            anonimo: comentarioAnonimo,
          }),
        }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ??
          dados.message ??
          "Não foi possível enviar o comentário."
        );
      }

      const item = dados.comentario ?? dados.comment ?? dados;


      const novoComentario: Comment = {
        id: Number(item.id ?? item.id_comentario ?? dados.id_comentario),
        text: item.text ?? item.conteudo ?? texto,
        username:
          item.username ??
          item.nome_usuario ??
          user?.username,
        authorId:
          item.authorId ??
          item.id_usuario ??
          user?.id,
        anonymous: Boolean(
          item.anonymous ?? item.anonimo ?? comentarioAnonimo
        ),
      };


      if (!novoComentario.id || Number.isNaN(novoComentario.id)) {
        throw new Error(
          "O comentário foi enviado, mas a API não retornou o ID."
        );
      }

      setPosts((atuais) =>
        atuais.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: [...post.comments, novoComentario],
            }
            : post
        )
      );

      setCommentTexts((atuais) => ({
        ...atuais,
        [postId]: "",
      }));
    } catch (erro) {
      setErrorPost(
        erro instanceof Error
          ? erro.message
          : "Erro ao comentar."
      );
    } finally {
      setSendingComments((atuais) => ({
        ...atuais,
        [postId]: false,
      }));
    }
  }

  function iniciarEdicaoComentario(postId: number, comentario: Comment) {
    setPostComentarioEditando(postId);
    setComentarioEditando(comentario.id);
    setTextoComentarioEditado(comentario.text);
  }

  function cancelarEdicaoComentario() {
    setPostComentarioEditando(null);
    setComentarioEditando(null);
    setTextoComentarioEditado("");
  }

  async function atualizarComentario(postId: number, comentarioId: number) {
    const texto = textoComentarioEditado.trim();

    if (!texto || atualizandoComentario) {
      return;
    }

    try {
      setAtualizandoComentario(true);

      const resposta = await fetch(
        `${API_URL}/${postId}/comentarios/${comentarioId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            comentario: texto,
          }),
        }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ??
          dados.message ??
          "Não foi possível atualizar o comentário."
        );
      }

      setPosts((atuais) =>
        atuais.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.map((comentario) =>
                comentario.id === comentarioId
                  ? { ...comentario, text: texto }
                  : comentario
              ),
            }
            : post
        )
      );

      cancelarEdicaoComentario();
      setErrorPost("");
    } catch (erro) {
      setErrorPost(
        erro instanceof Error
          ? erro.message
          : "Erro ao atualizar o comentário."
      );
    } finally {
      setAtualizandoComentario(false);
    }
  }

  async function deletarComentario(postId: number, comentarioId: number) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir este comentário?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(
        `${API_URL}/${postId}/comentarios/${comentarioId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ??
          dados.message ??
          "Não foi possível excluir o comentário."
        );
      }

      setPosts((atuais) =>
        atuais.map((post) =>
          post.id === postId
            ? {
              ...post,
              comments: post.comments.filter(
                (comentario) => comentario.id !== comentarioId
              ),
            }
            : post
        )
      );

      if (comentarioEditando === comentarioId) {
        cancelarEdicaoComentario();
      }

      setErrorPost("");
    } catch (erro) {
      setErrorPost(
        erro instanceof Error
          ? erro.message
          : "Erro ao excluir o comentário."
      );
    }
  }

  async function deletarPost(postId: number) {
    const confirmar = window.confirm(
      "Tem certeza de que deseja excluir esta publicação?"
    );

    if (!confirmar) {
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/${postId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const dados = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          dados.mensagem ??
          dados.message ??
          "Não foi possível excluir a publicação."
        );
      }

      setPosts((atuais) =>
        atuais.filter((post) => post.id !== postId)
      );

      setErrorPost("");
    } catch (erro) {
      setErrorPost(
        erro instanceof Error
          ? erro.message
          : "Erro ao excluir a publicação."
      );
    }
  }


  const postsFiltrados = posts.filter((post) => {
    const textoBusca = search.toLowerCase();

    return (
      post.text.toLowerCase().includes(textoBusca) ||
      post.category.toLowerCase().includes(textoBusca)
    );
  });

  const postsDaConta = posts.filter(
    (post) =>
      user?.id !== undefined &&
      post.authorId !== undefined &&
      String(post.authorId) === String(user.id)
  );

  return (
    <div className={dark ? "home-page dark" : "home-page light"}>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <div>
              <strong>Never</strong>
              <span>Alone</span>
            </div>
          </div>

          <nav>
            <button
              className={pagina === "inicio" ? "nav-item active" : "nav-item"}
              onClick={() => setPagina("inicio")}
            >
              <span>⌂</span> Início
            </button>

            <button
              className={pagina === "conta" ? "nav-item active" : "nav-item"}
              onClick={() => setPagina("conta")}
            >
              <span>👤</span> Conta
            </button>

            <button
              className={pagina === "apoio" ? "nav-item active" : "nav-item"}
              onClick={() => setPagina("apoio")}
            >
              <span>♡</span> Apoio
            </button>
          </nav>

          <button className="logout" onClick={sair}>
            <span>🚪</span> Sair
          </button>
        </aside>

        <main className="home-content">
          {pagina === "inicio" && (
            <>
              <header className="topbar">
                <div className="search">
                  <span>⌕</span>
                  <input
                    type="text"
                    id="searchInput"
                    placeholder="Buscar publicações..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </header>

              <section className="feed">
                <div className="create-post">
                  <div className="user-avatar" id="userAvatarDisplay">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" />
                    ) : (
                      "👤"
                    )}
                  </div>

                  <div className="post-area">
                    <textarea
                      id="postText"
                      placeholder="Fale o que você está sentindo"
                      maxLength={500}
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                    />

                    <div className="post-options">
                      <div className="options-right">
                        <button
                          id="anonymousButton"
                          className={anonymous ? "anonymous active" : "anonymous"}
                          type="button"
                          onClick={() => setAnonymous(!anonymous)}
                        >
                          😎 {anonymous ? "Anônimo" : "Público"}
                        </button>

                        <select
                          id="category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option value="">Categoria</option>
                          <option value="Desabafo">Desabafo</option>
                          <option value="Apoio">Apoio</option>
                          <option value="Escola">Escola</option>
                          <option value="Família">Família</option>
                          <option value="Amizade">Amizade</option>
                          <option value="Outros">Outros</option>
                        </select>

                        <button
                          id="publishButton"
                          className="publish"
                          type="button"
                          onClick={publicarPost}
                          disabled={publishing}
                        >
                          {publishing ? "Publicando..." : "Publicar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {errorPost && (
                  <p
                    className="msgErrorPost"
                    style={{
                      color: "#ff5555",
                      fontSize: "14px",
                      marginBottom: "10px",
                    }}
                  >
                    {errorPost}
                  </p>
                )}

                <div id="posts">
                  {loadingPosts ? (
                    <p className="empty-posts">
                      Carregando publicações...
                    </p>
                  ) : postsFiltrados.length === 0 ? (
                    <p className="empty-posts">
                      {search
                        ? "Nenhuma publicação encontrada."
                        : "Ainda não há publicações. Seja a primeira pessoa a publicar!"}
                    </p>
                  ) : (
                    postsFiltrados.map((post) => (
                      <article className="post" key={post.id}>
                        <div className="post-header">
                          <div className="post-avatar">
                            {post.anonymous ? "😎" : "👤"}
                          </div>

                          <div>
                            <strong>
                              {post.anonymous
                                ? "Anônimo"
                                : post.username || "Usuário"}
                            </strong>

                            <span className="post-category">
                              {post.category}
                            </span>
                          </div>

                          {post.authorId !== undefined &&
                            user?.id !== undefined &&
                            String(post.authorId) === String(user.id) && (
                              <div className="post-menu">
                                <button
                                  type="button"
                                  className="post-menu-button"
                                  onClick={() =>
                                    setMenuPostAberto(
                                      menuPostAberto === post.id
                                        ? null
                                        : post.id
                                    )
                                  }
                                >
                                  ⋮
                                </button>

                                {menuPostAberto === post.id && (
                                  <div className="post-menu-options">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        deletarPost(post.id);
                                        setMenuPostAberto(null);
                                      }}
                                    >
                                      Deletar
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                        </div>

                        <p className="post-text">{post.text}</p>

                        <div className="comments">
                          {post.comments.map((comment) => (
                            <div className="comment" key={comment.id}>
                              <div className="comment-avatar">
                                {comment.anonymous ? "😎" : "👤"}
                              </div>

                              <div className="comment-content">


                                {comentarioEditando === comment.id &&
                                  postComentarioEditando === post.id ? (
                                  <div className="edit-comment">
                                    <textarea
                                      value={textoComentarioEditado}
                                      maxLength={500}
                                      onChange={(e) =>
                                        setTextoComentarioEditado(
                                          e.target.value
                                        )
                                      }
                                    />

                                    <div className="comment-actions">
                                      <button
                                        type="button"
                                        className="update-comment"
                                        disabled={
                                          atualizandoComentario ||
                                          !textoComentarioEditado.trim()
                                        }
                                        onClick={() =>
                                          atualizarComentario(
                                            post.id,
                                            comment.id
                                          )
                                        }
                                      >
                                        {atualizandoComentario
                                          ? "Atualizando..."
                                          : "Atualizar"}
                                      </button>

                                      <button
                                        type="button"
                                        className="cancel-comment"
                                        onClick={cancelarEdicaoComentario}
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div>
                                      <strong>
                                        {comment.anonymous
                                          ? "Anônimo"
                                          : comment.username || "Usuário"}
                                      </strong>
                                      <p>{comment.text}</p>
                                    </div>


                                    {comment.authorId !== undefined &&
                                      user?.id !== undefined &&
                                      String(comment.authorId) === String(user.id) && (
                                        <div className="comment-menu">
                                          <button
                                            type="button"
                                            className="comment-menu-button"
                                            onClick={() =>
                                              setMenuComentarioAberto(
                                                menuComentarioAberto === comment.id
                                                  ? null
                                                  : comment.id
                                              )
                                            }
                                          >
                                            ⋮
                                          </button>

                                          {menuComentarioAberto === comment.id && (
                                            <div className="comment-menu-options">
                                              <button
                                                type="button"
                                                onClick={() => {
                                                  iniciarEdicaoComentario(post.id, comment);
                                                  setMenuComentarioAberto(null);
                                                }}
                                              >
                                                Editar
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => {
                                                  deletarComentario(post.id, comment.id);
                                                  setMenuComentarioAberto(null);
                                                }}
                                              >
                                                Deletar
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                  </>
                                )}
                              </div>
                            </div>
                          ))}

                          <div className="comment-form">
                            <input
                              type="text"
                              placeholder="Escreva um comentário..."
                              value={commentTexts[post.id] || ""}
                              onChange={(e) =>
                                setCommentTexts((atuais) => ({
                                  ...atuais,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  comentarPost(post.id);
                                }
                              }}
                            />

                            <button
                              type="button"
                              className={
                                (anonymousComment[post.id] ?? true)
                                  ? "anonymous active"
                                  : "anonymous"
                              }
                              onClick={() =>
                                setAnonymousComment((atuais) => ({
                                  ...atuais,
                                  [post.id]: !(atuais[post.id] ?? true),
                                }))
                              }
                            >
                              😎{" "}
                              {(anonymousComment[post.id] ?? true)
                                ? "Anônimo"
                                : "Público"}
                            </button>

                            <button
                              type="button"
                              disabled={sendingComments[post.id]}
                              onClick={() => comentarPost(post.id)}
                            >
                              {sendingComments[post.id]
                                ? "Enviando..."
                                : "Comentar"}
                            </button>
                          </div>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </>
          )}

          {pagina === "conta" && (
            <>
              <h1>Conta</h1>

              <div className="card">
                <p>
                  <strong>Usuário:</strong>{" "}
                  {user?.nome_usuario || "Não informado"}
                </p>

                <p>
                  <strong>E-mail:</strong>{" "}
                  {user?.email || "Não informado"}
                </p>
              </div>

              <div className="card">
                <h2>Minhas publicações</h2>

                {postsDaConta.length === 0 ? (
                  <p className="empty-posts">
                    Você ainda não fez nenhuma publicação.
                  </p>
                ) : (
                  postsDaConta.map((post) => (
                    <article className="post" key={post.id}>
                      <div className="post-header">
                        <div className="post-avatar">
                          {post.anonymous ? "😎" : "👤"}
                        </div>

                        <div>
                          <strong>
                            {post.anonymous
                              ? "Anônimo"
                              : post.username || "Usuário"}
                          </strong>

                          <span className="post-category">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      <p className="post-text">{post.text}</p>
                    </article>
                  ))
                )}
              </div>
            </>
          )}

          {pagina === "apoio" && (
            <div className="apoio-page">
              <section className="apoio-card">
                <div className="apoio-icon">✱</div>

                <h2>
                  Suporte
                  <br />
                  Imediato
                </h2>

                <p>Ligue em caso de ajuda!</p>

                <a href="tel:188" className="apoio-button">
                  ☎ &nbsp; Call 188
                </a>

                <a
                  href="https://cvv.org.br/"
                  className="apoio-button"
                  target="_blank"
                  rel="noreferrer"
                >
                  💬 &nbsp; Chat de apoio
                </a>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}