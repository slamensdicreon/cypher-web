import 'server-only';
import { setting } from '../settings';

/**
 * Settings for the drip. The sender name, postal address and reply-to are edited in Settings (with
 * the environment as fallback); call loadSettings() first. Nothing sends until the postal address is set.
 */

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ignoranceisbliss.ai';
export const resendKey = () => (process.env.RESEND_API_KEY || process.env.RESEND_KEY || process.env.RESEND || '').trim();
export const dripFrom = () => process.env.DRIP_FROM || process.env.EMAIL_FROM || 'Cypher <onboarding@resend.dev>';
export const dripReplyTo = () => setting('reply_to');
/** The sender's name and postal address, required in every marketing email (CAN-SPAM). */
export const senderName = () => setting('sender_name') || 'Cypher';
export const postalAddress = () => setting('postal_address');

export type Check = { key: string; ok: boolean; label: string; fix: string };

export function checks(): Check[] {
  return [
    { key: 'resend', ok: Boolean(resendKey()), label: 'Resend key', fix: 'Set RESEND_API_KEY (or RESEND_KEY) in Vercel.' },
    { key: 'address', ok: Boolean(postalAddress()), label: 'Postal address in the footer', fix: 'Add it in Settings. The law requires it in every marketing email; nothing sends until it is set.' },
    { key: 'webhook', ok: Boolean(process.env.RESEND_WEBHOOK_SECRET), label: 'Delivery, open and click tracking', fix: 'In Resend, add a webhook to /api/resend/webhook for email events, then set RESEND_WEBHOOK_SECRET (its signing secret) in Vercel.' },
    { key: 'cron', ok: Boolean(process.env.CRON_SECRET), label: 'Daily automatic sends', fix: 'Set CRON_SECRET in Vercel so the daily job can run. Until then, use Send due now.' },
  ];
}

export const canSend = () => Boolean(resendKey() && postalAddress());
