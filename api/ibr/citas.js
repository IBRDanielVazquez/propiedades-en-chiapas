// ============================================================
// API interna de solo lectura: GET /api/ibr/citas
// ------------------------------------------------------------
// Safari iOS no carga bien JSONP directo a script.google.com,
// así que esta función de Vercel consulta Google Apps Script
// DESDE EL SERVIDOR y entrega JSON normal al dashboard.
// Flujo: navegador → /api/ibr/citas → Apps Script → JSON.
// No escribe datos, no guarda datos, no acepta otra acción.
// ============================================================

// URL tomada del dashboard (public/ibr-dashboard/index.html) — no cambiar sin actualizar ambos
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJePW3Un5vjXbpzqwWzIkYhQAlCQ8Ov-b2SDppNHgPasrcQDC_Ah6qyFWFSNa7yeYI7Q/exec';

const TIMEOUT_MS = 30000; // tiempo máximo de espera al Apps Script

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Content-Type', 'application/json');

  // Solo lectura: cualquier método que no sea GET se rechaza
  if (req.method !== 'GET') {
    res.status(405).json({ ok: false, codigo: 'IBR-CITAS-METODO' });
    return;
  }

  // La acción es fija: nada del cliente puede cambiarla
  const callbackTemporal = 'ibrProxyCitas';
  const url = APPS_SCRIPT_URL
    + '?action=citas_sheet'
    + '&callback=' + callbackTemporal
    + '&t=' + Date.now();

  const control = new AbortController();
  const timer = setTimeout(() => control.abort(), TIMEOUT_MS);

  try {
    // fetch de Node sigue las redirecciones de Google automáticamente
    const respuesta = await fetch(url, { signal: control.signal, redirect: 'follow' });
    const texto = await respuesta.text();

    if (!respuesta.ok) {
      throw new Error('estatus upstream ' + respuesta.status);
    }

    // Extraer el JSON del envoltorio JSONP: ibrProxyCitas({...})
    const inicio = texto.indexOf('(');
    const fin = texto.lastIndexOf(')');
    if (inicio === -1 || fin <= inicio) {
      throw new Error('formato JSONP inesperado');
    }

    const datos = JSON.parse(texto.slice(inicio + 1, fin));

    // Validación estricta de la estructura esperada
    if (datos.ok !== true || !Array.isArray(datos.datos)) {
      throw new Error('estructura inesperada');
    }

    res.status(200).json({
      ok: true,
      total: datos.datos.length,
      datos: datos.datos,
    });
  } catch (err) {
    // Log técnico sin datos personales y sin exponer la URL del Apps Script
    console.error('[IBR-CITAS] fallo upstream:', err && err.name, err && err.message);
    res.status(502).json({ ok: false, codigo: 'IBR-CITAS-UPSTREAM' });
  } finally {
    clearTimeout(timer);
  }
}
