import CtaLink from '@/components/site/CtaLink';

/**
 * The building blocks of the site's internal pages. Every page uses the same few pieces, so the site
 * reads as one thing: a page hero, numbered steps, questions and answers, and the demo band.
 */

export function PageHero({ eyebrow, title, lead, children }: { eyebrow?: string; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="ph">
      {eyebrow && <span className="ph-eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {lead && <p className="ph-lead">{lead}</p>}
      {children && <div className="ph-actions">{children}</div>}
    </div>
  );
}

export function Steps({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="steps">
      {items.map((s, i) => (
        <li key={s.title}>
          <span className="st-n" aria-hidden="true">{i + 1}</span>
          <b>{s.title}</b>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** The band every page ends on: the one action. */
export function DemoBand({ line = 'See it on your site.', sub = 'Book a demo. Cypher works on your site while you watch.', label }: { line?: string; sub?: string; label: string }) {
  return (
    <section className="s band dark demo-band">
      <div>
        <h2>{line}</h2>
        <p>{sub}</p>
      </div>
      <CtaLink href="/demo" label={label} className="site-cta big">Book a demo</CtaLink>
    </section>
  );
}
