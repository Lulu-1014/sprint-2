function validarCadastro(dados) {
  const { nome_usuario, email, senha, confirmar_senha, idade } = dados;

  if (!nome_usuario || !email || !senha || !confirmar_senha || idade === undefined) {
    return "Preencha todos os campos.";
  }

  if (!email.includes("@")) {
    return "Digite um email válido.";
  }

  if (senha.length < 6) {
    return "A senha deve ter pelo menos 6 caracteres.";
  }

  if (senha !== confirmar_senha) {
    return "As senhas não são iguais.";
  }

  if (!Number.isInteger(Number(idade)) || Number(idade) < 1) {
    return "Digite uma idade válida.";
  }

  return null;
}

function validarLogin(dados) {
  const { email, senha } = dados;

  if (!email || !senha) {
    return "Email e senha são obrigatórios.";
  }

  return null;
}

module.exports = {
  validarCadastro,
  validarLogin
};
