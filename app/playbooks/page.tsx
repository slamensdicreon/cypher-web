import type { Metadata } from 'next';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import CtaLink from '@/components/site/CtaLink';
import { FeatureRow, PhaseStrip, ProductShot, SectionHead } from '@/components/site/Product';
import { DemoBand, PageHero } from '@/components/site/parts';

const description =
  'Cypher works from playbooks, not blank pages: the phases, the team, the checks and every lesson from the last build, written down. Website builds, migrations, portals, personalization, optimization and more, on any enterprise platform.';

export const metadata: Metadata = {
  title: 'Playbooks | Cypher',
  description,
  alternates: { canonical: '/playbooks' },
  openGraph: { type: 'website', url: '/playbooks', siteName: 'Cypher', locale: 'en_US', title: 'Playbooks, not projects', description },
  twitter: { card: 'summary_large_image', title: 'Playbooks, not projects', description },
};

const ANATOMY = [
  ['The phases and gates', 'Intake to UAT, in order, with the gates where you approve. Nothing ships past a gate without you.'],
  ['The team', 'The roles the work needs, each with a brief, a lead and someone checking their work.'],
  ['The definition of done', 'What finished means, written before anyone starts: parity, accessibility, performance, the editor’s experience.'],
  ['The checks', 'Validators that review every component, page and redirect before it moves on. Nobody marks their own homework.'],
  ['The knowledge', 'Lessons, procedures and known pitfalls for the platform. Every 2 AM fix, written down so it never happens at 2 AM again.'],
  ['The rules', 'Your answers, kept. Ask once, applied to every card like it after. You’re never asked the same thing twice.'],
] as const;

const PLAYBOOKS = [
  { name: 'Website build', line: 'A new site, pixel for pixel. Marketers edit it on day one.', gets: ['Components, templates and pages', 'An editor guide and component catalog', 'Accessibility and performance reports'] },
  { name: 'Migration', line: 'Old platform to new, or six sites into one. Nothing left behind.', gets: ['Content parity of 98% or better', 'Every redirect kept', 'Visual parity at three breakpoints'] },
  { name: 'Customer and member portals', line: 'Log in, self-serve, done. The portal your service team keeps asking for.', gets: ['Journeys working end to end, by persona', 'Sign-in and profile wired to your systems', 'Tested on real accounts'] },
  { name: 'Personalization', line: 'The personalization you paid for and never switched on.', gets: ['Audiences and page variants', 'A/B/n tests configured in the platform', 'Each one verified before you see it'] },
  { name: 'Optimization', line: 'Faster, accessible, findable, with the reports as evidence.', gets: ['Lighthouse and axe on every representative page', 'SEO fields, sitemap and redirects', 'Error pages that help'] },
  { name: 'Design systems and brand sites', line: 'Thirty brand sites on one design system. Yes, thirty.', gets: ['One component library, many brands', 'Themes per brand, governance for all', 'New sites from the system, not from scratch'] },
  { name: 'Storefronts and intranets', line: 'The two projects that always slip a quarter. They won’t.', gets: ['Commerce or employee journeys end to end', 'Content models your teams can run', 'Hand-over your people can own'] },
  { name: 'Homepage rebuild', line: 'Your homepage, rebuilt on your platform, while you watch. It’s what we show you in the demo.', gets: ['Your real homepage, rebuilt', 'The replay of every step', 'What the rest would take'] },
] as const;

/** Playbooks: the method, written down, run the same way every time, and better every build. */
export default function Playbooks() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <div className="page-top">
          <PageHero
            trail={[{ name: 'Playbooks', href: '/playbooks' }]}
            title="Playbooks, not projects."
            lead="Every agency starts from a blank page and bills you for the learning curve. Cypher starts from a playbook: the method, the team, the checks and every lesson from the last build, written down and run the same way every time. Same crew every day, on any platform, and not one change order."
          >
            <CtaLink href="/demo" label="playbooks-hero" className="site-cta big">Book a demo</CtaLink>
          </PageHero>
          <ProductShot shot="plan" priority className="pf-narrow" caption="A playbook in motion: every phase, every activity, and the specialist who ran it." />
        </div>

        <section className="s">
          <SectionHead title="Everything your best project ever learned. Written down." intro="A playbook isn’t a template. It’s how the work is done, who does it, how it’s checked, and what to watch out for on your platform." />
          <div className="anatomy">
            {ANATOMY.map(([t, b], i) => (
              <div key={t}>
                <span className="an-n">{String(i + 1).padStart(2, '0')}</span>
                <b>{t}</b>
                <p>{b}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="s band white">
          <SectionHead title="Same order, every time. Two gates that are yours." intro="Discovery ends in a Blueprint you approve. The build ends in UAT you sign off. Everything between runs on its own, on the record." />
          <PhaseStrip />
        </section>

        <section className="s">
          <SectionHead title="Pick an outcome. There’s a playbook for it." intro="On Sitecore, Optimizely, Contentful or whatever you run. Several at once, if you like: a migration on Monday, personalization on Thursday." />
          <div className="pb-grid">
            {PLAYBOOKS.map((p) => (
              <article key={p.name} className="pb-card">
                <h3>{p.name}</h3>
                <p>{p.line}</p>
                <ul>{p.gets.map((g) => <li key={g}>{g}</li>)}</ul>
                <span className="pb-plat">Sitecore · Optimizely · Contentful · and more</span>
              </article>
            ))}
          </div>
        </section>

        <section className="s">
          <FeatureRow
            title="Every build rewrites its own playbook."
            body="Every answer you give becomes a rule. Every lesson goes into the next version of the playbook. Projects stay pinned to the version they started on, so nothing moves under you, and the next one starts smarter. Name one vendor who can say that."
            points={['Rules applied without asking you again', 'Lessons and known pitfalls per platform', 'Versioned: improvements land in the next project, not yours mid-flight']}
            shot="team"
            flip
          />
        </section>
        <DemoBand label="playbooks-band" line="Bring an outcome. We’ll bring the playbook." sub="Book a demo and watch one run on your site." />
      </main>
      <SiteFooter />
      <Track />
    </>
  );
}
