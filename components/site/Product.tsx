import Image from 'next/image';
import { PHASES, SHOTS, type ShotKey } from '@/lib/product';

/**
 * Showing the product: one frame for every screen, a row of words beside a screen, and the phases
 * strip. The frame is always dark so screens read the same on light and dark bands.
 */

export function ProductShot({ shot, caption, priority = false, sizes = '(min-width: 1100px) 1000px, 100vw', className = '' }: { shot: ShotKey; caption?: string; priority?: boolean; sizes?: string; className?: string }) {
  const s = SHOTS[shot];
  return (
    <figure className={`pf ${className}`}>
      <div className="pf-bar" aria-hidden="true">
        <i /><i /><i />
        <span>{s.label}</span>
      </div>
      <div className="pf-screen">
        <Image src={s.src} width={s.w} height={s.h} alt={s.alt} sizes={sizes} priority={priority} />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Words on one side, the screen on the other; `flip` swaps the sides on wide screens. */
export function FeatureRow({ title, body, points, shot, flip = false, children }: { title: string; body: string; points?: string[]; shot?: ShotKey; flip?: boolean; children?: React.ReactNode }) {
  return (
    <div className={`fr${flip ? ' flip' : ''}`}>
      <div className="fr-copy">
        <h3>{title}</h3>
        <p>{body}</p>
        {points && (
          <ul>
            {points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        )}
      </div>
      <div className="fr-media">{children ?? (shot && <ProductShot shot={shot} sizes="(min-width: 1000px) 620px, 100vw" />)}</div>
    </div>
  );
}

/** The phases of a build, with the gates where you approve. */
export function PhaseStrip() {
  return (
    <ol className="phases-strip">
      {PHASES.map((p, i) => (
        <li key={p.name} className={p.gate ? 'gate' : undefined}>
          <span className="ps-n">{i}</span>
          <b>{p.name}</b>
          {p.gate && <span className="ps-gate">Your gate</span>}
        </li>
      ))}
    </ol>
  );
}

/** A section's heading and intro. */
export function SectionHead({ title, intro, center = false }: { title: string; intro?: string; center?: boolean }) {
  return (
    <div className={`sh${center ? ' center' : ''}`}>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}
