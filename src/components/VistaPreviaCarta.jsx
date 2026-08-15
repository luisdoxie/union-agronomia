import styles from './VistaPreviaCarta.module.css';

const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fechaHoy() {
  const d = new Date();
  return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

function ph(v, placeholder) {
  return v && v.trim() ? v : <span className={styles.placeholder}>{placeholder}</span>;
}

function FilaMateria({ fila, idx }) {
  if (!fila) return (
    <tr>
      <td>{idx + 1}</td>
      <td colSpan="4" className={styles.placeholder}>—</td>
    </tr>
  );
  return (
    <tr>
      <td>{idx + 1}</td>
      <td>{fila.prereqNombres}</td>
      <td>{fila.prereqSiglas}</td>
      <td>{fila.nombre}</td>
      <td>{fila.sigla}{fila.grupo ? ` - ${fila.grupo}` : ''}</td>
    </tr>
  );
}

export default function VistaPreviaCarta({ form, filas }) {
  const { nombre, registro, celular, director, semestre } = form;

  return (
    <div className={styles.doc}>
      <p className={styles.fecha}>Santa Cruz de la Sierra, {fechaHoy()}</p>

      <p className={styles.dest}>
        Señor:<br />
        <strong>{ph(director, 'Ing. Marín Condori')}</strong><br />
        <strong>DIRECTOR DE CARRERA INGENIERÍA AGRONÓMICA</strong><br />
        <strong>-UAGRM</strong><br />
        Presente.-
      </p>

      <p className={styles.ref}>
        Ref.: SOLICITUD INSCRIPCIÓN COMO CASOS ESPECIALES SEMESTRE {semestre}/2026
      </p>

      <p>Distinguido Ing.:</p>
      <p style={{ textIndent: '24px' }}>
        De acuerdo al reglamento general de inscripción de la U.A.G.R.M. aprobado mediante Resolución
        Vicerrectoral 20/2010, solicito a usted autorizar al CENTRO DE PROCESAMIENTO DE DATOS
        FACULTATIVO CPD-FAFCP, las inscripciones de las materias como CASOS ESPECIALES
        semestre {semestre}/2026, de acuerdo al siguiente detalle adjunto:
      </p>

      <table>
        <thead>
          <tr>
            <th>N°</th>
            <th>Materia prerrequisito</th>
            <th>Sigla</th>
            <th>Materia a inscribir</th>
            <th>Sigla - Grupo</th>
          </tr>
        </thead>
        <tbody>
          {filas.filter(Boolean).length === 0
            ? <tr><td colSpan="5" className={styles.placeholder}>Elegí al menos una materia</td></tr>
            : filas.filter(Boolean).map((fila, i) => <FilaMateria key={i} fila={fila} idx={i} />)
          }
        </tbody>
      </table>

      <p>Una vez llenada y firmada la presente solicitud doy conformidad a mi solicitud adjuntando fotocopia de mi cédula de identidad.</p>
      <p>Atentamente.-</p>

      <div className={styles.firma}>
        <strong>NOMBRE: {nombre ? nombre.toUpperCase() : <span className={styles.placeholder}>________________________</span>}</strong><br />
        <strong>REGISTRO: {ph(registro, '________________________')}</strong><br />
        <strong>CELULAR: {ph(celular, '________________________')}</strong>
      </div>

      <p style={{ marginTop: '18px', fontSize: '.72rem' }}>CC/Arch.</p>
    </div>
  );
}
