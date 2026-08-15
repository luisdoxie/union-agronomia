import { useState } from 'react';
import styles from './FormularioCaso.module.css';

function PrereqDisplay({ sigla, materiasPorSigla }) {
  if (!sigla) return <span className={styles.muted}>Elegí una materia para ver su prerrequisito</span>;
  const m = materiasPorSigla[sigla];
  if (!m || m.prerrequisitos.length === 0) return <span className={styles.muted}>Esta materia no tiene prerrequisito registrado</span>;
  return m.prerrequisitos.map(p => {
    const pm = materiasPorSigla[p];
    return (
      <span key={p}>
        <span className={styles.tag}>{pm.sigla}</span>
        {pm.nombre}
        <br />
      </span>
    );
  });
}

function MateriaBlock({ n, malla, materiasPorSigla, value, grupo, onMateriaChange, onGrupoChange }) {
  const optional = n > 1;
  return (
    <div className={styles.materiaBlock}>
      <span className={styles.num}>{n}</span>
      <label>Materia a inscribir{optional ? ' (opcional)' : ''}</label>
      <select value={value} onChange={e => onMateriaChange(e.target.value)}>
        {optional && <option value="">— Ninguna —</option>}
        {!optional && <option value="">Seleccioná una materia</option>}
        {malla.materias
          .filter(m => m.prerrequisitos.length > 0)
          .map(m => (
            <option key={m.sigla} value={m.sigla}>
              {m.nombre} ({m.sigla})
            </option>
          ))}
      </select>
      <div className={styles.prereqDisplay}>
        <PrereqDisplay sigla={value} materiasPorSigla={materiasPorSigla} />
      </div>
      <label>Grupo a inscribir</label>
      <input type="text" value={grupo} onChange={e => onGrupoChange(e.target.value)} placeholder="Ej. A" />
    </div>
  );
}

export default function FormularioCaso({ form, onFormChange, materias, onMateriaChange, malla, materiasPorSigla }) {
  const [cantidad, setCantidad] = useState(null);

  const field = key => ({
    value: form[key],
    onChange: e => onFormChange(key, e.target.value),
  });

  return (
    <>
      <div className={styles.panel}>
        <h2 className={styles.heading}>1 · Tus datos</h2>
        <p className={styles.sub}>Se completan directo en la carta, a la derecha.</p>
        <label>Nombre completo</label>
        <input type="text" placeholder="Ej. Luis Miguel Pérez Rojas" {...field('nombre')} />
        <div className={styles.row2}>
          <div>
            <label>Registro</label>
            <input type="text" placeholder="Ej. 220012345" {...field('registro')} />
          </div>
          <div>
            <label>Celular</label>
            <input type="tel" placeholder="Ej. 70012345" {...field('celular')} />
          </div>
        </div>
        <div className={styles.row2}>
          <div>
            <label>Director de Carrera</label>
            <input type="text" {...field('director')} />
          </div>
          <div>
            <label>Semestre del trámite</label>
            <select {...field('semestre')}>
              <option value="I">I/2026</option>
              <option value="II">II/2026</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <h2 className={styles.heading}>2 · Materias a inscribir como caso especial</h2>
        <p className={styles.sub}>¿Cuántas materias vas a solicitar?</p>

        <div className={styles.cantidadBtns}>
          {[1, 2, 3].map(n => (
            <button
              key={n}
              className={`${styles.cantidadBtn} ${cantidad === n ? styles.cantidadBtnActive : ''}`}
              onClick={() => setCantidad(n)}
            >
              {n} materia{n > 1 ? 's' : ''}
            </button>
          ))}
        </div>

        {cantidad && (
          <div className={styles.bloques}>
            {Array.from({ length: cantidad }, (_, i) => i + 1).map(n => (
              <MateriaBlock
                key={n}
                n={n}
                malla={malla}
                materiasPorSigla={materiasPorSigla}
                value={materias[n].sigla}
                grupo={materias[n].grupo}
                onMateriaChange={v => onMateriaChange(n, 'sigla', v)}
                onGrupoChange={v => onMateriaChange(n, 'grupo', v)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
