export const CLOSES_AT = new Date(
  process.env.NEXT_PUBLIC_SELECTION_CLOSES_AT || '2026-11-14T04:59:59Z',
);

export function isClosed(now: number = Date.now()): boolean {
  return now > CLOSES_AT.getTime();
}

export const LEVELS = ['Curious', 'Interested', 'Need it', 'Take our budget'] as const;

/** What a company can ask Cypher for, on the form. */
export const OUTCOMES = ['Build', 'Migrate', 'Personalize', 'Optimize'] as const;

/** What Cypher says back to a company put forward, by level. The page and the email both use it. */
export const NOTED = [
  'Curious. We’ll see if that’s enough.',
  'Interested. We’ll be the judge of how much.',
  'Needing it is the first qualification. You have it.',
  'Bold. We like bold. We’re still going to check.',
] as const;
