import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Loading from "../components/Loading";
import MilesBalance from "../components/MilesBalance";
import LevelProgress from "../components/LevelProgress";
import MilesSimulator from "../components/MilesSimulator";
import { useAuth } from "../hooks/useAuth";
import { useMiles } from "../hooks/useMiles";
import { getLevelProgress } from "../data/levels";
import { formatMiles } from "../utils/formatters";
import { ROUTES } from "../utils/constants";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const { profile, user } = useAuth();
  const { accumulate, pending } = useMiles();

  if (!profile) {
    return <Loading label="Carregando seu painel" />;
  }

  const { current, next, progress, remaining } = getLevelProgress(profile.milesAccumulated || 0);
  const firstName = (profile.name || user?.displayName || "").split(" ")[0];

  return (
    <div className="container">
      <section className={styles.heroCard}>
        <div className={styles.heroTop}>
          <div>
            <span className="eyebrow" style={{ color: "var(--color-brass)" }}>
              Olá, {firstName || "viajante"}
            </span>
            <MilesBalance value={profile.milesBalance} label="milhas disponíveis" />
          </div>
          <div className={styles.heroStats}>
            <div>
              <span className={styles.heroStatLabel}>Acumuladas</span>
              <span className="board-number">{formatMiles(profile.milesAccumulated)}</span>
            </div>
            <div>
              <span className={styles.heroStatLabel}>Utilizadas</span>
              <span className="board-number">{formatMiles(profile.milesRedeemed)}</span>
            </div>
          </div>
        </div>

        <LevelProgress current={current} next={next} progress={progress} remaining={remaining} />
      </section>

      <div className={styles.grid}>
        <Card>
          <h2 className={styles.cardTitle}>Simule um acúmulo</h2>
          <p className="text-muted" style={{ marginBottom: "var(--space-4)" }}>
            Informe um valor de compra e veja quantas milhas entrariam na sua conta agora.
          </p>
          <MilesSimulator onSimulate={accumulate} pending={pending} />
        </Card>

        <Card className={styles.quickLinks}>
          <h2 className={styles.cardTitle}>Ações rápidas</h2>
          <div className={styles.linksList}>
            <Button as={Link} to={ROUTES.redeem} variant="secondary">
              Resgatar milhas
            </Button>
            <Button as={Link} to={ROUTES.history} variant="secondary">
              Ver histórico completo
            </Button>
            <Button as={Link} to={ROUTES.profile} variant="secondary">
              Editar perfil
            </Button>
          </div>

          <div className={styles.levelInfo}>
            <h3 className={styles.cardTitle}>Benefícios do seu nível</h3>
            <ul className={styles.benefitList}>
              {current.benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
