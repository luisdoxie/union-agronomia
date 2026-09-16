import styles from './AdminVisitasPanel.module.css';
import adminStyles from './Admin.module.css';

const BLOQUES = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'semana', label: 'Últimos 7 días' },
  { key: 'total', label: 'Total histórico' },
];

export default function AdminVisitasPanel({ datos, onVolver }) {
  return (
    <div className={adminStyles.page}>
      <button type="button" className={adminStyles.volver} onClick={onVolver}>‹ Volver</button>

      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Visitas del sitio</h1>
        <p className={adminStyles.pageMeta}>Estadísticas privadas de tráfico. No compartir el acceso.</p>
      </div>

      <div className={styles.grid}>
        {BLOQUES.map(b => (
          <div key={b.key} className={styles.card}>
            <h2 className={styles.cardLabel}>{b.label}</h2>
            <p className={styles.cardValue}>{datos[b.key].total}</p>
            <p className={styles.cardSub}>cargas de página</p>
            <p className={styles.cardValue}>{datos[b.key].unicos}</p>
            <p className={styles.cardSub}>visitantes únicos</p>
          </div>
        ))}
      </div>
    </div>
  );
}
