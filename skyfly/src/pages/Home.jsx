import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import FlightPath from "../components/illustrations/FlightPath";
import { BRAND_NAME } from "../data/brand";
import { LEVELS } from "../data/levels";
import { ROUTES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import styles from "./Home.module.css";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <section className={styles.hero}>
        <div className={`${styles.heroInner} container`}>
          <div className={styles.heroText}>
            <span className="eyebrow">Programa de fidelidade</span>
            <h1 className={styles.headline}>
              Viajar é só o começo. O que você faz depois é o que rende milhas.
            </h1>
            <p className={styles.subhead}>
              {BRAND_NAME} transforma voos, compras e experiências do dia a dia em milhas que você troca
              por passagens, upgrades e vantagens — no seu ritmo, sem letras miúdas.
            </p>
            <div className={styles.heroActions}>
              <Button as={Link} to={isAuthenticated ? ROUTES.dashboard : ROUTES.register} size="lg">
                {isAuthenticated ? "Ir para o painel" : `Conheça o ${BRAND_NAME}`}
              </Button>
              <Button
                as={Link}
                to={ROUTES.howItWorks}
                variant="secondary"
                size="lg"
                className={styles.heroSecondaryBtn}
              >
                Como funciona
              </Button>
            </div>
          </div>
          <FlightPath className={styles.heroArt} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.introGrid}>
            <div>
              <span className="eyebrow">O programa</span>
              <h2 className={styles.sectionTitle}>Um saldo que cresce com o que você já faz</h2>
            </div>
            <p className="text-muted">
              Cada voo, cada compra com parceiros e cada promoção soma milhas na sua conta. Você
              acompanha tudo em tempo real e decide quando e como trocar.
            </p>
          </div>

          <div className={styles.introCards}>
            <Card className={styles.introCard}>
              <span className={styles.introNumber}>01</span>
              <h3>Acumule</h3>
              <p className="text-muted">Voos, compras e parceiros credita­m milhas automaticamente na sua conta.</p>
            </Card>
            <Card className={styles.introCard}>
              <span className={styles.introNumber}>02</span>
              <h3>Acompanhe</h3>
              <p className="text-muted">Um painel claro mostra saldo, nível e quanto falta para o próximo degrau.</p>
            </Card>
            <Card className={styles.introCard}>
              <span className={styles.introNumber}>03</span>
              <h3>Resgate</h3>
              <p className="text-muted">Troque por passagens, upgrades, produtos e experiências quando quiser.</p>
            </Card>
          </div>
        </div>
      </section>

      <section className={`section ${styles.levelsSection}`}>
        <div className="container">
          <span className="eyebrow">Categorias</span>
          <h2 className={styles.sectionTitle}>Quatro níveis, benefícios crescentes</h2>
          <div className={styles.levelsGrid}>
            {LEVELS.map((level) => (
              <Card key={level.id} className={styles.levelCard}>
                <h3>{level.name}</h3>
                <p className="text-muted">{level.description}</p>
                <ul className={styles.levelBenefits}>
                  {level.benefits.slice(0, 2).map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.ctaBand}`}>
          <div>
            <h2 className={styles.sectionTitle}>Pronto para ver seu saldo crescer?</h2>
            <p className="text-muted">Criar uma conta leva menos de um minuto.</p>
          </div>
          <Button as={Link} to={isAuthenticated ? ROUTES.dashboard : ROUTES.register} size="lg">
            {isAuthenticated ? "Ir para o painel" : "Criar minha conta"}
          </Button>
        </div>
      </section>
    </>
  );
}
