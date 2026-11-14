import type { Metadata, Viewport } from 'next';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import CtaLink from '@/components/site/CtaLink';
import { EyeMark } from '@/components/site/Marks';
import { Breadcrumbs } from '@/components/site/parts';
import Link from 'next/link';
import { PLAYBOOKS } from '@/lib/content';

const description =
  'Cypher works from playbooks, not blank pages: new sites, migrations, portals, personalization and optimization, run the same way every time, on any platform.';

export const metadata: Metadata = {
  title: { absolute: 'Playbooks for website builds, migrations and personalization' },
  description,
  alternates: { canonical: '/playbooks' },
  openGraph: { type: 'website', url: '/playbooks', siteName: 'Cypher', locale: 'en_US', title: 'Playbooks, not projects', description },
  twitter: { card: 'summary_large_image', title: 'Playbooks, not projects', description },
};

export const viewport: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };

const ANATOMY = [
  ['The steps and sign-offs', 'From brief to launch, with the two moments you approve.'],
  ['The team', 'The specialists the work needs, each with a lead and someone checking their work.'],
  ['What done means', 'Speed, accessibility, how it looks everywhere and how easily your team edits it, agreed before anyone starts.'],
  ['The checks', 'Every page, component and redirect reviewed before it moves on. Nobody marks their own homework.'],
  ['The know-how', 'Every 2 AM fix, written down so it never happens at 2 AM again.'],
  ['Your answers', 'Answer once and it’s a rule. You’re never asked the same thing twice.'],
] as const;

const PLATFORMS = 'Sitecore · Optimizely · Contentful · and more';

/** Playbooks: every outcome a marketer wants, written down and run the same way every time. */
export default function Playbooks() {
  return (
    <div className="bl">
      <SiteHeader />

      <main>
        <section className="bl-w bl-inner-hero single">
          <div className="bl-stack-sm">
            <Breadcrumbs trail={[{ name: 'Playbooks', href: '/playbooks' }]} />
            <h1 className="bl-voice-h1 inner">I don’t start from a blank page. <b>I start from a playbook.</b></h1>
            <p className="bl-hero-p left">Every outcome you want to grow, written down: the steps, the team, the checks and every lesson from the last launch. That’s why it’s live in days, not quarters, and why there’s never a change order.</p>
            <div className="bl-ctas left"><CtaLink href="/demo" label="playbooks-hero" className="bl-btn bl-btn-ink">Book a demo</CtaLink></div>
          </div>
        </section>

        <section className="bl-w bl-after bl-stack">
          <div className="bl-head">
            <h2 className="bl-h2">Pick an outcome. There’s a playbook for it.</h2>
            <p className="bl-lead">Run several at once: the migration on Monday, personalization on Thursday.</p>
          </div>
          <div className="bl-pb-grid">
            {PLAYBOOKS.map((p) => (
              <article key={p.slug} className={`bl-pb${p.demo ? ' demo' : ''}`}>
                {p.demo && <span className="bl-yours-label"><EyeMark state="needs" size={20} />The one in the demo</span>}
                <h3><Link className="bl-pb-link" href={`/playbooks/${p.slug}`}>{p.name}</Link></h3>
                <p>{p.card}</p>
                <ul>{p.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                {p.demo ? (
                  <CtaLink href="/demo" label="playbooks-card" className="bl-pb-foot bl-pb-cta">Book a demo</CtaLink>
                ) : (
                  <span className="bl-pb-foot">{PLATFORMS}</span>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="bl-band">
          <div className="bl-w bl-sec bl-split">
            <div className="bl-head">
              <h2 className="bl-h2">Everything your best launch ever learned. Written down.</h2>
              <p className="bl-lead">A playbook isn’t a template. It’s how the work gets done, who does it, how it’s checked, and what to watch for on your platform.</p>
            </div>
            <ol className="bl-toc">
              {ANATOMY.map(([t, b], i) => (
                <li key={t}><span className="bl-toc-n">{i + 1}</span><span><b>{t}</b><span>{b}</span></span></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bl-w bl-sec bl-stack">
          <div className="bl-head">
            <h2 className="bl-h2">Every launch makes the next one better.</h2>
            <p className="bl-lead">What worked goes into the playbook. Your project stays on the version it started with, so nothing moves under you, and your next launch starts smarter.</p>
          </div>
          <div className="bl-loop">
            <div className="bl-panel"><b className="bl-loop-t">This launch</b><span>You answer a question once. It becomes a rule for everything like it.</span></div>
            <div className="bl-panel ink"><b className="bl-loop-t"><EyeMark state="watching" size={28} tone="shell" />The playbook</b><span>What worked, and what to watch for on your platform, goes into its next version.</span></div>
            <div className="bl-panel"><b className="bl-loop-t">Your next launch</b><span>Starts from the better version. Yours never changes mid-flight.</span></div>
          </div>
        </section>

        <section className="bl-w bl-after">
          <div className="bl-cta-card">
            <span className="bl-said"><EyeMark state="needs" size={64} /><span className="bl-voice small">Bring a goal. <b>I’ll bring the playbook.</b></span></span>
            <CtaLink href="/demo" label="playbooks-band" className="bl-btn bl-btn-ink">Book a demo</CtaLink>
          </div>
        </section>
      </main>

      <SiteFooter />
      <Track />
    </div>
  );
}
