export const CLOSES_AT = new Date(
  process.env.NEXT_PUBLIC_SELECTION_CLOSES_AT || '2026-11-14T04:59:59Z',
);

export function isClosed(now: number = Date.now()): boolean {
  return now > CLOSES_AT.getTime();
}

export const LEVELS = ['Curious', 'Interested', 'Need it', 'Take our budget'] as const;
