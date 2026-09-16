import { useState } from 'react';
import styles from './AdminBuzonPanel.module.css';
import adminStyles from './Admin.module.css';

const CATEGORIA_LABELS = {
  docente: 'Denuncia a un docente',
  auxiliar: 'Denuncia a un auxiliar',
  sugerencia: 'Sugerencia',
  otro: 'Otro',
};

const FILTROS = [
  { value: 'todas', label: 'Todas' },
  { value: 'docente', label: 'Docente' },
  { value: 'auxiliar', label: 'Auxiliar' },
  { value: 'sugerencia', label: 'Sugerencia' },
  { value: 'otro', label: 'Otro' },
];

const POR_PAGINA = 20;

function formatearFecha(iso) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminBuzonPanel({ mensajesIniciales, clave, onVolver }) {
  const [mensajes, setMensajes] = useState(mensajesIniciales);
  const [filtro, setFiltro] = useState('todas');
  const [pendientesId, setPendientesId] = useState(new Set());
  const [pagina, setPagina] = useState(1);

  async function toggleEstado(id, estadoActual) {
    const nuevoEstado = estadoActual === 'atendido' ? 'pendiente' : 'atendido';

    setPendientesId(prev => new Set(prev).add(id));
    setMensajes(prev => prev.map(m => (m.id === id ? { ...m, estado: nuevoEstado } : m)));

    try {
      const res = await fetch('/api/buzon', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': clave },
        body: JSON.stringify({ id, estado: nuevoEstado }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error desconocido');
    } catch {
      // revertir si falló
      setMensajes(prev => prev.map(m => (m.id === id ? { ...m, estado: estadoActual } : m)));
    } finally {
      setPendientesId(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  function handleFiltro(value) {
    setFiltro(value);
    setPagina(1);
  }

  const mensajesFiltrados = filtro === 'todas'
    ? mensajes
    : mensajes.filter(m => m.categoria === filtro);

  const totalPaginas = Math.max(1, Math.ceil(mensajesFiltrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas);
  const mensajesPagina = mensajesFiltrados.slice(
    (paginaActual - 1) * POR_PAGINA,
    paginaActual * POR_PAGINA,
  );

  return (
    <div className={adminStyles.page}>
      <button type="button" className={adminStyles.volver} onClick={onVolver}>‹ Volver</button>

      <div className={adminStyles.pageHeader}>
        <h1 className={adminStyles.pageTitle}>Denuncias del Buzón</h1>
        <p className={adminStyles.pageMeta}>Panel privado. No compartir el acceso.</p>
      </div>

      <div className={styles.filtros}>
        {FILTROS.map(f => (
          <button
            key={f.value}
            type="button"
            className={`${styles.filtroBtn} ${filtro === f.value ? styles.filtroBtnActivo : ''}`}
            onClick={() => handleFiltro(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {mensajesFiltrados.length === 0 && (
        <p className={styles.vacio}>No hay denuncias para este filtro.</p>
      )}

      <div className={styles.lista}>
        {mensajesPagina.map(m => (
          <div key={m.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.categoria}>{CATEGORIA_LABELS[m.categoria] || m.categoria}</span>
              <span className={styles.folio}>Folio: {m.id.slice(0, 8)}</span>
            </div>

            {m.materia && <p className={styles.materia}>Materia: {m.materia}</p>}

            <p className={styles.mensaje}>{m.mensaje}</p>

            <p className={styles.contacto}>
              {m.identificado
                ? `Identificado — Nombre: ${m.nombre || '(no indicado)'} · Contacto: ${m.contacto || '(no indicado)'}`
                : 'Enviado de forma anónima.'}
            </p>

            <div className={styles.cardFooter}>
              <span className={styles.fecha}>{formatearFecha(m.creado_en)}</span>
              <button
                type="button"
                className={`${styles.estadoBtn} ${m.estado === 'atendido' ? styles.estadoAtendido : styles.estadoPendiente}`}
                onClick={() => toggleEstado(m.id, m.estado)}
                disabled={pendientesId.has(m.id)}
              >
                {m.estado === 'atendido' ? '✓ Atendido' : 'Pendiente'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className={styles.paginacion}>
          <button
            type="button"
            className={styles.paginaBtn}
            onClick={() => setPagina(p => Math.max(1, p - 1))}
            disabled={paginaActual === 1}
          >
            ‹ Anterior
          </button>
          <span className={styles.paginaInfo}>Página {paginaActual} de {totalPaginas}</span>
          <button
            type="button"
            className={styles.paginaBtn}
            onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente ›
          </button>
        </div>
      )}
    </div>
  );
}
