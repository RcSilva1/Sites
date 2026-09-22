import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { loginUser, resetPassword, translateAuthError } from "../firebase/auth";
import { useToast } from "../hooks/useToast";
import { ROUTES } from "../utils/constants";
import styles from "./Auth.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetSent, setResetSent] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const redirectTo = location.state?.from || ROUTES.dashboard;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email, password });
      showToast("Bem-vindo de volta!", { type: "success" });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    setError("");
    if (!email) {
      setError("Digite seu e-mail acima para receber o link de redefinição.");
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(translateAuthError(err));
    }
  }

  return (
    <div className={`${styles.wrap} container`}>
      <Card as="section" className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Entrar</h1>
          <p className={styles.subtitle}>Acesse seu painel de milhas Skyfly.</p>
        </div>

        {error && <p className={styles.formError}>{error}</p>}
        {resetSent && (
          <p className={styles.formNotice}>Se este e-mail existir, enviamos um link de redefinição de senha.</p>
        )}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button type="submit" loading={loading} size="lg">
            Entrar
          </Button>
        </form>

        <div className={styles.footerLinks}>
          <button type="button" className={styles.linkButton} onClick={handleForgotPassword}>
            Esqueci minha senha
          </button>
          <Link to={ROUTES.register}>Criar conta</Link>
        </div>
      </Card>
    </div>
  );
}
