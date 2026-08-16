import styles from './Noticias.module.css';
import fiestaImg from '../assets/FIESTA.jpg';

const EVENTOS = [
  {
    id: 'bienvenida-2026',
    titulo: '🎊❤️ TE INVITAMOS A LA BIENVENIDA DE SEMESTRE ❤️🥳',
    fecha: 'Viernes 21 de Agosto',
    hora: 'Desde las 14:00 p.m.',
    lugar: 'Casa de la Victoria',
    mapsUrl: 'https://maps.app.goo.gl/46Prz9DgV2eJwnDWA',
    cuerpo: 'Ven a disfrutar de una noche increíble, no te pierdas de la fiesta 🎉\n\nTe esperamos para celebrar la Bienvenida del Semestre ✨❤️🎈🥳🎊',
    actividades: [
      { emoji: '🙂‍↕️', texto: 'La Gran Panchiteada' },
      { emoji: '🫣',    texto: 'El Bautizo' },
      { emoji: '💪',    texto: 'Juegos Interactivos' },
      { emoji: '👑',    texto: 'Concurso de la Mejor Reina' },
      { emoji: '😂',    texto: 'Concurso de la Mejor Reina Mufa' },
    ],
    cierre: '¡Este proyecto es de todos y para todos!🔥',
    imagen: fiestaImg,
  },
];

export default function Noticias() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Noticias</h1>
        <p className={styles.pageMeta}>Eventos y comunicados de Unión Agronomía</p>
      </div>

      <div className={styles.feed}>
        {EVENTOS.map(ev => (
          <article key={ev.id} className={styles.card}>
            {/* Banner imagen / placeholder festivo */}
            {ev.imagen
              ? <img src={ev.imagen} alt="Flyer del evento" className={styles.banner} />
              : (
                <div className={styles.bannerPlaceholder} aria-hidden>
                  <span className={styles.confetti}>🎊</span>
                  <span className={styles.confetti}>🎉</span>
                  <span className={styles.confetti}>🥳</span>
                  <span className={styles.confetti}>🎈</span>
                  <span className={styles.confetti}>✨</span>
                </div>
              )
            }

            {/* Título */}
            <h2 className={styles.titulo}>{ev.titulo}</h2>

            {/* Chips de fecha / hora / lugar */}
            <div className={styles.chips}>
              <span className={styles.chip}>📅 {ev.fecha}</span>
              <span className={styles.chip}>⏰ {ev.hora}</span>
              <span className={styles.chip}>📍 {ev.lugar}</span>
            </div>

            {/* Cuerpo */}
            <p className={styles.cuerpo}>{ev.cuerpo}</p>

            {/* Actividades */}
            <ul className={styles.lista}>
              {ev.actividades.map((a, i) => (
                <li key={i} className={styles.listItem}>
                  <span className={styles.liEmoji}>{a.emoji}</span>
                  {a.texto}
                </li>
              ))}
            </ul>

            <p className={styles.cierre}>{ev.cierre}</p>

            {/* Botón de ubicación */}
            <a
              href={ev.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapsBtn}
              aria-label="Ver ubicación en Google Maps"
            >
              <span className={styles.mapsBtnPin}>📍</span>
              <span className={styles.mapsBtnTexto}>
                <span className={styles.mapsBtnTitulo}>¿Cómo llegar?</span>
                <span className={styles.mapsBtnSub}>Abrir en Google Maps</span>
              </span>
              <span className={styles.mapsBtnArrow}>→</span>
            </a>
          </article>
        ))}
      </div>
    </div>
  );
}
