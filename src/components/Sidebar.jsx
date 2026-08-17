import { NavLink } from 'react-router-dom';
import logo from '../assets/logo1.jpeg';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { to: '/',                 icon: '🏠', label: 'Inicio' },
  { to: '/casos-especiales', icon: '📄', label: 'Casos Especiales' },
  { to: '/plan-estudio',     icon: '📚', label: 'Plan de Estudio' },
  { to: '/horarios',         icon: '🗓️', label: 'Horarios', soon: true },
  { to: '/noticias',         icon: '📢', label: 'Noticias' },
];

export default function Sidebar({ open, mobileOpen, onToggle, onMobileClose }) {
  return (
    <aside
      className={`${styles.sidebar} ${open ? styles.expanded : styles.collapsed} ${mobileOpen ? styles.mobileVisible : ''}`}
      aria-label="Menú de navegación"
    >
      {/* Botón colapsar — solo desktop */}
      <button
        className={styles.toggle}
        onClick={onToggle}
        title={open ? 'Colapsar menú' : 'Expandir menú'}
        aria-label={open ? 'Colapsar menú' : 'Expandir menú'}
      >
        {open ? '◀' : '▶'}
      </button>

      <div className={styles.logoWrap}>
        <img src={logo} alt="Logo Unión Agronomía" className={styles.logo} />
        {(open || mobileOpen) && <span className={styles.brand}>Unión<br />Agronomía</span>}
      </div>

      <nav aria-label="Secciones principales">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ''} ${item.soon ? styles.soon : ''}`
            }
            onClick={item.soon ? e => e.preventDefault() : onMobileClose}
            aria-disabled={item.soon}
            aria-current={undefined}
            title={item.soon ? `${item.label} — próximamente` : item.label}
          >
            <span className={styles.icon} aria-hidden="true">{item.icon}</span>
            {(open || mobileOpen) && (
              <span className={styles.label}>
                {item.label}
                {item.soon && <span className={styles.badge} aria-label="Próximamente">Pronto</span>}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
