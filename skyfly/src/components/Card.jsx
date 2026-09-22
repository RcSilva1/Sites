import styles from "./Card.module.css";

export default function Card({ children, className = "", as: Component = "div", padded = true, ...props }) {
  const classes = [styles.card, padded ? styles.padded : "", className].filter(Boolean).join(" ");
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
