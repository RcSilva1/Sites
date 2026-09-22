import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BRAND_NAME } from "../data/brand";
import { ROUTES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../firebase/auth";
import { useToast } from "../hooks/useToast";
import styles from "./Navbar.module.css";

const PUBLIC_LINKS = [
  { to: ROUTES.home, label: "Início" },
  { to: ROUTES.howItWorks, label: "Como funciona" },
];

const PRIVATE_LINKS = [
  { to: ROUTES.dashboard, label: "Painel" },
  { to: ROUTES.redeem, label: "Resgatar" },
  { to: ROUTES.history, label: "Histórico" },
  { to: ROUTES.profile, label: "Perfil" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const links = isAuthenticated ? [...PUBLIC_LINKS, ...PRIVATE_LINKS] : PUBLIC_LINKS;

  async function handleLogout() {
    await logoutUser();
    showToast("Sessão encerrada", { type: "info" });
    setOpen(false);
    navigate(ROUTES.home);
  }

  return (
    <header className={styles.header}>
      <div className={`${styles.bar} container`}>
        <Link to={ROUTES.home} className={styles.brand} onClick={() => setOpen(false)}>
          {BRAND_NAME}
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="primary-navigation"
          aria-label="Abrir menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav id="primary-navigation" className={`${styles.nav} ${open ? styles.navOpen : ""}`}>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === ROUTES.home}
                  className={({ isActive }) => (isActive ? styles.active : undefined)}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <button type="button" className={styles.logout} onClick={handleLogout}>
                Sair
              </button>
            ) : (
              <>
                <Link to={ROUTES.login} className={styles.loginLink} onClick={() => setOpen(false)}>
                  Entrar
                </Link>
                <Link to={ROUTES.register} className={styles.cta} onClick={() => setOpen(false)}>
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
