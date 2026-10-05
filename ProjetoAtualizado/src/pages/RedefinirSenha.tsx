import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/redefinirSenha.css";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [sucesso, setSucesso] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (senha.length < 6) {
      setSucesso(false);
      setMensagem("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setSucesso(false);
      setMensagem("As senhas devem ser iguais!");
      window.setTimeout(() => setMensagem(""), 2500);
      return;
    }

    setSucesso(true);
    setMensagem("Senha redefinida com sucesso! Redirecionando...");

    window.setTimeout(() => navigate("/"), 1500);
  }

  return (
    <div className="senha-page">
      <div className="form__senha">
        <form onSubmit={handleSubmit}>
          <h1>Redefinir Senha</h1>

          <div className="input__senha">
            <input
              type="password"
              placeholder="Password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <div className="input__senha">
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
            <i className="bx bxs-lock-alt"></i>
          </div>

          <span className={sucesso ? "msgErrorConfirmarSenha success" : "msgErrorConfirmarSenha"}>
            {mensagem}
          </span>

          <button className="redefinirSenha" type="submit">
            Redefinir senha
          </button>
        </form>
      </div>
    </div>
  );
}