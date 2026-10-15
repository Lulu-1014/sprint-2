import { FormEvent, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import "../styles/login.css";

type Status = {
  text: string;
  color: string;
};

type AuthResponse = {
  token?: string;
  usuario?: {
    id: string | number;
    nome_usuario: string;
    email: string;
  };
  mensagem?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { dark } = useTheme();

  const [active, setActive] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [remember, setRemember] = useState(false);
  const [loginStatus, setLoginStatus] = useState<Status>({
    text: "",
    color: "",
  });
  const emailInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailInputRef.current?.focus()
  }, []);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [idade, setIdade] = useState("");

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    idade: "",
  });

  const [registerStatus, setRegisterStatus] = useState<Status>({
    text: "",
    color: "",
  });

  const limparErros = () =>
    setErrors({
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      idade: "",
    });

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoginStatus({
      text: "Autenticando...",
      color: "#38bdf8",
    });

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: loginEmail,
            senha: loginSenha,
            lembrar: remember,
          }),
        }
      );

      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setLoginStatus({
          text: data.mensagem || "Erro ao realizar login.",
          color: "#ff5555",
        });

        return;
      }

      if (data.usuario) {
        login({
          id: data.usuario.id,
          username: data.usuario.nome_usuario,
          email: data.usuario.email,
          avatar: "👤",
          handle:
            "@" +
            data.usuario.nome_usuario
              .toLowerCase()
              .replace(/\s+/g, ""),
        });
      }

      setLoginStatus({
        text: "Login bem-sucedido! Redirecionando...",
        color: "#4ade80",
      });

      navigate("/home");
    } catch (error) {
      console.error(error);

      setLoginStatus({
        text: "Erro de conexão com o servidor.",
        color: "#ff5555",
      });
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    limparErros();

    const nomeValido = nome.trim().length >= 3;
    const emailValido =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const senhaValida = senha.length >= 6;
    const confirmacaoValida = senha === confirmarSenha;

    const idadeNumero = Number.parseInt(idade, 10);

    const idadeValida =
      Number.isInteger(idadeNumero) && idadeNumero >= 12;

    if (!nomeValido) {
      setErrors((old) => ({
        ...old,
        nome: "Digite um nome válido (mín. 3 letras)",
      }));

      return;
    }

    if (!emailValido) {
      setErrors((old) => ({
        ...old,
        email: "Email inválido",
      }));

      return;
    }

    if (!senhaValida) {
      setErrors((old) => ({
        ...old,
        senha: "A senha deve ter pelo menos 6 caracteres",
      }));

      return;
    }

    if (!confirmacaoValida) {
      setErrors((old) => ({
        ...old,
        confirmarSenha: "As senhas não conferem",
      }));

      return;
    }

    if (!idadeValida) {
      setErrors((old) => ({
        ...old,
        idade: "Digite uma idade válida (mínimo 12 anos)",
      }));

      return;
    }

    setRegisterStatus({
      text: "Cadastrando...",
      color: "#38bdf8",
    });

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/cadastro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nome_usuario: nome,
            email,
            senha,
            confirmar_senha: confirmarSenha,
            idade: idadeNumero,
          }),
        }
      );

      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setRegisterStatus({
          text: data.mensagem || "Erro ao realizar cadastro.",
          color: "#ff5555",
        });

        return;
      }

      setRegisterStatus({
        text: "Cadastro realizado! Faça login agora.",
        color: "#4ade80",
      });

      setNome("");
      setEmail("");
      setSenha("");
      setConfirmarSenha("");
      setIdade("");

      window.setTimeout(() => {
        setRegisterStatus({
          text: "",
          color: "",
        });

        setActive(false);
      }, 1800);
    } catch (error) {
      console.error(error);

      setRegisterStatus({
        text: "Erro de conexão com o servidor.",
        color: "#ff5555",
      });
    }
  }

  return (
    <div className={dark ? "login-page dark" : "login-page"}>

      <ThemeToggle />

      <main className="main-login">

        <div
          className={
            active
              ? "container active"
              : "container"
          }
        >

          <div className="form__box login">

            <form onSubmit={handleLogin}>

              <h1>Login</h1>

              <div className="input__box">

                <input
                ref={emailInputRef}
                  type="email"
                  placeholder="E-mail"
                  required
                  value={loginEmail}
                  onChange={(e) =>
                    setLoginEmail(e.target.value)
                  }
                />

                <span className="msgErrorEmail"></span>

                <i className="bx bxs-envelope"></i>

              </div>

              <div className="input__box">

                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={loginSenha}
                  onChange={(e) =>
                    setLoginSenha(e.target.value)
                  }
                />

                <span className="msgErrorSenha"></span>

                <i className="bx bxs-lock-alt"></i>

              </div>

              <div className="forgot__link">
                <Link to="/redefinir-senha">
                  Esqueceu a senha?
                </Link>
              </div>

              <button
                type="submit"
                className="btn"
              >
                Login
              </button>

              <div className="form-options">

              </div>

              <p
                className="result-message"
                style={{
                  color: loginStatus.color,
                }}
              >
                {loginStatus.text}
              </p>

            </form>

          </div>

          <div className="form__box register">

            <form onSubmit={handleRegister}>

              <h1>Registration</h1>

              <div className="input__box">

                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={nome}
                  onChange={(e) =>
                    setNome(
                      e.target.value.replace(
                        /[^a-zA-ZÀ-ÿ\s]/g,
                        ""
                      )
                    )
                  }
                />

                <span className="field-error">
                  {errors.nome}
                </span>

                <i className="bx bxs-user"></i>

              </div>

              <div className="input__box">

                <input
                  type="email"
                  placeholder="E-mail"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />

                <span className="field-error">
                  {errors.email}
                </span>

                <i className="bx bxs-envelope"></i>

              </div>

              <div className="input__box">

                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={senha}
                  onChange={(e) =>
                    setSenha(e.target.value)
                  }
                />

                <span className="field-error">
                  {errors.senha}
                </span>

                <i className="bx bxs-lock-alt"></i>

              </div>

              <div className="input__box">

                <input
                  type="password"
                  placeholder="Confirm password"
                  required
                  value={confirmarSenha}
                  onChange={(e) =>
                    setConfirmarSenha(e.target.value)
                  }
                />

                <span className="field-error">
                  {errors.confirmarSenha}
                </span>

                <i className="bx bxs-lock-alt"></i>

              </div>

              <div className="input__box">

                <input
                  type="number"
                  placeholder="Idade"
                  required
                  value={idade}
                  onChange={(e) =>
                    setIdade(e.target.value)
                  }
                />

                <span className="field-error">
                  {errors.idade}
                </span>

                <i className="bx bxs-calendar"></i>

              </div>

              <button
                type="submit"
                className="btn"
              >
                Register
              </button>

              <p
                className="result-message"
                style={{
                  color: registerStatus.color,
                }}
              >
                {registerStatus.text}
              </p>

            </form>

          </div>

          <div className="toggle__box">

            <div className="toggle__panel toggle__left">

              <img
                src="/images/logo.png"
                className="img"
                alt="Never Alone"
              />

              <h1>Welcome, Never Alone</h1>

              <p className="slogan">
                Juntos somos mais fortes. Aqui sua voz importa!
              </p>

              <p>
                Precisa se registrar?
              </p>

              <button
                className="btn register__btn"
                onClick={() => setActive(true)}
              >
                Register
              </button>

            </div>

            <div className="toggle__panel toggle__right">

              <img
                src="/images/logo.png"
                className="img"
                alt="Never Alone"
              />

              <h1>Welcome Back!</h1>

              <p className="slogan">
                Juntos somos mais fortes. Aqui sua voz importa!
              </p>

              <p>
                Já tem conta?
              </p>

              <button
                className="btn login__btn"
                onClick={() => setActive(false)}
              >
                Login
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
