const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fechaHoy() {
  const d = new Date();
  return `Santa Cruz de la Sierra, ${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
}

export async function generarPDF({ form, filas }) {
  const { jsPDF } = await import('jspdf');
  const { nombre, registro, celular, director, semestre } = form;
  const nombreVal   = nombre ? nombre.toUpperCase() : '________________________';
  const registroVal = registro || '________________________';
  const celularVal  = celular  || '________________________';
  const directorVal = director || 'Ing. Marín Condori';

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const marginX = 60;
  let y = 70;

  doc.setFont('times', 'normal'); doc.setFontSize(11);
  doc.text(fechaHoy(), marginX, y); y += 34;
  doc.text('Señor:', marginX, y); y += 16;
  doc.setFont('times', 'bold');
  doc.text(directorVal, marginX, y); y += 16;
  doc.text('DIRECTOR DE CARRERA INGENIERÍA AGRONÓMICA', marginX, y); y += 16;
  doc.text('-UAGRM', marginX, y); y += 16;
  doc.setFont('times', 'normal');
  doc.text('Presente.-', marginX, y); y += 30;

  doc.setFont('times', 'bold');
  doc.text(`Ref.: SOLICITUD INSCRIPCIÓN COMO CASOS ESPECIALES SEMESTRE ${semestre}/2026`, marginX, y, { maxWidth: 480 });
  y += 34;

  doc.setFont('times', 'normal');
  doc.text('Distinguido Ing.:', marginX, y); y += 22;

  const parrafo = `De acuerdo al reglamento general de inscripción de la U.A.G.R.M. aprobado mediante Resolución Vicerrectoral 20/2010, solicito a usted autorizar al CENTRO DE PROCESAMIENTO DE DATOS FACULTATIVO CPD-FAFCP, las inscripciones de las materias como CASOS ESPECIALES semestre ${semestre}/2026, de acuerdo al siguiente detalle adjunto:`;
  const lineas = doc.splitTextToSize(parrafo, 480);
  doc.text(lineas, marginX, y); y += lineas.length * 14 + 16;

  // Tabla con alturas dinámicas
  const filasReales = filas.filter(Boolean);
  const FS = 11;           // font size para celdas
  const LINE_H = 13;       // altura por línea de texto
  const PAD = 8;           // padding vertical por celda

  // anchos de columna: N° | Prereq nombre | Prereq sigla | Materia | Sigla-Grupo
  const colW = [22, 148, 90, 136, 84];
  const colX = colW.reduce((acc, w, i) => { acc.push(i === 0 ? marginX : acc[i-1] + colW[i-1]); return acc; }, []);
  const tableW = colW.reduce((a, b) => a + b, 0);
  const headers = ['N°', 'Materia prerrequisito', 'Sigla', 'Materia a inscribir', 'Sigla-Grupo'];

  // Encabezado
  const headerH = LINE_H + PAD;
  doc.setFont('times', 'bold'); doc.setFontSize(11);
  doc.rect(marginX, y, tableW, headerH);
  colX.forEach((x, i) => {
    if (i > 0) doc.line(x, y, x, y + headerH);
    doc.text(headers[i], x + 4, y + PAD / 2 + 9);
  });
  y += headerH;

  // Filas de datos con altura dinámica
  doc.setFont('times', 'normal'); doc.setFontSize(FS);
  filasReales.forEach((f, i) => {
    const siglaGrupo = `${f.sigla}${f.grupo ? ' - ' + f.grupo : ''}`;
    const cells = [
      String(i + 1),
      doc.splitTextToSize(f.prereqNombres, colW[1] - 8),
      doc.splitTextToSize(f.prereqSiglas,  colW[2] - 8),
      doc.splitTextToSize(f.nombre,        colW[3] - 8),
      doc.splitTextToSize(siglaGrupo,      colW[4] - 4),
    ];
    const maxLines = Math.max(...cells.map(c => Array.isArray(c) ? c.length : 1));
    const rowH = maxLines * LINE_H + PAD;

    doc.rect(marginX, y, tableW, rowH);
    colX.forEach((x, j) => {
      if (j > 0) doc.line(x, y, x, y + rowH);
      doc.text(cells[j], x + 4, y + PAD / 2 + LINE_H * 0.75);
    });
    y += rowH;
  });
  y += 24;

  doc.setFontSize(11);
  const parrafo2 = 'Una vez llenada y firmada la presente solicitud doy conformidad a mi solicitud adjuntando fotocopia de mi cédula de identidad.';
  const lineas2 = doc.splitTextToSize(parrafo2, 480);
  doc.text(lineas2, marginX, y); y += lineas2.length * 14 + 20;

  doc.text('Atentamente.-', marginX, y); y += 44;

  doc.setFont('times', 'bold');
  doc.text(`NOMBRE: ${nombreVal}`,   marginX, y); y += 18;
  doc.text(`REGISTRO: ${registroVal}`, marginX, y); y += 18;
  doc.text(`CELULAR: ${celularVal}`,  marginX, y); y += 28;

  doc.setFont('times', 'normal'); doc.setFontSize(9);
  doc.text('CC/Arch.', marginX, y);

  const archivo = (nombre ? nombre.replace(/\s+/g, '_') : 'caso_especial') + '.pdf';
  doc.save(archivo);
}
