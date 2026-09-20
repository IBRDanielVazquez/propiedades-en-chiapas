const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyJFOTF1hgQ56sutEf-q4pcv71BmY6dO58LbdosfVJyCT5CXRBuGz3XYOpCzsj1jJyW/exec';

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

  const normalizedEvent = {
    event: 'whatsapp_open',
    fecha_hora: clean(event.occurred_at, 40) || new Date().toISOString(),
    occurred_at: clean(event.occurred_at, 40) || new Date().toISOString(),
    origin: clean(event.origin, 120),
    development: clean(event.development, 120) || 'Sin identificar',
    page_title: clean(event.page_title, 250),
    page_path: clean(event.page_path, 250),
    resource_type: clean(event.resource_type, 80),
    intent: clean(event.intent, 160) || 'Abrir WhatsApp',
    cta: clean(event.cta, 160),
    destination_phone: clean(event.destination_phone, 30),
    name: clean(event.name, 160),
    phone: clean(event.phone, 30),
    preference: clean(event.preference, 160),
    utm_source: clean(event.utm_source, 120),
    utm_medium: clean(event.utm_medium, 120),
    utm_campaign: clean(event.utm_campaign, 180),
    utm_content: clean(event.utm_content, 180),
    utm_term: clean(event.utm_term, 180),
    gclid: clean(event.gclid, 250),
    fbclid: clean(event.fbclid, 250),
    referrer: clean(event.referrer, 500),
    whatsapp_url: clean(event.whatsapp_url, 1000),
  };

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalizedEvent),
      redirect: 'follow',
    });
    if (!response.ok) throw new Error(`Google Sheets respondió ${response.status}`);
    const result = await response.json().catch(() => ({}));
    if (result.ok !== true) throw new Error(result.error || 'Google Sheets rechazó el registro');
    return res.status(202).json({ ok: true });
  } catch (error) {
    console.error('[whatsapp-events]', error);
    return res.status(502).json({ error: 'No se pudo registrar el evento' });
  }
}
