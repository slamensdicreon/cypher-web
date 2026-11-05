import type { EyeAction, EyeEvent } from '@/lib/eyeEngine';

export type { EyeAction };

function send(detail: EyeEvent) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<EyeEvent>('cypher:eye', { detail }));
}

/** Ask every eye on the page to react. Anything on the page can call this. */
export function eye(action: EyeAction, ms?: number) {
  send({ action, ms });
}

/** Look at a point on the screen (client coordinates) for a while. Each eye works out its own angle. */
export function eyeLook(x: number, y: number, ms = 1600) {
  send({ action: 'look', x, y, ms });
}

/** How keen the visitor is, 0 to 1: the pupils and the halo follow it. */
export function eyeMood(v: number) {
  send({ action: 'mood', v });
}
