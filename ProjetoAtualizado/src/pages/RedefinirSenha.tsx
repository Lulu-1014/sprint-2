import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { Lock, ArrowLeft } from "lucide-react";
import "../styles/redefinirSenha.css";

export default function RedefinirSenha() {
  const navigate = useNavigate();
  const { dark } = useTheme();
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
    <div className={dark ? "senha-page dark" : "senha-page light"}>
      <ThemeToggle />

      <div className="form__senha">
        <form onSubmit={handleSubmit}>
          <h1>Redefinir Senha</h1>

          <div className="input__senha">
            <input
              type="password"
              placeholder="Nova senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <Lock className="input-icon" size={18} />
          </div>

          <div className="input__senha">
            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
            <Lock className="input-icon" size={18} />
          </div>

          <span
            className={
              sucesso
                ? "msgErrorConfirmarSenha success"
                : "msgErrorConfirmarSenha"
            }
          >
            {mensagem}
          </span>

          <button className="redefinirSenha" type="submit">
            Redefinir senha
          </button>

          <div className="voltar-login">
            <Link to="/">
              <ArrowLeft size={16} /> Voltar para o Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}