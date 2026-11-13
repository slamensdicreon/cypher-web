import Link from 'next/link';
import CtaLink from '@/components/site/CtaLink';
import { SITE_URL } from '@/lib/site';

/**
 * The building blocks of the site's internal pages. Every page uses the same few pieces, so the site
 * reads as one thing: breadcrumbs and a page hero, numbered steps, questions and answers, and the
 * demo band.
 */

export type Crumb = { name: string; href: string };

/** Where you are: Home, then each page down to this one. Also written out for search engines. */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const all = [{ name: 'Home', href: '/' }, ...trail];
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE_URL + c.href })),
  };
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {all.map((c, i) => (
          <li key={c.href}>{i < all.length - 1 ? <Link href={c.href}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}

export function PageHero({ trail, title, lead, children }: { trail: Crumb[]; title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="ph">
      <Breadcrumbs trail={trail} />
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
