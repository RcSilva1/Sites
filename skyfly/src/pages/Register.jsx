import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import { registerUser, translateAuthError } from "../firebase/auth";
import { useToast } from "../hooks/useToast";
import { MIN_PASSWORD_LENGTH, ROUTES } from "../utils/constants";
import styles from "./Auth.module.css";

const initialForm = { name: "", email: "", password: "", confirmPassword: "", acceptedTerms: false };

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const errors = {};
    if (!form.name.trim()) errors.name = "Informe seu nome completo.";
    if (!form.email.trim()) errors.email = "Informe um e-mail.";
    if (form.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }
    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = "As senhas não coincidem.";
    }
    if (!form.acceptedTerms) errors.acceptedTerms = "É preciso aceitar os termos para continuar.";
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      showToast(`Conta criada! Bem-vindo ao Skyfly, ${form.name.trim().split(" ")[0]}.`, { type: "success" });
      navigate(ROUTES.dashboard, { replace: true });
    } catch (err) {
      setFormError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`${styles.wrap} container`}>
      <Card as="section" className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar conta</h1>
          <p className={styles.subtitle}>Leva menos de um minuto — e você já começa com milhas de boas-vindas.</p>
        </div>

        {formError && <p className={styles.formError}>{formError}</p>}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={`${styles.field} ${fieldErrors.name ? styles.fieldError : ""}`}>
            <label htmlFor="register-name">Nome completo</label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
            />
            {fieldErrors.name && <span className={styles.errorText}>{fieldErrors.name}</span>}
          </div>

          <div className={`${styles.field} ${fieldErrors.email ? styles.fieldError : ""}`}>
            <label htmlFor="register-email">E-mail</label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
            {fieldErrors.email && <span className={styles.errorText}>{fieldErrors.email}</span>}
          </div>

          <div className={`${styles.field} ${fieldErrors.password ? styles.fieldError : ""}`}>
            <label htmlFor="register-password">Senha</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
            />
            {fieldErrors.password && <span className={styles.errorText}>{fieldErrors.password}</span>}
          </div>

          <div className={`${styles.field} ${fieldErrors.confirmPassword ? styles.fieldError : ""}`}>
            <label htmlFor="register-confirm">Confirmar senha</label>
            <input
              id="register-confirm"
              type="password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(event) => updateField("confirmPassword", event.target.value)}
            />
            {fieldErrors.confirmPassword && <span className={styles.errorText}>{fieldErrors.confirmPassword}</span>}
          </div>

          <label className={styles.checkboxField}>
            <input
              type="checkbox"
              checked={form.acceptedTerms}
              onChange={(event) => updateField("acceptedTerms", event.target.checked)}
            />
            <span>
              Li e aceito os termos de uso simulados do projeto Skyfly, um trabalho escolar sobre programas
              de fidelidade.
            </span>
          </label>
          {fieldErrors.acceptedTerms && <span className={styles.errorText}>{fieldErrors.acceptedTerms}</span>}

          <Button type="submit" loading={loading} size="lg">
            Criar conta
          </Button>
        </form>

        <div className={styles.footerLinks}>
          <span>Já tem conta?</span>
          <Link to={ROUTES.login}>Entrar</Link>
        </div>
      </Card>
    </div>
  );
}
