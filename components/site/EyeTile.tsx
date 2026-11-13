import StaticEye from '@/components/StaticEye';
import { EYE_COLORS } from '@/lib/cardStyle';
import { EYE, type Theme } from '@/lib/postcards';

/**
 * A tile in the style of the social posts: the eye in its halo, a bold line, the payoff in the
 * card's accent colour, and a sentence or two under it.
 */
export default function EyeTile({ id, theme, eye, n, title, payoff, body }: { id: string; theme: Theme; eye: keyof typeof EYE; n?: string; title: string; payoff: string; body: string }) {
  return (
    <article className={`eye-tile t-${theme}`}>
      <div className="et-top">
        <div className="et-eye" aria-hidden="true">
          <span className="pc-halo" />
          <span className="pc-well" />
          <StaticEye id={`tile-${id}`} state={EYE[eye]} {...EYE_COLORS[theme]} />
        </div>
        {n && <span className="et-n">{n}</span>}
      </div>
      <h3>{title}</h3>
      <p className="et-pay">{payoff}</p>
      <p className="et-body">{body}</p>
    </article>
  );
}
