import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { updateUserProfileFields } from "../firebase/database";
import { logoutUser } from "../firebase/auth";
import { getLevelForMiles } from "../data/levels";
import { formatDate, formatMiles } from "../utils/formatters";
import { ROUTES } from "../utils/constants";
import styles from "./Profile.module.css";

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(profile?.name || "");
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (!profile || !user) {
    return <Loading label="Carregando seu perfil" />;
  }

  const level = getLevelForMiles(profile.milesAccumulated || 0);
  const nameChanged = name.trim() && name.trim() !== profile.name;

  async function handleSave(event) {
    event.preventDefault();
    if (!nameChanged) return;
    setSaving(true);
    try {
      // Apenas o nome é editável por aqui — e-mail, saldo e nível são
      // controlados pelo Authentication e pelas regras de segurança do
      // banco, não por este formulário.
      await updateUserProfileFields(user.uid, { name: name.trim() });
      await refreshProfile();
      showToast("Perfil atualizado", { type: "success" });
    } catch (error) {
      showToast("Não foi possível salvar agora. Tente novamente.", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await logoutUser();
    navigate(ROUTES.home);
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <span className="eyebrow">Sua conta</span>
      <h1 className={styles.title}>Perfil</h1>

      <div className={styles.grid}>
        <Card className={styles.summaryCard}>
          <dl className={styles.summaryList}>
            <div>
              <dt>E-mail</dt>
              <dd>{profile.email}</dd>
            </div>
            <div>
              <dt>Nível atual</dt>
              <dd>{level.name}</dd>
            </div>
            <div>
              <dt>Saldo de milhas</dt>
              <dd className="board-number">{formatMiles(profile.milesBalance)}</dd>
            </div>
            <div>
              <dt>Cliente desde</dt>
              <dd>{formatDate(profile.createdAt)}</dd>
            </div>
            <div>
              <dt>ID do usuário</dt>
              <dd className={styles.uid}>{user.uid}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className={styles.cardTitle}>Editar informações</h2>
          <form className={styles.form} onSubmit={handleSave}>
            <div className={styles.field}>
              <label htmlFor="profile-name">Nome completo</label>
              <input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} />
            </div>
            <Button type="submit" loading={saving} disabled={!nameChanged}>
              Salvar alterações
            </Button>
          </form>

          <div className={styles.dangerZone}>
            <h2 className={styles.cardTitle}>Sessão</h2>
            <p className="text-muted" style={{ marginBottom: "var(--space-3)" }}>
              Você pode encerrar sua sessão a qualquer momento.
            </p>
            <Button variant="danger" onClick={handleLogout} loading={loggingOut}>
              Sair da conta
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
