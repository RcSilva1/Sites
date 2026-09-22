import { useMemo, useState } from "react";
import Card from "../components/Card";
import Loading from "../components/Loading";
import TransactionList from "../components/TransactionList";
import { useTransactions } from "../hooks/useTransactions";
import styles from "./History.module.css";

const FILTERS = [
  { id: "todas", label: "Todas" },
  { id: "accumulate", label: "Acumuladas" },
  { id: "redeem", label: "Utilizadas" },
];

export default function History() {
  const { transactions, loading, error } = useTransactions();
  const [filter, setFilter] = useState("todas");

  const filtered = useMemo(() => {
    if (filter === "todas") return transactions;
    return transactions.filter((tx) => tx.type === filter);
  }, [transactions, filter]);

  return (
    <div className={`container ${styles.wrap}`}>
      <span className="eyebrow">Movimentações</span>
      <h1 className={styles.title}>Histórico de milhas</h1>
      <p className="text-muted">Todas as entradas e saídas registradas na sua conta Skyfly.</p>

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`${styles.filterBtn} ${filter === f.id ? styles.filterActive : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <Card className={styles.card}>
        {loading && <Loading label="Carregando histórico" />}
        {!loading && error && (
          <p className={styles.errorText}>Não foi possível carregar seu histórico agora. Tente novamente em instantes.</p>
        )}
        {!loading && !error && <TransactionList transactions={filtered} />}
      </Card>
    </div>
  );
}
