import Link from 'next/link';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import CtaLink from '@/components/site/CtaLink';
import JsonLd from '@/components/site/JsonLd';
import { Arrow, EyeMark } from '@/components/site/Marks';
import { Breadcrumbs, Faq, type Crumb } from '@/components/site/parts';
import { entry } from '@/lib/content';
import type { Page } from '@/lib/content/types';
import { contentPage, faqPage, graph } from '@/lib/schema';

const fmtDate = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

/**
 * Every long page on the site: the breadcrumb, the H1 in Cypher's voice, the answer first, the
 * sections, then questions, related pages and the one action. Its structured data says the same
 * thing the page does.
 */
export default function Article({
  page,
  path,
  trail,
  label,
  article = false,
  heroCta = true,
  children,
}: {
  page: Page;
  path: string;
  trail: Crumb[];
  /** The analytics label for this page's calls to action. */
  label: string;
  /** An answer or guide (Article) rather than a product page (WebPage). */
  article?: boolean;
  /** Show Book a demo under the answer; answers keep it for the end. */
  heroCta?: boolean;
  /** Anything that belongs after the sections, such as a checklist. */
  children?: React.ReactNode;
}) {
  const related = page.related.map((p) => entry(p)).filter((e): e is NonNullable<typeof e> => !!e && e.path !== path);
  return (
    <div className="bl">
      <SiteHeader />
      <main>
        <article className="bl-w bl-art">
          <header className="bl-art-head">
            <Breadcrumbs trail={trail} />
            <h1 className={`bl-voice-h1 inner${page.h1.light ? '' : ' q'}`}>
              {page.h1.light}{page.h1.light && page.h1.bold ? ' ' : ''}{page.h1.bold && <b>{page.h1.bold}</b>}
            </h1>
            <p className="bl-answer">{page.answer}</p>
            <div className="bl-art-meta">
              {heroCta && <CtaLink href="/demo" label={`${label}-hero`} className="bl-btn bl-btn-ink">Book a demo</CtaLink>}
              <span className="bl-meta">Updated <time dateTime={page.updated}>{fmtDate(page.updated)}</time></span>
            </div>
          </header>

          <div className="bl-art-body">
            {page.blocks.map((b) => (
              <section key={b.h} className="bl-art-sec">
                <h2>{b.h}</h2>
                {b.p?.map((t) => <p key={t}>{t}</p>)}
                {b.list && (
                  <ul className="bl-art-list">
                    {b.list.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                )}
                {b.steps && (
                  <ol className="bl-art-steps">
                    {b.steps.map((s, i) => (
                      <li key={s.t}><span className="bl-step-n" aria-hidden="true">{i + 1}</span><span><b>{s.t}</b><span>{s.b}</span></span></li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
            {children}
            {page.faq.length > 0 && (
              <section className="bl-art-sec">
                <h2>Questions people ask</h2>
                <Faq items={page.faq} />
              </section>
            )}
          </div>

          {related.length > 0 && (
            <section className="bl-art-related" aria-labelledby="related-h">
              <h2 id="related-h" className="bl-h3">Read next</h2>
              <ul className="bl-related">
                {related.slice(0, 6).map((r) => (
                  <li key={r.path}>
                    <Link href={r.path} className="bl-rel">
                      <b>{r.name}</b>
                      <span className="bl-rel-line">{r.line}</span>
                      <span className="bl-rel-arrow" aria-hidden="true"><Arrow /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bl-after">
            <div className="bl-cta-card">
              <span className="bl-said"><EyeMark state="needs" size={64} /><span className="bl-voice small">See it on your site. <b>Thirty minutes, no slides.</b></span></span>
              <CtaLink href="/demo" label={`${label}-band`} className="bl-btn bl-btn-ink">Book a demo</CtaLink>
            </div>
          </section>
        </article>
      </main>
      <SiteFooter />
      <Track />
      <JsonLd data={graph(contentPage({ path, title: page.h1.bold || `${page.h1.light}`, description: page.description, updated: page.updated, article }), ...(page.faq.length ? [faqPage(page.faq)] : []))} />
    </div>
  );
}

/** An index page: the header, the content, the one action, the footer, and its structured data. */
export function IndexShell({ label, data, children }: { label: string; data: object; children: React.ReactNode }) {
  return (
    <div className="bl">
      <SiteHeader />
      <main>
        {children}
        <section className="bl-w bl-after">
          <div className="bl-cta-card">
            <span className="bl-said"><EyeMark state="needs" size={64} /><span className="bl-voice small">See it on your site. <b>Thirty minutes, no slides.</b></span></span>
            <CtaLink href="/demo" label={`${label}-band`} className="bl-btn bl-btn-ink">Book a demo</CtaLink>
          </div>
        </section>
      </main>
      <SiteFooter />
      <Track />
      <JsonLd data={data} />
    </div>
  );
}

/** The top of an index page: breadcrumb, the line, the lead. */
export function IndexHero({ trail, light, bold, lead }: { trail: Crumb[]; light: string; bold: string; lead: string }) {
  return (
    <section className="bl-w bl-inner-hero single">
      <div className="bl-stack-sm">
        <Breadcrumbs trail={trail} />
        <h1 className="bl-voice-h1 inner">{light} <b>{bold}</b></h1>
        <p className="bl-hero-p left">{lead}</p>
      </div>
    </section>
  );
}

/** A card linking to a page, for the index pages. */
export function Card({ href, name, line }: { href: string; name: string; line: string }) {
  return (
    <li>
      <Link href={href} className="bl-rel">
        <b>{name}</b>
        <span className="bl-rel-line">{line}</span>
        <span className="bl-rel-arrow" aria-hidden="true"><Arrow /></span>
      </Link>
    </li>
  );
}
