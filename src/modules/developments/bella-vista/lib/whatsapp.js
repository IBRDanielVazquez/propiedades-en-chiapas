const WHATSAPP_NUMBER = import.meta.env.VITE_BV_WHATSAPP || '529612466204';

const TEMPLATES = {
  hero: '👋 Hola, vi Bella Vista y quiero agendar mi recorrido este sábado.',
  manifiesto: 'Hola, me interesa Bella Vista Ocozocoautla. ¿Me cuentas más?',
  amenidades: 'Hola, me gustaría saber más sobre las amenidades de Bella Vista.',
  ubicacion: 'Hola, ¿cómo llego a Bella Vista? Quiero ver el lugar.',
  inversion: 'Hola, me interesa el plan de $450/semana. ¿Cómo funciona?',
  testimonios: 'Hola, vi los testimonios y quiero conocer Bella Vista.',
  cta_final: 'Quiero apartar mi terreno en Bella Vista. ¿Cómo iniciamos?',
  faq: 'Hola, tengo una duda específica sobre Bella Vista.',
  retargeting: 'Vi su anuncio. ¿Sigue disponible la promoción?',
  generic: 'Hola, me interesa Bella Vista Ocozocoautla.',
};

export function buildWhatsAppUrl(templateKey = 'generic', utms = {}) {
  const message = TEMPLATES[templateKey] || TEMPLATES.generic;
  
  // Anexar UTMs al mensaje (invisible para el cliente, útil para tracking)
  let utmTrail = '';
  if (utms?.source) utmTrail += ` [src:${utms.source}]`;
  if (utms?.campaign) utmTrail += ` [c:${utms.campaign}]`;
  
  const fullMessage = encodeURIComponent(message + utmTrail);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${fullMessage}`;
}

export function getTemplate(key) {
  return TEMPLATES[key] || TEMPLATES.generic;
}

export const WHATSAPP_TEMPLATES = TEMPLATES;
