import { useState, useMemo } from 'react';
import { useMalla } from '../hooks/useMalla';
import styles from './PlanEstudio.module.css';

function buildDependientes(materias) {
  const dep = {};
  materias.forEach(m => { dep[m.sigla] = []; });
  materias.forEach(m => {
    m.prerrequisitos.forEach(p => { if (dep[p]) dep[p].push(m.sigla); });
  });
  return dep;
}

const AREA_LABEL = {
  instrumental:   'Básica Instrumental',
  especifica:     'Básica Específica',
  aplicada:       'Específica Aplicada',
  complementaria: 'Complementaria',
  conclusion:     'Conclusión',
};

export default function PlanEstudio() {
  const { malla, materiasPorSigla, semestres } = useMalla();
  const [selected, setSelected]     = useState(null);
  const [filtroArea, setFiltroArea] = useState(null);

  const dependientes = useMemo(() => buildDependientes(malla.materias), [malla]);

  const prereqsSet     = useMemo(() => new Set(selected ? materiasPorSigla[selected]?.prerrequisitos ?? [] : []), [selected, materiasPorSigla]);
  const dependientesSet = useMemo(() => new Set(selected ? dependientes[selected] ?? [] : []), [selected, dependientes]);

  function chipClass(m) {
    const classes = [styles.chip, styles[`area_${m.area}`]];

    if (selected) {
      if (m.sigla === selected)           classes.push(styles.chipSelected);
      else if (prereqsSet.has(m.sigla))   classes.push(styles.chipPrereq);
      else if (dependientesSet.has(m.sigla)) classes.push(styles.chipDep);
      else                                classes.push(styles.chipDimmed);
    } else if (filtroArea) {
      if (m.area !== filtroArea)          classes.push(styles.chipDimmed);
    }

    return classes.join(' ');
  }

  function handleChip(sigla) {
    setSelected(prev => prev === sigla ? null : sigla);
    setFiltroArea(null);
  }

  function handleAreaFilter(area) {
    setFiltroArea(prev => prev === area ? null : area);
    setSelected(null);
  }

  const totalPorArea = useMemo(() => {
    const counts = {};
    malla.materias.forEach(m => { counts[m.area] = (counts[m.area] ?? 0) + 1; });
    return counts;
  }, [malla]);

  const selectedMateria = selected ? materiasPorSigla[selected] : null;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Plan de Estudio</h1>
          <p className={styles.pageMeta}>
            {malla.carrera} · Plan {malla.plan} · Resolución {malla.resolucion} · {malla.materias.length} materias
          </p>
        </div>
      </div>

      {/* Filtros por área */}
      <div className={styles.filtros}>
        {malla.areas.map(a => (
          <button
            key={a.id}
            className={`${styles.filtroBtn} ${styles[`area_${a.id}`]} ${filtroArea === a.id ? styles.filtroBtnActive : ''}`}
            onClick={() => handleAreaFilter(a.id)}
          >
            {AREA_LABEL[a.id]}
            <span className={styles.filtroCount}>{totalPorArea[a.id] ?? 0}</span>
          </button>
        ))}
        {(filtroArea || selected) && (
          <button className={styles.filtroClear} onClick={() => { setFiltroArea(null); setSelected(null); }}>
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* Info de materia seleccionada */}
      {selectedMateria && (
        <div className={styles.infoBox}>
          <div className={styles.infoMain}>
            <span className={`${styles.infoSigla} ${styles[`area_${selectedMateria.area}`]}`}>{selectedMateria.sigla}</span>
            <strong>{selectedMateria.nombre}</strong>
            <span className={styles.infoSem}>Semestre {selectedMateria.semestre}</span>
            {selectedMateria.electiva && <span className={styles.infoElectiva}>{selectedMateria.electiva}</span>}
          </div>
          <div className={styles.infoRelaciones}>
            {prereqsSet.size > 0 && (
              <span className={styles.infoPrereq}>
                ↑ Requiere: {[...prereqsSet].map(p => materiasPorSigla[p]?.nombre).join(', ')}
              </span>
            )}
            {dependientesSet.size > 0 && (
              <span className={styles.infoDep}>
                ↓ Habilita: {[...dependientesSet].map(p => materiasPorSigla[p]?.nombre).join(', ')}
              </span>
            )}
            {prereqsSet.size === 0 && <span className={styles.infoNeutral}>Sin prerrequisitos</span>}
          </div>
        </div>
      )}

      {/* Malla */}
      <div className={styles.mallaWrapper}>
        <div className={styles.malla}>
          {semestres.map(sem => (
            <div key={sem} className={styles.col}>
              <div className={styles.semLabel}>
                {malla.semestresEspeciales?.[sem] ?? `${sem}° SEM`}
              </div>
              {malla.materias.filter(m => m.semestre === sem).map(m => (
                <button
                  key={m.sigla}
                  className={chipClass(m)}
                  onClick={() => handleChip(m.sigla)}
                  title={`${m.sigla} — ${m.nombre}`}
                >
                  <span className={styles.chipSigla}>{m.sigla}</span>
                  <span className={styles.chipNombre}>{m.nombre}</span>
                  {m.electiva && <span className={styles.chipElectiva}>E</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Leyenda */}
      <div className={styles.leyenda}>
        {malla.areas.map(a => (
          <span key={a.id} className={styles.leyendaItem}>
            <i className={`${styles.swatch} ${styles[`area_${a.id}`]}`} />
            {AREA_LABEL[a.id]} ({totalPorArea[a.id]})
          </span>
        ))}
        <span className={styles.leyendaItem}>
          <i className={styles.swatchE}>E</i> Electiva
        </span>
      </div>

      {!selected && !filtroArea && (
        <p className={styles.hint}>Hacé click en cualquier materia para ver sus correlativas.</p>
      )}
    </div>
  );
}
