export type EyeAction = 'blink' | 'double' | 'squint' | 'widen' | 'calm' | 'wake' | 'focus' | 'unfocus';

/** Ask the hero eye to react. Anything on the page can call this. */
export function eye(action: EyeAction, ms?: number) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('cypher:eye', { detail: { action, ms } }));
}
