const STORAGE_KEY = 'ua_visitante_id';
const RUTAS_EXCLUIDAS = ['/admin-visitas'];

export function getVisitanteId() {
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function registrarVisita(pathname) {
  if (RUTAS_EXCLUIDAS.includes(pathname)) return;
  try {
    fetch('/api/visitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({ visitante_id: getVisitanteId(), ruta: pathname }),
    }).catch(() => {});
  } catch {
    // nunca debe romper la navegación
  }
}
