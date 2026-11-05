import 'server-only';
import { createHmac } from 'node:crypto';

/** The server's secret for one-way hashes of network addresses. */
const secret = process.env.IP_HASH_SECRET || process.env.ADMIN_KEY || 'cypher-web';

/** A keyed one-way hash; can't be turned back into its input without the server's secret. */
export const keyedHash = (value: string, length = 32) => createHmac('sha256', secret).update(value).digest('hex').slice(0, length);

/** The visitor's network address, as the edge saw it. */
export const clientIp = (headers: Headers) => (headers.get('x-forwarded-for') || '').split(',')[0].trim();
