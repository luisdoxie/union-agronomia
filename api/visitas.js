import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function registrar(req, res) {
  const { visitante_id, ruta } = req.body ?? {};

  if (!visitante_id || typeof visitante_id !== 'string' || visitante_id.length > 100 ||
      !ruta || typeof ruta !== 'string') {
    res.status(400).json({ ok: false, error: 'Datos inválidos' });
    return;
  }

  const { error } = await supabase
    .from('visitas')
    .insert({ visitante_id, ruta: ruta.slice(0, 200) });

  if (error) {
    console.error('Supabase insert error (visitas):', error);
    res.status(500).json({ ok: false, error: 'No se pudo registrar la visita' });
    return;
  }

  res.status(200).json({ ok: true });
}

async function estadisticas(req, res) {
  const clave = req.headers['x-admin-key'];
  if (!clave || clave !== process.env.VISITAS_ADMIN_KEY) {
    res.status(401).json({ ok: false, error: 'Clave inválida' });
    return;
  }

  const { data, error } = await supabase.rpc('visitas_estadisticas');
  if (error) {
    console.error('Supabase rpc error (visitas_estadisticas):', error);
    res.status(500).json({ ok: false, error: 'No se pudieron obtener las estadísticas' });
    return;
  }

  res.status(200).json({ ok: true, hoy: data.hoy, semana: data.semana, total: data.total });
}

export default async function handler(req, res) {
  if (req.method === 'POST') return registrar(req, res);
  if (req.method === 'GET') return estadisticas(req, res);

  res.status(405).json({ ok: false, error: 'Método no permitido' });
}
