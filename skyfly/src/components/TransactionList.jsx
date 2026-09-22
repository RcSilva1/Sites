import { formatDateTime, formatMiles } from "../utils/formatters";
import styles from "./TransactionList.module.css";

export default function TransactionList({ transactions }) {
  if (transactions.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Nenhuma movimentação por aqui ainda.</p>
        <p className="text-muted">Assim que você acumular ou resgatar milhas, elas aparecem nesta lista.</p>
      </div>
    );
  }

  return (
    <ul className={styles.list}>
      {transactions.map((tx) => (
        <li key={tx.id} className={styles.row}>
          <div className={styles.info}>
            <p className={styles.description}>{tx.description}</p>
            <p className={styles.date}>{formatDateTime(tx.date)}</p>
          </div>
          <span className={`${styles.amount} board-number ${tx.type === "redeem" ? styles.negative : styles.positive}`}>
            {tx.type === "redeem" ? "−" : "+"}
            {formatMiles(tx.amount)}
          </span>
        </li>
      ))}
    </ul>
  );
}
