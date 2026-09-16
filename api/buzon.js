import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const CATEGORIA_LABELS = {
  docente: 'Denuncia a un docente',
  auxiliar: 'Denuncia a un auxiliar',
  sugerencia: 'Sugerencia',
  otro: 'Otro',
};

const ESTADOS_VALIDOS = ['pendiente', 'atendido'];

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function crear(req, res) {
  const { categoria, materia, mensaje, identificado, nombre, contacto, empresa } = req.body ?? {};

  // Honeypot: si un bot llenó este campo oculto, respondemos éxito falso sin guardar nada
  if (empresa) {
    res.status(200).json({ ok: true, folio: 'ok' });
    return;
  }

  if (!categoria || !CATEGORIA_LABELS[categoria] || !mensaje || !mensaje.trim()) {
    res.status(400).json({ ok: false, error: 'Faltan datos requeridos' });
    return;
  }

  const { data, error } = await supabase
    .from('buzon_mensajes')
    .insert({
      categoria,
      materia: materia?.trim() || null,
      mensaje: mensaje.trim(),
      identificado: !!identificado,
      nombre: identificado ? (nombre?.trim() || null) : null,
      contacto: identificado ? (contacto?.trim() || null) : null,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    res.status(500).json({ ok: false, error: 'No se pudo guardar el mensaje' });
    return;
  }

  const folio = data.id.slice(0, 8);

  const destinatarios = (process.env.BUZON_EMAILS || '')
    .split(',')
    .map(e => e.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (destinatarios.length > 0 && process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM,
        to: destinatarios,
        subject: `[Buzón Unión Agronomía] Nueva ${CATEGORIA_LABELS[categoria]}`,
        text: [
          `Categoría: ${CATEGORIA_LABELS[categoria]}`,
          materia ? `Materia relacionada: ${materia}` : null,
          '',
          mensaje.trim(),
          '',
          identificado
            ? `Identificado — Nombre: ${nombre || '(no indicado)'} · Contacto: ${contacto || '(no indicado)'}`
            : 'Enviado de forma anónima.',
          '',
          `Folio: ${folio}`,
        ].filter(Boolean).join('\n'),
      });
    } catch (err) {
      // El mensaje ya quedó guardado en Supabase aunque falle el envío del correo
      console.error('Resend send error:', err);
    }
  }

  res.status(200).json({ ok: true, folio });
}

function claveValida(req) {
  const clave = req.headers['x-admin-key'];
  return !!clave && clave === process.env.BUZON_ADMIN_KEY;
}

async function listar(req, res) {
  if (!claveValida(req)) {
    res.status(401).json({ ok: false, error: 'Clave inválida' });
    return;
  }

  const { data, error } = await supabase
    .from('buzon_mensajes')
    .select('id, categoria, materia, mensaje, identificado, nombre, contacto, estado, creado_en')
    .order('creado_en', { ascending: false })
    .limit(500);

  if (error) {
    console.error('Supabase select error (buzon_mensajes):', error);
    res.status(500).json({ ok: false, error: 'No se pudieron obtener las denuncias' });
    return;
  }

  res.status(200).json({ ok: true, mensajes: data });
}

async function actualizarEstado(req, res) {
  if (!claveValida(req)) {
    res.status(401).json({ ok: false, error: 'Clave inválida' });
    return;
  }

  const { id, estado } = req.body ?? {};

  if (!id || typeof id !== 'string' || !ESTADOS_VALIDOS.includes(estado)) {
    res.status(400).json({ ok: false, error: 'Datos inválidos' });
    return;
  }

  const { error } = await supabase
    .from('buzon_mensajes')
    .update({ estado })
    .eq('id', id);

  if (error) {
    console.error('Supabase update error (buzon_mensajes):', error);
    res.status(500).json({ ok: false, error: 'No se pudo actualizar el estado' });
    return;
  }

  res.status(200).json({ ok: true });
}

export default async function handler(req, res) {
  if (req.method === 'POST') return crear(req, res);
  if (req.method === 'GET') return listar(req, res);
  if (req.method === 'PATCH') return actualizarEstado(req, res);

  res.status(405).json({ ok: false, error: 'Método no permitido' });
}
