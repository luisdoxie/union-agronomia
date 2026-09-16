import { useState } from 'react';
import styles from './Admin.module.css';
import AdminVisitasPanel from './AdminVisitasPanel';
import AdminBuzonPanel from './AdminBuzonPanel';

export default function Admin() {
  const [clave, setClave] = useState('');
  const [status, setStatus] = useState('idle'); // idle | cargando | error
  const [vista, setVista] = useState(null); // null | 'visitas' | 'buzon'
  const [datosVisitas, setDatosVisitas] = useState(null);
  const [mensajesBuzon, setMensajesBuzon] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const claveIngresada = clave.trim();
    if (!claveIngresada || status === 'cargando') return;

    setStatus('cargando');
    try {
      const resVisitas = await fetch('/api/visitas', {
        method: 'GET',
        headers: { 'x-admin-key': claveIngresada },
      });
      const dataVisitas = await resVisitas.json();
      if (resVisitas.ok && dataVisitas.ok) {
        setDatosVisitas(dataVisitas);
        setVista('visitas');
        setStatus('idle');
        return;
      }

      const resBuzon = await fetch('/api/buzon', {
        method: 'GET',
        headers: { 'x-admin-key': claveIngresada },
      });
      const dataBuzon = await resBuzon.json();
      if (resBuzon.ok && dataBuzon.ok) {
        setMensajesBuzon(dataBuzon.mensajes);
        setVista('buzon');
        setStatus('idle');
        return;
      }

      setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  function volver() {
    setVista(null);
    setClave('');
    setStatus('idle');
    setDatosVisitas(null);
    setMensajesBuzon(null);
  }

  if (vista === 'visitas') {
    return <AdminVisitasPanel datos={datosVisitas} onVolver={volver} />;
  }

  if (vista === 'buzon') {
    return <AdminBuzonPanel mensajesIniciales={mensajesBuzon} clave={clave} onVolver={volver} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Acceso privado</h1>
        <p className={styles.pageMeta}>Área restringida. No compartir el acceso.</p>
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
          {status === 'cargando' ? 'Verificando...' : 'Entrar'}
        </button>

        {status === 'error' && <p className={styles.err}>⚠️ Clave inválida.</p>}
      </form>
    </div>
  );
}
