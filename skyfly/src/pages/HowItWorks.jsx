import { Link } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import MilesSimulator from "../components/MilesSimulator";
import { ACCUMULATE_EXAMPLES, FLOW_STEPS, REDEEM_EXAMPLES } from "../data/howItWorks";
import { BRAND_NAME } from "../data/brand";
import { ROUTES } from "../utils/constants";
import styles from "./HowItWorks.module.css";

export default function HowItWorks() {
  return (
    <>
      <section className={styles.intro}>
        <div className="container">
          <span className="eyebrow">Guia rápido</span>
          <h1 className={styles.title}>Como funciona o {BRAND_NAME}</h1>
          <p className={styles.lead}>
            Milhas são pontos que você acumula em atividades do dia a dia — como voar ou comprar com
            parceiros — e troca depois por passagens, produtos e experiências. Veja o passo a passo
            abaixo.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.flow}>
            {FLOW_STEPS.map((step, index) => (
              <div key={step} className={styles.flowStep}>
                <span className={`board-number ${styles.flowIndex}`}>{String(index + 1).padStart(2, "0")}</span>
                <p>{step}</p>
                {index < FLOW_STEPS.length - 1 && <span className={styles.flowArrow} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.altSection}`}>
        <div className="container">
          <span className="eyebrow">Como acumular</span>
          <h2 className={styles.sectionTitle}>Milhas nascem de atividades que você já faz</h2>
          <div className={styles.exampleGrid}>
            {ACCUMULATE_EXAMPLES.map((item) => (
              <Card key={item.title}>
                <h3 className={styles.exampleTitle}>{item.title}</h3>
                <p className="text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <span className="eyebrow">Como utilizar</span>
          <h2 className={styles.sectionTitle}>E viram experiências quando você quiser</h2>
          <div className={styles.exampleGrid}>
            {REDEEM_EXAMPLES.map((item) => (
              <Card key={item.title}>
                <h3 className={styles.exampleTitle}>{item.title}</h3>
                <p className="text-muted">{item.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${styles.altSection}`}>
        <div className="container">
          <span className="eyebrow">Experimente</span>
          <h2 className={styles.sectionTitle}>Simule quantas milhas você acumularia</h2>
          <p className="text-muted" style={{ marginBottom: "var(--space-5)" }}>
            Os valores abaixo são exemplos de simulação do projeto {BRAND_NAME} e não representam
            regras de um programa real.
          </p>
          <Card className={styles.simulatorCard}>
            <MilesSimulator />
          </Card>
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.ctaBand}`}>
          <h2 className={styles.sectionTitle}>Viu como é simples? Crie sua conta.</h2>
          <Button as={Link} to={ROUTES.register} size="lg">
            Criar minha conta
          </Button>
        </div>
      </section>
    </>
  );
}
