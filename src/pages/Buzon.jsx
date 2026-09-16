import { useState } from 'react';
import styles from './Buzon.module.css';

const CATEGORIAS = [
  { value: 'docente',    label: 'Denuncia a un docente' },
  { value: 'auxiliar',   label: 'Denuncia a un auxiliar' },
  { value: 'sugerencia', label: 'Sugerencia' },
  { value: 'otro',       label: 'Otro' },
];

const FORM_INIT = {
  categoria: '',
  materia: '',
  mensaje: '',
  identificado: false,
  nombre: '',
  contacto: '',
  empresa: '', // honeypot
};

export default function Buzon() {
  const [form, setForm] = useState(FORM_INIT);
  const [status, setStatus] = useState('idle'); // idle | enviando | ok | error
  const [folio, setFolio] = useState(null);

  function field(key) {
    return {
      value: form[key],
      onChange: e => setForm(prev => ({ ...prev, [key]: e.target.value })),
    };
  }

  const puedeEnviar = form.categoria && form.mensaje.trim() && status !== 'enviando';

  async function handleSubmit(e) {
    e.preventDefault();
    if (!puedeEnviar) return;

    setStatus('enviando');
    try {
      const res = await fetch('/api/buzon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Error desconocido');

      setFolio(data.folio);
      setStatus('ok');
      setForm(FORM_INIT);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Buzón de Sugerencias y Reclamos</h1>
        <p className={styles.pageMeta}>
          Tu mensaje llega directo a la directiva de Unión Agronomía. Podés enviarlo de forma
          totalmente anónima, o identificarte si querés que te respondamos.
        </p>
      </div>

      <form className={styles.panel} onSubmit={handleSubmit}>
        <label className={styles.label} htmlFor="categoria">Tipo de mensaje</label>
        <select id="categoria" className={styles.select} {...field('categoria')} required>
          <option value="">Seleccioná una opción</option>
          {CATEGORIAS.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor="materia">Materia relacionada (opcional)</label>
        <input
          id="materia"
          type="text"
          className={styles.input}
          placeholder="Ej. Cálculo I"
          {...field('materia')}
        />

        <label className={styles.label} htmlFor="mensaje">Tu mensaje</label>
        <textarea
          id="mensaje"
          className={styles.textarea}
          placeholder="Contanos qué pasó, con el mayor detalle posible..."
          {...field('mensaje')}
          required
        />

        {/* Honeypot anti-spam: invisible para personas, si un bot lo llena se descarta el envío */}
        <input
          type="text"
          name="empresa"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className={styles.honeypot}
          {...field('empresa')}
        />

        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={form.identificado}
            onChange={e => setForm(prev => ({ ...prev, identificado: e.target.checked }))}
          />
          Quiero identificarme (opcional)
        </label>

        {form.identificado && (
          <div className={styles.identBlock}>
            <label className={styles.label} htmlFor="nombre">Nombre completo</label>
            <input id="nombre" type="text" className={styles.input} {...field('nombre')} />

            <label className={styles.label} htmlFor="contacto">Contacto (celular o correo)</label>
            <input id="contacto" type="text" className={styles.input} {...field('contacto')} />
          </div>
        )}

        <button type="submit" className={styles.btnEnviar} disabled={!puedeEnviar}>
          {status === 'enviando' ? 'Enviando...' : 'Enviar mensaje'}
        </button>

        {status === 'ok' && (
          <p className={styles.ok}>
            ✅ Mensaje enviado. Folio: <strong>{folio}</strong> — guardalo por si querés hacer seguimiento.
          </p>
        )}
        {status === 'error' && (
          <p className={styles.err}>⚠️ No se pudo enviar tu mensaje. Intentá de nuevo en unos minutos.</p>
        )}
      </form>

      <p className={styles.disclaimer}>
        Los mensajes anónimos no permiten que te respondamos directamente. Si querés seguimiento,
        marcá la opción de identificarte.
      </p>
    </div>
  );
}
