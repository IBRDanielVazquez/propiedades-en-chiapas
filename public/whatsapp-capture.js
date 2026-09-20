(function () {
  'use strict';

  var recent = new Map();

  function whatsappUrl(value) {
    try {
      var url = new URL(String(value || ''), window.location.href);
      return /(^|\.)wa\.me$/i.test(url.hostname) || /(^|\.)api\.whatsapp\.com$/i.test(url.hostname);
    } catch (_) {
      return false;
    }
  }

  function campaign() {
    var query = new URLSearchParams(window.location.search);
    return {
      utm_source: query.get('utm_source') || '',
      utm_medium: query.get('utm_medium') || '',
      utm_campaign: query.get('utm_campaign') || '',
      utm_content: query.get('utm_content') || '',
      utm_term: query.get('utm_term') || '',
      gclid: query.get('gclid') || '',
      fbclid: query.get('fbclid') || ''
    };
  }

  function development() {
    var part = window.location.pathname.split('/').filter(Boolean)[0] || 'inicio';
    return part.replace(/-/g, ' ');
  }

  function record(detail) {
    detail = detail || {};
    var url = String(detail.url || '');
    if (!whatsappUrl(url)) return;
    var key = url;
    var now = Date.now();
    if (recent.has(key) && now - recent.get(key) < 1800) return;
    recent.set(key, now);

    var payload = Object.assign({
      event: 'whatsapp_open',
      occurred_at: new Date().toISOString(),
      development: detail.desarrollo || development(),
      intent: detail.intencion || detail.cta || 'Abrir WhatsApp',
      cta: detail.cta || '',
      whatsapp_url: url,
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer || '',
      name: detail.nombre || '',
      phone: detail.telefono || '',
      preference: detail.preferencia || ''
    }, campaign());

    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/whatsapp-events', new Blob([body], { type: 'application/json' }));
    } else {
      fetch('/api/whatsapp-events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(function () {});
    }
  }

  document.addEventListener('click', function (event) {
    var link = event.target && event.target.closest ? event.target.closest('a[href]') : null;
    if (!link || !whatsappUrl(link.href)) return;
    record({ url: link.href, cta: (link.textContent || link.getAttribute('aria-label') || '').trim().slice(0, 120) });
  }, true);

  window.addEventListener('pec:whatsapp', function (event) { record(event.detail); });

  var nativeOpen = window.open;
  window.open = function (url) {
    if (whatsappUrl(url)) record({ url: String(url), cta: 'Apertura programática' });
    return nativeOpen.apply(window, arguments);
  };
}());
