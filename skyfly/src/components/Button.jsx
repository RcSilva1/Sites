import styles from "./Button.module.css";

/**
 * variant: "primary" | "secondary" | "ghost" | "danger"
 * as: permite renderizar como <a> (ex.: variant="primary" as="a" href="...")
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  as = "button",
  className = "",
  ...props
}) {
  const Component = as;
  const classes = [styles.button, styles[variant], styles[size], className].filter(Boolean).join(" ");

  return (
    <Component
      className={classes}
      type={as === "button" ? type : undefined}
      disabled={as === "button" ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      <span className={loading ? styles.labelLoading : undefined}>{children}</span>
    </Component>
  );
}
