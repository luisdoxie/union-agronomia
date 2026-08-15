import { Link } from 'react-router-dom';
import logo from '../assets/logo1.jpeg';
import styles from './Footer.module.css';

const TIKTOK_URL = 'https://www.tiktok.com/@union_agro';
const WHATSAPP_URL = 'https://chat.whatsapp.com/JnjOvsuMogH3EvF3wzLFJn?s=sh&p=a&ilr=1';

const RECURSOS = [
  { label: 'Plan de Estudio',      to: '/plan-estudio' },
  { label: 'Horarios',             to: '/horarios' },
  { label: 'Casos Especiales',     to: '/casos-especiales' },
  { label: 'Noticias',             to: '/noticias',    soon: true },
];

const COMUNIDAD = [
  { label: 'TikTok',    href: TIKTOK_URL },
  { label: 'WhatsApp',  href: WHATSAPP_URL, soon: !WHATSAPP_URL },
];

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandTop}>
            <img src={logo} alt="Unión Agronomía" className={styles.logo} />
            <span className={styles.brandName}>Unión Agronomía</span>
          </div>
          <p className={styles.desc}>Portal estudiantil gratuito para Ingeniería Agronómica · FCA-UAGRM</p>
          <em className={styles.slogan}>Sembrando conocimiento, cosechando futuro.</em>
          <div className={styles.socials}>
            <a href={TIKTOK_URL} target="_blank" rel="noreferrer" className={styles.socialBtn} title="TikTok">
              <TikTokIcon />
            </a>
            {WHATSAPP_URL && (
              <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className={styles.socialBtn} title="WhatsApp">
                <WhatsAppIcon />
              </a>
            )}
          </div>
        </div>

        {/* Recursos */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Recursos</h4>
          <ul className={styles.list}>
            {RECURSOS.map(item => (
              <li key={item.label}>
                {item.soon
                  ? <span className={styles.linkSoon}>{item.label}</span>
                  : <Link to={item.to} className={styles.link}>{item.label}</Link>
                }
              </li>
            ))}
          </ul>
        </div>

        {/* Comunidad */}
        <div className={styles.col}>
          <h4 className={styles.colTitle}>Comunidad</h4>
          <ul className={styles.list}>
            {COMUNIDAD.map(item => (
              <li key={item.label}>
                {item.soon || !item.href
                  ? <span className={styles.linkSoon}>{item.label}</span>
                  : <a href={item.href} target="_blank" rel="noreferrer" className={styles.link}>{item.label}</a>
                }
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        <span>2026 Unión Agronomía · FCA-UAGRM</span>
        <span>Facultad de Ciencias Agrícolas</span>
      </div>
    </footer>
  );
}
