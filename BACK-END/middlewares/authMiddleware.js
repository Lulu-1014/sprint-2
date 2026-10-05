const jwt = require("jsonwebtoken");

function verificarToken(req, res, next) {
  try {
    // Primeiro tenta pegar o token pelo cookie
    const tokenCookie = req.cookies?.token;

    // Também aceita Authorization, caso você precise no futuro
    const cabecalho = req.headers.authorization;

    const token =
      tokenCookie ||
      (cabecalho ? cabecalho.split(" ")[1] || cabecalho : null);

    if (!token) {
      return res.status(401).json({
        mensagem: "Token não informado.",
      });
    }

    const segredo =
      process.env.JWT_SECRET ||
      "never_alone_secret_key_2026_super_segura";

    const decodificado = jwt.verify(token, segredo);

    // Guarda os dados do usuário na requisição
    req.usuario = decodificado;

    next();
  } catch (erro) {
    console.error("Erro ao verificar token:", erro.message);

    return res.status(401).json({
      mensagem: "Token inválido ou expirado.",
    });
  }
}

module.exports = verificarToken;