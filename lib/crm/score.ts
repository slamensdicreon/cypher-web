/**
 * Lead scoring: a simple, visible score from 0 to 100. Every point has a reason a person can read,
 * so nobody has to trust a number they can't explain.
 */
export type ScoreInput = {
  level: number | null; // the "how badly" dial, 0–3
  outcomes: string[]; // Build, Migrate, Personalize, Optimize
  site: string; // the site they gave
  source: string; // postcard code or utm_source
  requests: number; // how many times this company has asked
  title: string; // the contact's job title
  platform: string; // the platform the company runs
};

export type Score = { score: number; reasons: string[] };

const LEVELS = [
  [5, 'Curious'],
  [15, 'Interested'],
  [25, 'Needs it'],
  [35, 'Offered their budget'],
] as const;

export function scoreLead(i: ScoreInput): Score {
  const reasons: string[] = [];
  let s = 0;
  const add = (n: number, why: string) => {
    if (n <= 0) return;
    s += n;
    reasons.push(`+${n} ${why}`);
  };
  if (i.level !== null && i.level >= 0 && i.level <= 3) add(LEVELS[i.level][0], `${LEVELS[i.level][1]} on the dial`);
  const wants = i.outcomes.filter(Boolean);
  if (wants.length) add(Math.min(20, wants.length * 5), `wants ${wants.join(', ').toLowerCase()}`);
  if (i.site) add(5, 'gave their site');
  if (i.source) add(5, `came from ${i.source}`);
  if (i.requests > 1) add(10, `asked ${i.requests} times`);
  if (/\b(chief|c[etmdi]o|vp|vice president|head|director|svp|evp|founder|owner|partner)\b/i.test(i.title)) add(15, 'senior title');
  else if (/\bmanager|lead\b/i.test(i.title)) add(8, 'manager title');
  if (i.platform) add(5, `runs ${i.platform}`);
  return { score: Math.min(100, s), reasons };
}

/** A word for a score. */
export const heat = (n: number) => (n >= 60 ? 'Hot' : n >= 35 ? 'Warm' : 'Cool');
