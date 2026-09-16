import styles from './Noticias.module.css';

const EVENTOS = [];

export default function Noticias() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Noticias</h1>
        <p className={styles.pageMeta}>Eventos y comunicados de Unión Agronomía</p>
      </div>

      <div className={styles.feed}>
        {EVENTOS.length === 0 && (
          <p className={styles.pageMeta}>No hay noticias por el momento.</p>
        )}
        {EVENTOS.map(ev => (
          <article key={ev.id} className={styles.card}>
            {/* Banner imagen / placeholder festivo */}
            <div className={styles.bannerWrap}>
              {ev.imagen
                ? <img src={ev.imagen} alt="Flyer del evento" className={styles.banner} loading="lazy" />
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
            </div>

            {/* Contenido */}
            <div className={styles.contenido}>
              <h2 className={styles.titulo}>{ev.titulo}</h2>

              <div className={styles.chips}>
                <span className={styles.chip}>📅 {ev.fecha}</span>
                <span className={styles.chip}>⏰ {ev.hora}</span>
                <span className={styles.chip}>📍 {ev.lugar}</span>
              </div>

              <p className={styles.cuerpo}>{ev.cuerpo}</p>

              <ul className={styles.lista}>
                {ev.actividades.map((a, i) => (
                  <li key={i} className={styles.listItem}>
                    <span className={styles.liEmoji}>{a.emoji}</span>
                    {a.texto}
                  </li>
                ))}
              </ul>

              <p className={styles.cierre}>{ev.cierre}</p>

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
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
