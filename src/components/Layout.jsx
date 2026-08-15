import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import styles from './Layout.module.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen]   = useState(false);
  const location = useLocation();

  // Cierra el drawer mobile al navegar
  useEffect(() => { setMobileOpen(false); }, [location]);

  // En desktop el sidebar arranca expandido; en mobile arranca cerrado
  useEffect(() => {
    if (window.innerWidth < 768) setSidebarOpen(false);
  }, []);

  return (
    <div className={styles.shell}>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Top bar solo en mobile */}
      <header className={styles.topBar} role="banner">
        <button
          className={styles.hamburger}
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={mobileOpen}
        >
          <span className={styles.hLine} />
          <span className={styles.hLine} />
          <span className={styles.hLine} />
        </button>
        <span className={styles.topBarTitle}>Unión Agronomía</span>
      </header>

      <Sidebar
        open={sidebarOpen}
        mobileOpen={mobileOpen}
        onToggle={() => setSidebarOpen(o => !o)}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={`${styles.content} ${sidebarOpen ? styles.mainExpanded : styles.mainCollapsed}`}>
        <main id="main-content" className={styles.main} tabIndex={-1}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
