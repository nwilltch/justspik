/**
 * Helper d'événements personnalisés pour Brieflish Analytics (https://brieflish.com)
 */

declare global {
  interface Window {
    brieflish?: (event: string, data?: Record<string, unknown>) => void;
  }
}

export function trackBrieflishEvent(eventName: string, data?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  try {
    if (typeof window.brieflish === 'function') {
      window.brieflish(eventName, data);
    } else {
      // Événement différé si le script charge encore
      window.addEventListener(
        'brieflish-ready',
        () => {
          if (typeof window.brieflish === 'function') {
            window.brieflish(eventName, data);
          }
        },
        { once: true }
      );
    }
  } catch (e) {
    console.debug('[Brieflish Event Error]', e);
  }
}
