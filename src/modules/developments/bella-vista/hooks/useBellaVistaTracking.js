/**
 * useBellaVistaTracking — Custom Hook
 * Módulo: developments/bella-vista/hooks
 * Propósito: Gestionar el tracking de eventos (Meta Pixel, Google Analytics 4, TikTok Pixel) para la landing.
 */
import { useEffect } from 'react';

export default function useBellaVistaTracking() {
  useEffect(() => {
    // Boilerplate for tracking setup or pageview tracking
  }, []);

  const trackEvent = (eventName, params = {}) => {
    console.log(`[Bella Vista Tracking] Event: ${eventName}`, params);
  };

  return { trackEvent };
}
