import { useEffect, useRef, useState } from "react";
import { formatMiles } from "../utils/formatters";
import styles from "./MilesBalance.module.css";

/**
 * Mostra o saldo de milhas com uma contagem animada até o valor final,
 * no estilo dos painéis de embarque de aeroporto (números tabulares em
 * fonte monoespaçada). A animação roda uma vez quando `value` muda.
 */
export default function MilesBalance({ value, label = "Milhas", size = "lg" }) {
  const [display, setDisplay] = useState(0);
  const frame = useRef(null);
  const previous = useRef(0);

  useEffect(() => {
    const from = previous.current;
    const to = value || 0;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        previous.current = to;
      }
    }

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={`${styles.wrap} ${styles[size]}`}>
      <span className={`${styles.number} board-number`} aria-hidden="true">
        {formatMiles(display)}
      </span>
      <span className={styles.label}>{label}</span>
      <span className="visually-hidden">{formatMiles(value)} milhas</span>
    </div>
  );
}
