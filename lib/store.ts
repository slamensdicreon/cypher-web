import 'server-only';

export type Submission = {
  email: string;
  domain: string;
  company: string;
  level: number;
  interest: string;
  source: string;
  at: string;
  ua: string;
};

const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '';
const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
export const hasStore = Boolean(url && token);

/** One Redis command over Upstash's REST API. No SDK, no extra dependency. */
async function redis<T = unknown>(command: (string | number)[]): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Redis ${command[0]} failed: ${res.status}`);
  const data = (await res.json()) as { result: T };
  return data.result;
}

/** Returns false once an address has asked more than `limit` times in the window. */
export async function underLimit(key: string, limit = 20, windowSeconds = 3600): Promise<boolean> {
  if (!hasStore) return true;
  try {
    const n = await redis<number>(['INCR', `rl:${key}`]);
    if (n === 1) await redis(['EXPIRE', `rl:${key}`, windowSeconds]);
    return n <= limit;
  } catch {
    return true;
  }
}

export async function save(s: Submission): Promise<void> {
  const json = JSON.stringify(s);
  if (hasStore) {
    await redis(['LPUSH', 'interest:all', json]);
    await redis(['HSET', 'interest:byDomain', s.domain, json]);
  } else {
    console.log('[interest]', json);
  }
  const hook = process.env.SUBMISSION_WEBHOOK_URL;
  if (hook) {
    const text = `${s.company} (${s.domain}) put themselves forward · ${s.interest}${s.source ? ` · card ${s.source}` : ''}`;
    await fetch(hook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ...s }),
    }).catch(() => undefined);
  }
}

export async function all(): Promise<Submission[]> {
  if (!hasStore) return [];
  const rows = await redis<string[]>(['LRANGE', 'interest:all', 0, -1]);
  return rows.map((r) => JSON.parse(r) as Submission);
}
