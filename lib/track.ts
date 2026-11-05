/** Client side: send one analytics event. Fire and forget; never blocks or throws. */
export function track(kind: 'view' | 'form_start' | 'card_flip' | 'card_approve', extra: Record<string, string> = {}) {
  if (typeof window === 'undefined') return;
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
