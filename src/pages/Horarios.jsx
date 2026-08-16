import { useState, useMemo } from 'react';
import horarios from '../data/horarios_agronomia.json';
import styles from './Horarios.module.css';

const DIAS = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
const AREA_COLOR = {
  instrumental:   '#B7E1A4',
  especifica:     '#FCE5A0',
  aplicada:       '#F6C9DD',
  complementaria: '#C6CFE6',
  conclusion:     '#F7F27A',
};

function siglaBase(s) { return s.split('-')[0]; }

function formatHora(h) { return h; }

export default function Horarios() {
  const [semestre, setSemestre] = useState(1);
  const [grupo, setGrupo]       = useState('A');
  const [verDia, setVerDia]     = useState(null); // null = todos

  const semData = useMemo(
    () => horarios.semestres.find(s => s.semestre === semestre),
    [semestre]
  );

  const grupos = useMemo(
    () => semData?.grupos.map(g => g.grupo) ?? [],
    [semData]
  );

  const grupoData = useMemo(
    () => semData?.grupos.find(g => g.grupo === grupo),
    [semData, grupo]
  );

  // Cuando cambia semestre, resetear grupo al primero disponible
  function handleSemestre(s) {
    setSemestre(s);
    const gps = horarios.semestres.find(x => x.semestre === s)?.grupos.map(g => g.grupo) ?? [];
    setGrupo(gps[0] ?? 'A');
    setVerDia(null);
  }

  const diasConClases = useMemo(() => {
    if (!grupoData) return [];
    return DIAS.filter(d => grupoData.clases.some(c => c.dia === d));
  }, [grupoData]);

  const diasMostrar = verDia ? [verDia] : diasConClases;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Horarios</h1>
          <p className={styles.pageMeta}>
            {horarios.carrera} · Gestión {horarios.gestion} · Plan {horarios.plan}
          </p>
        </div>
      </div>

      {/* Filtros semestre */}
      <div className={styles.filtrosRow}>
        <div className={styles.filtroGroup}>
          <span className={styles.filtroLabel}>Semestre</span>
          <div className={styles.semBtns}>
            {horarios.semestres.map(s => (
              <button
                key={s.semestre}
                className={`${styles.semBtn} ${semestre === s.semestre ? styles.semBtnActive : ''}`}
                onClick={() => handleSemestre(s.semestre)}
              >
                {s.semestre}°
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filtroGroup}>
          <span className={styles.filtroLabel}>Grupo</span>
          <div className={styles.semBtns}>
            {grupos.map(g => (
              <button
                key={g}
                className={`${styles.semBtn} ${grupo === g ? styles.semBtnActive : ''}`}
                onClick={() => setGrupo(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filtroGroup}>
          <span className={styles.filtroLabel}>Día</span>
          <div className={styles.semBtns}>
            <button
              className={`${styles.semBtn} ${!verDia ? styles.semBtnActive : ''}`}
              onClick={() => setVerDia(null)}
            >
              Todos
            </button>
            {diasConClases.map(d => (
              <button
                key={d}
                className={`${styles.semBtn} ${verDia === d ? styles.semBtnActive : ''}`}
                onClick={() => setVerDia(d)}
              >
                {d.charAt(0) + d.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Docentes del grupo */}
      {grupoData && (
        <div className={styles.docentesBox}>
          {Object.entries(grupoData.materias).map(([sigla, info]) => (
            <div key={sigla} className={styles.docenteChip}>
              <span className={styles.docenteSigla}>{sigla}</span>
              <span className={styles.docenteNombre}>{info.docente}</span>
            </div>
          ))}
        </div>
      )}

      {/* Grilla por día */}
      {grupoData && (
        <div className={styles.diasWrap}>
          {diasMostrar.map(dia => {
            const clases = grupoData.clases
              .filter(c => c.dia === dia && c.inicio && c.fin)
              .sort((a, b) => a.inicio.localeCompare(b.inicio));

            return (
              <div key={dia} className={styles.diaCol}>
                <div className={styles.diaHeader}>{dia.charAt(0) + dia.slice(1).toLowerCase()}</div>
                {clases.map((c, i) => {
                  const base = siglaBase(c.materia_sigla);
                  const info = grupoData.materias[base];
                  const esLab = c.materia_sigla.includes('-');
                  const esAux = base.toUpperCase().includes('AUXILIAT');
                  return (
                    <div key={i} className={`${styles.clase} ${esLab ? styles.claseLab : ''} ${esAux ? styles.claseAux : ''}`}>
                      <div className={styles.claseHora}>{c.inicio} – {c.fin}</div>
                      <div className={styles.claseSigla}>{esAux ? 'AUX' : c.materia_sigla}</div>
                      <div className={styles.claseNombre}>{esAux ? 'Auxiliatura' : (info?.materia ?? base)}</div>
                      {c.aula && <div className={styles.claseAula}>{c.aula}</div>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
