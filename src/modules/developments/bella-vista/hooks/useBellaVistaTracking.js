import { useEffect, useCallback } from 'react';
import { trackPotentialLead } from '../lib/leads';

const PIXEL_META = import.meta.env.VITE_BV_META_PIXEL;
const GA4_ID = import.meta.env.VITE_BV_GA4;
const TIKTOK_PIXEL = import.meta.env.VITE_BV_TIKTOK_PIXEL;
const STORAGE_KEY = 'bv_utms';

function getUTMsFromURL() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source'),
    medium: params.get('utm_medium'),
    campaign: params.get('utm_campaign'),
    ad_id: params.get('ad_id') || params.get('fbclid'),
  };
}

function persistUTMs(utms) {
  if (Object.values(utms).some(Boolean)) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utms));
  }
}

export function getUTMs() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function useBellaVistaTracking() {
  useEffect(() => {
    // Capturar UTMs
    const utms = getUTMsFromURL();
    persistUTMs(utms);

    // Init Meta Pixel
    if (PIXEL_META && typeof window.fbq === 'undefined') {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
        n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
        s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
        (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', PIXEL_META);
      window.fbq('track', 'PageView');
    }

    // Init GA4
    if (GA4_ID && typeof window.gtag === 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){window.dataLayer.push(arguments);};
      window.gtag('js', new Date());
      window.gtag('config', GA4_ID);
    }

    // Init TikTok Pixel
    if (TIKTOK_PIXEL && typeof window.ttq === 'undefined') {
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;
        var ttq=w[t]=w[t]||[];
        ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
        ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
        for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
        ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
        ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";
        ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=i;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};
        var o=document.createElement("script");o.type="text/javascript";o.async=!0;
        o.src=i+"?sdkid="+e+"&lib="+t;
        var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load(TIKTOK_PIXEL);
        ttq.page();
      }(window, document, 'ttq');
    }

    // Log si estamos en dev sin pixels
    if (import.meta.env.DEV && !PIXEL_META) {
      console.log('[BV Tracking] DEV mode — no pixels configured');
    }
  }, []);

  const trackEvent = useCallback((name, params = {}) => {
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', name, params);
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', name, params);
    }
    if (typeof window.ttq === 'object') {
      window.ttq.track(name, params);
    }
    if (import.meta.env.DEV) {
      console.log(`[BV Track] ${name}`, params);
    }
  }, []);

  const trackWhatsAppClick = useCallback(async (section, template) => {
    const utms = getUTMs();
    trackEvent('whatsapp_click', { section, template });
    await trackPotentialLead({ section, template, utms });
  }, [trackEvent]);

  return { trackEvent, trackWhatsAppClick, getUTMs };
}
