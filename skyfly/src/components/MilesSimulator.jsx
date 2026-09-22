import { useMemo, useState } from "react";
import { formatCurrency, formatMiles } from "../utils/formatters";
import Button from "./Button";
import styles from "./MilesSimulator.module.css";

const MULTIPLIERS = [1, 1.5, 2, 3];

/**
 * Simulador visual: o usuário informa um valor de compra e escolhe um
 * multiplicador, e o componente calcula quantas milhas seriam creditadas.
 * `onSimulate` é opcional — quando fornecido (ex.: no Dashboard, para um
 * usuário logado), o resultado pode ser efetivamente creditado na conta.
 */
export default function MilesSimulator({ onSimulate, pending = false }) {
  const [amount, setAmount] = useState(800);
  const [multiplier, setMultiplier] = useState(1);

  const miles = useMemo(() => Math.round(amount * multiplier), [amount, multiplier]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!onSimulate || miles <= 0) return;
    onSimulate({
      amount: miles,
      description: `Simulação de compra de ${formatCurrency(amount)} (${multiplier}x)`,
    });
  }

  return (
    <form className={styles.wrap} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="sim-amount">Valor da compra</label>
        <div className={styles.currencyInput}>
          <span>R$</span>
          <input
            id="sim-amount"
            type="number"
            min="0"
            step="10"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value) || 0)}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="sim-multiplier">Milhas por real</label>
        <div className={styles.multipliers} id="sim-multiplier">
          {MULTIPLIERS.map((m) => (
            <button
              key={m}
              type="button"
              className={`${styles.multiplierBtn} ${multiplier === m ? styles.multiplierActive : ""}`}
              onClick={() => setMultiplier(m)}
            >
              {m}x
            </button>
          ))}
        </div>
      </div>

      <div className={styles.result}>
        <div className={styles.equation}>
          <span className="board-number">{formatCurrency(amount)}</span>
          <span className={styles.operator}>×</span>
          <span className="board-number">{multiplier} milhas/R$</span>
        </div>
        <div className={styles.resultValue}>
          <span className={`board-number ${styles.resultNumber}`}>{formatMiles(miles)}</span>
          <span className={styles.resultLabel}>milhas simuladas</span>
        </div>
      </div>

      {onSimulate && (
        <Button type="submit" loading={pending} disabled={miles <= 0}>
          Creditar milhas simuladas
        </Button>
      )}
    </form>
  );
}
