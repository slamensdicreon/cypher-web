type GtagWindow = Window & { gtag?: (...args: unknown[]) => void };

/**
 * Client side: an event for Google Analytics. Only names and labels, never an email, a name or
 * anything typed into the form. Sent with gtag('event'), which the Tag Manager container's Google
 * tag forwards to Analytics; a no-op where Tag Manager isn't loaded (previews, local copies).
 */
export function gaEvent(event: string, params: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as GtagWindow;
  if (typeof w.gtag !== 'function') return;
  try {
    w.gtag('event', event, params);
  } catch {
    /* analytics must never break the page */
  }
}

/** Client side: send one analytics event. Fire and forget; never blocks or throws. */
export function track(kind: 'view' | 'form_start' | 'card_flip' | 'card_approve' | 'cta', extra: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
  if (kind === 'cta') gaEvent('cta_click', { cta_label: extra.label ?? '' });
  if (kind === 'form_start') gaEvent('form_start', { form_name: 'demo' });
  try {
    const params = new URLSearchParams(window.location.search);
    const body = JSON.stringify({
      kind,
      path: window.location.pathname,
      ref: document.referrer,
      card: params.get('c') || '',
      utm: params.get('utm_source') || '',
      ...extra,
    });
    const blob = new Blob([body], { type: 'application/json' });
    if (!navigator.sendBeacon?.('/api/e', blob)) {
      fetch('/api/e', { method: 'POST', body, keepalive: true, headers: { 'Content-Type': 'application/json' } }).catch(() => {});
    }
  } catch {
    /* analytics must never break the page */
  }
}
