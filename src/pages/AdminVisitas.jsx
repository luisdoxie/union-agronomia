import { useState } from 'react';
import styles from './AdminVisitas.module.css';

const BLOQUES = [
  { key: 'hoy', label: 'Hoy' },
  { key: 'semana', label: 'Últimos 7 días' },
  { key: 'total', label: 'Total histórico' },
];

export default function AdminVisitas() {
  const [clave, setClave] = useState('');
  const [status, setStatus] = useState('idle'); // idle | cargando | ok | error
  const [datos, setDatos] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clave.trim() || status === 'cargando') return;

    setStatus('cargando');
    try {
      const res = await fetch('/api/visitas', {
        method: 'GET',
        headers: { 'x-admin-key': clave.trim() },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error desconocido');

      setDatos(data);
      setStatus('ok');
    } catch {
      setDatos(null);
      setStatus('error');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Visitas del sitio</h1>
        <p className={styles.pageMeta}>Estadísticas privadas de tráfico. No compartir el acceso.</p>
      </div>

      <form className={styles.panel} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="clave">Clave de acceso</label>
        <input
          id="clave"
          type="password"
          className={styles.input}
          value={clave}
          onChange={e => setClave(e.target.value)}
          autoComplete="off"
        />

        <button type="submit" className={styles.btnVer} disabled={status === 'cargando'}>
          {status === 'cargando' ? 'Consultando...' : 'Ver estadísticas'}
        </button>

        {status === 'error' && <p className={styles.err}>⚠️ Clave inválida o error al consultar.</p>}
      </form>

      {status === 'ok' && datos && (
        <div className={styles.grid}>
          {BLOQUES.map(b => (
            <div key={b.key} className={styles.card}>
              <h2 className={styles.cardLabel}>{b.label}</h2>
              <p className={styles.cardValue}>{datos[b.key].total}</p>
              <p className={styles.cardSub}>pageviews</p>
              <p className={styles.cardValue}>{datos[b.key].unicos}</p>
              <p className={styles.cardSub}>visitantes únicos</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
