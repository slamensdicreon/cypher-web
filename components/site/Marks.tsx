/**
 * The eye in its three states, exactly as the Cypher Design System draws them (Assets › Marks),
 * plus the few line icons the site uses. Never redraw the eye by hand.
 *
 * `tone` says what the eye sits on: `page` (an ink disc on the light page) or `shell` (a white disc
 * on ink). The eye that needs a word looks the same everywhere: a coral disc, a white almond and an
 * ink pupil.
 */
type State = 'resting' | 'watching' | 'needs';

export function EyeMark({ state, size, tone = 'page', label }: { state: State; size: number; tone?: 'page' | 'shell'; label?: string }) {
  const disc = tone === 'shell' ? '#ffffff' : '#141433';
  const line = tone === 'shell' ? '#141433' : '#ffffff';
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" {...a11y}>
      {state === 'needs' ? (
        <>
          <circle cx="36" cy="36" r="31" fill="#e8553d" />
          <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="#ffffff" />
          <circle cx="36" cy="36" r="7" fill="#141433" />
        </>
      ) : state === 'watching' ? (
        <>
          <circle cx="36" cy="36" r="31" fill={disc} />
          <path d="M18 36 Q36 20 54 36 Q36 52 18 36 Z" fill="none" stroke={line} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="36" cy="36" r="5" fill={line} />
        </>
      ) : (
        <>
          <circle cx="36" cy="36" r="31" fill={disc} />
          <path d="M20 36 Q36 50 52 36" fill="none" stroke={line} strokeWidth="4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** A green check, always beside a word. */
export const Check = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="bl-check">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#1e8e5a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Arrow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Cross = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <path d="M3 3l8 8M11 3l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
