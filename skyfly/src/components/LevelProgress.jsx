import { formatMiles } from "../utils/formatters";
import styles from "./LevelProgress.module.css";

export default function LevelProgress({ current, next, progress, remaining }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.labels}>
        <span className={styles.currentLevel}>{current.name}</span>
        {next ? (
          <span className={styles.nextLevel}>Próximo: {next.name}</span>
        ) : (
          <span className={styles.nextLevel}>Nível máximo atingido</span>
        )}
      </div>

      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progresso para ${next ? next.name : "nível máximo"}`}
      >
        <div className={styles.fill} style={{ width: `${progress * 100}%` }} />
      </div>

      <p className={styles.remaining}>
        {next ? (
          <>
            <span className="board-number">{formatMiles(remaining)}</span> milhas restantes para {next.name}
          </>
        ) : (
          "Você alcançou o topo do programa Skyfly."
        )}
      </p>
    </div>
  );
}
