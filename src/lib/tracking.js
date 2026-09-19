// Puntos de medición compartidos por las landings de desarrollos.
// NO incluye el código del pixel de Meta: solo dispara los eventos si existe.

const EVENTOS_ESTANDAR = ['ViewContent', 'Contact', 'Lead', 'Schedule', 'CompleteRegistration'];

export function dispararEvento(nombre, payload = {}) {
  if (typeof window === 'undefined') return;

  const datos = { ...payload };

  try {
    if (typeof window.fbq === 'function') {
      if (EVENTOS_ESTANDAR.includes(nombre)) {
        window.fbq('track', nombre, datos);
      } else {
        window.fbq('trackCustom', nombre, datos);
      }
    }
  } catch (error) {
    if (import.meta.env?.DEV) console.warn('[tracking] fbq:', error);
  }

  try {
    window.dataLayer?.push({ event: nombre, ...datos });
    window.gtag?.('event', nombre, datos);
  } catch (error) {
    if (import.meta.env?.DEV) console.warn('[tracking] dataLayer/gtag:', error);
  }

  if (import.meta.env?.DEV) console.log(`[tracking] ${nombre}`, datos);
}

export default dispararEvento;
