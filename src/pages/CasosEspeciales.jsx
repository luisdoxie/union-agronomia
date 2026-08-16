import { useState, useMemo } from 'react';
import { useMalla } from '../hooks/useMalla';
import FormularioCaso from '../components/FormularioCaso';
import VistaPreviaCarta from '../components/VistaPreviaCarta';
import { generarPDF } from '../services/pdfService';
import styles from './CasosEspeciales.module.css';

const FORM_INIT = {
  nombre: '',
  registro: '',
  celular: '',
  director: 'Ing. Marín Condori',
  semestre: 'II',
};

const MATERIAS_INIT = {
  1: { sigla: '', grupo: '' },
  2: { sigla: '', grupo: '' },
  3: { sigla: '', grupo: '' },
};

export default function CasosEspeciales() {
  const { malla, materiasPorSigla } = useMalla();
  const [form, setForm] = useState(FORM_INIT);
  const [materias, setMaterias] = useState(MATERIAS_INIT);

  function handleFormChange(key, value) {
    setForm(prev => ({ ...prev, [key]: key === 'nombre' ? value.toUpperCase() : value }));
  }

  function handleMateriaChange(n, key, value) {
    setMaterias(prev => ({ ...prev, [n]: { ...prev[n], [key]: key === 'grupo' ? value.toUpperCase() : value } }));
  }

  const filas = useMemo(() => [1, 2, 3].map(n => {
    const { sigla, grupo } = materias[n];
    const m = materiasPorSigla[sigla];
    if (!m) return null;
    return {
      nombre: m.nombre,
      sigla: m.sigla,
      grupo,
      prereqNombres: m.prerrequisitos.map(p => materiasPorSigla[p]?.nombre ?? p).join(' / '),
      prereqSiglas: m.prerrequisitos.join(' / '),
    };
  }), [materias, materiasPorSigla]);

  const puedeGenerar = filas[0] !== null;

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        <div>
          <FormularioCaso
            form={form}
            onFormChange={handleFormChange}
            materias={materias}
            onMateriaChange={handleMateriaChange}
            malla={malla}
            materiasPorSigla={materiasPorSigla}
          />
        </div>

        <div className={styles.previewCol}>
          <div className={styles.previewHeader}>
            <h2>Vista previa de tu carta</h2>
          </div>
          <VistaPreviaCarta form={form} filas={filas} />
          <button
            className={styles.btnPDF}
            disabled={!puedeGenerar}
            onClick={() => generarPDF({ form, filas })}
          >
            Descargar carta en PDF
          </button>
          <p className={styles.hint}>Se descarga lista para imprimir, firmar y adjuntar fotocopia de C.I.</p>
        </div>
      </div>

      {/* Nota de documentos — fuera del grid, ancho propio */}
      <div className={styles.docsNota}>
        <div className={styles.docsNotaIcono}>📋</div>
        <div>
          <p className={styles.docsNotaTitulo}>Documentos requeridos para tramitar el Caso Especial</p>
          <ol className={styles.docsLista}>
            <li>Carta dirigida al Director de Carrera <span className={styles.docsTag}>generada aquí</span></li>
            <li>Avance Académico <span className={styles.docsTag}>generado del perfil</span></li>
            <li>Boleta de Inscripción del semestre en curso</li>
            <li>Fotocopia de Cédula de Identidad</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
