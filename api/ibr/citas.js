// ============================================================
// API interna de lectura/escritura: /api/ibr/citas/
// ------------------------------------------------------------
// Safari iOS bloquea peticiones CORS directas (POST/GET) a
// script.google.com debido a redirecciones y políticas de ITP.
// Esta función actúa como proxy del lado del servidor en Vercel
// para enrutar de forma transparente tanto consultas como
// actualizaciones/creaciones de citas.
// ============================================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJePW3Un5vjXbpzqwWzIkYhQAlCQ8Ov-b2SDppNHgPasrcQDC_Ah6qyFWFSNa7yeYI7Q/exec';
const TIMEOUT_MS = 30000;

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  // 1. Manejo de POST (Creación, actualización, eliminación)
  if (req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    const control = new AbortController();
    const timer = setTimeout(() => control.abort(), TIMEOUT_MS);

    try {
      let bodyData = '';
      if (typeof req.body === 'string') {
        bodyData = req.body;
      } else if (req.body) {
        bodyData = JSON.stringify(req.body);
      }

      const respuesta = await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: bodyData,
        signal: control.signal,
        redirect: 'follow'
      });

      const data = await respuesta.json();
      res.status(respuesta.status).json(data);
    } catch (err) {
      console.error('[IBR-CITAS-POST] Error en proxy:', err && err.message);
      res.status(502).json({ ok: false, mensaje: 'Error al conectar con la base de datos (Proxy)' });
    } finally {
      clearTimeout(timer);
    }
    return;
  }

  // 2. Manejo de GET (Lectura, desarrollos, histórico, JSONP)
  if (req.method === 'GET') {
    const queryStr = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '?action=citas_sheet';
    const url = APPS_SCRIPT_URL + queryStr;
    const control = new AbortController();
    const timer = setTimeout(() => control.abort(), TIMEOUT_MS);

    try {
      const respuesta = await fetch(url, {
        signal: control.signal,
        redirect: 'follow'
      });
      const texto = await respuesta.text();

      if (!respuesta.ok) {
        throw new Error('Estatus upstream ' + respuesta.status);
      }

      // Si es JSONP, responder con javascript; si no, con json
      const isJsonp = req.query && req.query.callback;
      if (isJsonp) {
        res.setHeader('Content-Type', 'text/javascript');
        res.status(200).send(texto);
      } else {
        res.setHeader('Content-Type', 'application/json');
        
        // Si viene envuelto en callback pero se pidió como json limpio, desempaquetar
        if (texto.trim().endsWith(')')) {
          const inicio = texto.indexOf('(');
          const fin = texto.lastIndexOf(')');
          if (inicio !== -1 && fin > inicio) {
            res.status(200).send(texto.slice(inicio + 1, fin));
            return;
          }
        }
        res.status(200).send(texto);
      }
    } catch (err) {
      console.error('[IBR-CITAS-GET] Error en proxy:', err && err.message);
      res.setHeader('Content-Type', 'application/json');
      res.status(502).json({ ok: false, codigo: 'IBR-CITAS-UPSTREAM' });
    } finally {
      clearTimeout(timer);
    }
    return;
  }

  // Métodos no soportados
  res.setHeader('Content-Type', 'application/json');
  res.status(405).json({ ok: false, mensaje: 'Método no permitido' });
}
