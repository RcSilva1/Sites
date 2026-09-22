import { Link } from "react-router-dom";
import Button from "../components/Button";
import { ROUTES } from "../utils/constants";
import styles from "./NotFound.module.css";

export default function NotFound() {
  return (
    <div className={`container ${styles.wrap}`}>
      <span className="board-number eyebrow">404</span>
      <h1 className={styles.title}>Essa rota não decolou</h1>
      <p className="text-muted">A página que você procura não existe ou foi movida.</p>
      <Button as={Link} to={ROUTES.home}>
        Voltar para o início
      </Button>
    </div>
  );
}
