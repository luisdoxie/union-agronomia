import styles from './MallaInteractiva.module.css';

const AREA_CLASS = {
  instrumental:   styles.instrumental,
  especifica:     styles.especifica,
  aplicada:       styles.aplicada,
  complementaria: styles.complementaria,
  conclusion:     styles.conclusion,
};

export default function MallaInteractiva({ malla, semestres, aprobadas, onToggle }) {
  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>2 · Marca tus materias aprobadas</h2>
      <p className={styles.sub}>Tocá cada materia que ya venciste.</p>
      <div className={styles.avance}>
        {aprobadas.size} materia{aprobadas.size !== 1 ? 's' : ''} marcada{aprobadas.size !== 1 ? 's' : ''}
      </div>

      <div className={styles.grid}>
        {semestres.map(sem => (
          <div key={sem} className={styles.col}>
            <div className={styles.semLabel}>{sem}° SEM</div>
            {malla.materias.filter(m => m.semestre === sem).map(m => (
              <button
                key={m.sigla}
                className={`${styles.chip} ${AREA_CLASS[m.area]} ${aprobadas.has(m.sigla) ? styles.aprobada : ''}`}
                onClick={() => onToggle(m.sigla)}
                title={m.sigla}
              >
                <span className={styles.sigla}>{m.sigla}</span>
                {m.nombre}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className={styles.leyenda}>
        {malla.areas.map(a => (
          <span key={a.id} className={styles.leyendaItem}>
            <i className={`${styles.swatch} ${AREA_CLASS[a.id]}`} />
            {a.nombre.replace('Área ', '')}
          </span>
        ))}
      </div>
    </div>
  );
}
