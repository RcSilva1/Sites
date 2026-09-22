import { Link } from "react-router-dom";
import { BRAND_NAME } from "../data/brand";
import { ROUTES } from "../utils/constants";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${styles.top} container`}>
        <div className={styles.brandBlock}>
          <span className={styles.brand}>{BRAND_NAME}</span>
          <p className={styles.disclaimer}>
            Projeto educacional. Milhas, níveis, valores e benefícios apresentados aqui são fictícios e
            servem apenas para fins de demonstração escolar sobre o funcionamento de programas de
            fidelidade — não representam um programa de milhagem real.
          </p>
        </div>

        <nav className={styles.column} aria-label="Navegação">
          <span className={styles.columnTitle}>Programa</span>
          <Link to={ROUTES.howItWorks}>Como funciona</Link>
          <Link to={ROUTES.register}>Criar conta</Link>
          <Link to={ROUTES.login}>Entrar</Link>
        </nav>

        <div className={styles.column}>
          <span className={styles.columnTitle}>Projeto</span>
          <span className={styles.mutedLine}>Trabalho escolar</span>
          <span className={styles.mutedLine}>Sistema de milhas e fidelidade</span>
        </div>
      </div>

      <div className={`${styles.bottom} container`}>
        <span>
          © {new Date().getFullYear()} {BRAND_NAME}. Simulação educacional.
        </span>
      </div>
    </footer>
  );
}
