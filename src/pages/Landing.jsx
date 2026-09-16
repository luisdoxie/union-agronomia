import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import logo from '../assets/logo1.jpeg';
import styles from './Landing.module.css';

const CARDS = [
  {
    id: 'casos',
    icon: '📄',
    title: 'Casos Especiales',
    desc: 'Generá tu solicitud de inscripción con prerrequisitos, lista para imprimir.',
    route: '/casos-especiales',
    active: true,
  },
  {
    id: 'plan',
    icon: '📚',
    title: 'Plan de Estudio',
    desc: 'Consultá la malla curricular completa con áreas y correlativas.',
    route: '/plan-estudio',
    active: true,
  },
  {
    id: 'horarios',
    icon: '🗓️',
    title: 'Horarios',
    desc: 'Encontrá los horarios por materia y grupo actualizados.',
    route: '/horarios',
    active: true,
  },
  {
    id: 'noticias',
    icon: '📢',
    title: 'Noticias',
    desc: 'Novedades, eventos y comunicados de la carrera.',
    route: '/noticias',
    active: true,
  },
];

function SurcosSeparator() {
  return (
    <div className={styles.surcos} aria-hidden>
      <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {[0,1,2,3,4,5,6].map(i => (
          <path
            key={i}
            d={`M -60 ${30 + i * 4} Q 600 ${10 - i * 2} 1260 ${30 + i * 4}`}
            stroke="#C81E1E"
            strokeOpacity={0.18 - i * 0.02}
            strokeWidth="1.5"
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const cardsRef = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add(styles.visible)),
      { threshold: 0.15 }
    );
    cardsRef.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.haloRing} aria-hidden />
        <img src={logo} alt="Unión Agronomía" className={styles.logoHero} />
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>Unión Agronomía</h1>
          <p className={styles.heroSub}>
            Portal de herramientas para estudiantes de Ingeniería Agronómica · FCA-UAGRM
          </p>
        </div>
      </section>

      <SurcosSeparator />

      {/* Cards */}
      <section className={styles.cardsSection}>
        <h2 className={styles.sectionTitle}>¿Qué necesitás hacer?</h2>
        <div className={styles.grid}>
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={el => (cardsRef.current[i] = el)}
              className={`${styles.card} ${card.active ? styles.cardActive : styles.cardSoon} ${styles.fadeUp}`}
              style={{ animationDelay: `${i * 80}ms` }}
              onClick={card.active ? () => navigate(card.route) : undefined}
              role={card.active ? 'button' : undefined}
              tabIndex={card.active ? 0 : undefined}
              onKeyDown={card.active ? e => e.key === 'Enter' && navigate(card.route) : undefined}
            >
              <span className={styles.cardIcon}>{card.icon}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDesc}>{card.desc}</p>
              {card.soon && <span className={styles.soonBadge}>Próximamente</span>}
              {card.active && <span className={styles.ctaArrow}>→</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
