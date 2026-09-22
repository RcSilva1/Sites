import { formatMiles } from "../utils/formatters";
import Card from "./Card";
import styles from "./BenefitCard.module.css";

export default function BenefitCard({ benefit, affordable, onSelect }) {
  return (
    <Card className={styles.card}>
      <span className={styles.category}>{benefit.category}</span>
      <h3 className={styles.name}>{benefit.name}</h3>
      <p className={styles.description}>{benefit.description}</p>
      <div className={styles.footer}>
        <span className={`board-number ${styles.cost}`}>{formatMiles(benefit.cost)} milhas</span>
        <button
          type="button"
          className={styles.action}
          onClick={() => onSelect(benefit)}
          disabled={!affordable}
        >
          {affordable ? "Resgatar" : "Saldo insuficiente"}
        </button>
      </div>
    </Card>
  );
}
