import { useState } from "react";
import BenefitCard from "../components/BenefitCard";
import Modal from "../components/Modal";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { BENEFITS, BENEFIT_CATEGORIES } from "../data/benefits";
import { useAuth } from "../hooks/useAuth";
import { useMiles } from "../hooks/useMiles";
import { formatMiles } from "../utils/formatters";
import styles from "./Redeem.module.css";

export default function Redeem() {
  const { profile } = useAuth();
  const { redeem, pending } = useMiles();
  const [category, setCategory] = useState("todos");
  const [selected, setSelected] = useState(null);

  if (!profile) {
    return <Loading label="Carregando benefícios" />;
  }

  const filtered = BENEFITS.filter((b) => category === "todos" || b.category === category);

  async function handleConfirm() {
    if (!selected) return;
    const ok = await redeem({ amount: selected.cost, description: `Resgate: ${selected.name}` });
    if (ok) setSelected(null);
  }

  return (
    <div className={`container ${styles.wrap}`}>
      <div className={styles.header}>
        <div>
          <span className="eyebrow">Resgatar milhas</span>
          <h1 className={styles.title}>Troque suas milhas por experiências</h1>
        </div>
        <div className={styles.balancePill}>
          <span>Saldo disponível</span>
          <strong className="board-number">{formatMiles(profile.milesBalance)}</strong>
        </div>
      </div>

      <div className={styles.filters} role="tablist" aria-label="Filtrar benefícios por categoria">
        {BENEFIT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={category === cat.id}
            className={`${styles.filterBtn} ${category === cat.id ? styles.filterActive : ""}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {filtered.map((benefit) => (
          <BenefitCard
            key={benefit.id}
            benefit={benefit}
            affordable={profile.milesBalance >= benefit.cost}
            onSelect={setSelected}
          />
        ))}
      </div>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Confirmar resgate">
        {selected && (
          <div className={styles.modalBody}>
            <h3>{selected.name}</h3>
            <p className="text-muted">{selected.description}</p>

            <div className={styles.modalSummary}>
              <div>
                <span className={styles.summaryLabel}>Custo</span>
                <span className="board-number">{formatMiles(selected.cost)} milhas</span>
              </div>
              <div>
                <span className={styles.summaryLabel}>Seu saldo</span>
                <span className="board-number">{formatMiles(profile.milesBalance)} milhas</span>
              </div>
              <div>
                <span className={styles.summaryLabel}>Saldo após o resgate</span>
                <span className="board-number">{formatMiles(profile.milesBalance - selected.cost)} milhas</span>
              </div>
            </div>

            {profile.milesBalance < selected.cost && (
              <p className={styles.insufficient}>
                Seu saldo é insuficiente para este resgate. Simule mais acúmulo no painel antes de tentar
                novamente.
              </p>
            )}

            <div className={styles.modalActions}>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirm}
                loading={pending}
                disabled={profile.milesBalance < selected.cost}
              >
                Confirmar resgate
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
