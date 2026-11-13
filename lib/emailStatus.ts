import 'server-only';

/**
 * Asks Resend what happened to one email: queued, sent, delivered, bounced, complained, failed and so
 * on (its last event). Cached for a minute per email. Answers null when it can't tell.
 */
const key = () => (process.env.RESEND_API_KEY || process.env.RESEND_KEY || process.env.RESEND || '').trim();
const cache = new Map<string, { v: EmailStatus | null; until: number }>();

export type EmailStatus = { event: string; at: string | null };

export async function emailStatus(id: string | null | undefined): Promise<EmailStatus | null> {
  if (!id || !key()) return null;
  const c = cache.get(id);
  if (c && c.until > Date.now()) return c.v;
  let v: EmailStatus | null = null;
  try {
    const res = await fetch(`https://api.resend.com/emails/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${key()}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const j = (await res.json()) as { last_event?: string; created_at?: string };
      v = { event: j.last_event || 'unknown', at: j.created_at ?? null };
    }
  } catch {
    v = null;
  }
  cache.set(id, { v, until: Date.now() + 60_000 });
  return v;
}

/** Resend's last event, in words. */
export const EVENT_WORDS: Record<string, { text: string; ok: boolean | null }> = {
  queued: { text: 'Queued at Resend', ok: null },
  scheduled: { text: 'Scheduled', ok: null },
  sent: { text: 'Sent; not confirmed delivered yet', ok: null },
  delivered: { text: 'Delivered to their mail server', ok: true },
  delivery_delayed: { text: 'Delivery delayed; Resend is retrying', ok: null },
  opened: { text: 'Delivered and opened', ok: true },
  clicked: { text: 'Delivered and clicked', ok: true },
  bounced: { text: 'Bounced: their mail server refused it', ok: false },
  complained: { text: 'Marked as spam', ok: false },
  failed: { text: 'Failed to send', ok: false },
  canceled: { text: 'Canceled', ok: false },
  suppressed: { text: 'Suppressed by Resend (this address bounced or complained before)', ok: false },
};
