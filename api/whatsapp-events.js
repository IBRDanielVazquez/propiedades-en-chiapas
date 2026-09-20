const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJePW3Un5vjXbpzqwWzIkYhQAlCQ8Ov-b2SDppNHgPasrcQDC_Ah6qyFWFSNa7yeYI7Q/exec';

function clean(value, max = 250) {
  return [...String(value ?? '')].map((character) => character.charCodeAt(0) < 32 ? ' ' : character).join('').trim().slice(0, max);
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === 'object') return body;
  try { return JSON.parse(body); } catch { return {}; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const event = parseBody(req.body);
  if (event.event !== 'whatsapp_open') return res.status(400).json({ error: 'Evento no válido' });

  const context = [
    `Evento: clic/apertura de WhatsApp`,
    `CTA: ${clean(event.cta || event.intent, 120)}`,
    `Página: ${clean(event.page_url, 500)}`,
    `Referencia: ${clean(event.referrer, 500)}`,
    `Campaña: ${clean(event.utm_campaign, 120)}`,
    `Fuente/medio: ${clean(event.utm_source, 80)} / ${clean(event.utm_medium, 80)}`,
    `Contenido: ${clean(event.utm_content, 120)}`,
    `gclid: ${clean(event.gclid, 180)}`,
    `fbclid: ${clean(event.fbclid, 180)}`,
    `Preferencia: ${clean(event.preference, 120)}`,
  ].join('\n');

  const sheetRow = {
    action: 'crear_cita',
    fecha_hora: clean(event.occurred_at, 40) || new Date().toISOString(),
    asesor: 'Sin asignar',
    desarrollo: clean(event.development, 120) || 'Landing',
    prospecto_nombre: clean(event.name, 120) || 'Contacto desde landing',
    prospecto_telefono: clean(event.phone, 20),
    observaciones: context,
    usuario_actual: 'Captura automática de landing',
    medio_contacto: 'WhatsApp',
    interes: clean(event.intent, 120) || 'Abrir WhatsApp',
    seguimiento: 'Nuevo',
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetRow),
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`Google Sheets respondió ${response.status}`);
    return res.status(202).json({ ok: true });
  } catch (error) {
    console.error('[whatsapp-events]', error);
    return res.status(502).json({ error: 'No se pudo registrar el evento' });
  }
}
