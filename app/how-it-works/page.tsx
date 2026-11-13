import type { Metadata } from 'next';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import CtaLink from '@/components/site/CtaLink';
import { FeatureRow, PhaseStrip, ProductShot, SectionHead } from '@/components/site/Product';
import { BlissEverything, FloorLoop } from '@/components/site/ProductMotion';
import { DemoBand, Faq, PageHero } from '@/components/site/parts';

const description =
  'How Cypher runs a project, start to finish: day zero, the plan of record, a team of twenty-one, your three decisions, every move on the record, and a handover that’s yours. On Sitecore, Optimizely, Contentful or any enterprise platform.';

export const metadata: Metadata = {
  title: 'How it works | Cypher',
  description,
  alternates: { canonical: '/how-it-works' },
  openGraph: { type: 'website', url: '/how-it-works', siteName: 'Cypher', locale: 'en_US', title: 'How Cypher works', description },
  twitter: { card: 'summary_large_image', title: 'How Cypher works', description },
};

const HANDOVER = [
  ['Your code', 'In your repository, readable, commented where it matters. No lock-in, no ransom.'],
  ['Your hosting', 'Deployed where you run things, with the environments named and the keys yours.'],
  ['An editor guide', 'How your marketers edit every page and component. They edit on day one.'],
  ['A component catalog', 'Every component, its fields, its variants and where it’s used.'],
  ['The evidence', 'Parity, accessibility and performance reports, page by page.'],
  ['A known-gaps report', 'Anything not done, and why, in writing. No surprises in month three.'],
] as const;

const QA = [
  { q: 'What do you need from us to start?', a: 'Your site, your platform and what you want done. For the build itself, access to the platform and a repository. Cypher records what it can see and asks for nothing it doesn’t need.' },
  { q: 'Who is actually doing the work?', a: 'Cypher’s team of specialists, each one an agent with a brief, a lead and checks on its work, run by Cypher. People who know the platforms stand behind every project.' },
  { q: 'How often will you need me?', a: 'About three times a build, for decisions that are genuinely yours. Each comes with Cypher’s pick and a deadline, and if you say nothing, it goes ahead with its pick.' },
  { q: 'Can we see everything it does?', a: 'Everything. Switch to Everything for the full console, or read the activity log: every action, who took it, with which tool, what happened and what it cost.' },
  { q: 'Which platforms?', a: 'Any enterprise platform. Sitecore, Optimizely and Contentful are home turf.' },
];

/** How it works: one project, start to finish, on the real screens. */
export default function HowItWorks() {
  return (
    <>
      <SiteHeader />
      <main className="wrap">
        <div className="page-top">
          <PageHero
            trail={[{ name: 'How it works', href: '/how-it-works' }]}
            title="Point it at your site. Watch it work."
            lead="Cypher runs a project the way your best team would, if your best team never slept, never forgot and wrote everything down. Here’s the whole thing, start to finish, on the real screens."
          >
            <CtaLink href="/demo" label="how-hero" className="site-cta big">Book a demo</CtaLink>
          </PageHero>
          <ProductShot shot="everything" priority caption="Mission control: the phases and gates, what’s registered, cost against budget, what needs you, and the team at work." />
        </div>

        <section className="s band white">
          <SectionHead title="Ten phases. Two gates. You hold both." intro="Every project runs the same phases, in order, from a playbook. Nothing moves past a gate without your approval." />
          <PhaseStrip />
        </section>

        <section className="s steps-run">
          <FeatureRow
            title="Tell it what you run."
            body="Your site, your platform, what you want done. It verifies access, records what it finds and writes down the facts it will build on. No kickoff. No workshop. No discovery invoice."
            points={['Verifies credentials and records the platform’s facts', 'Crawls the live site and inventories every page', 'Lists components, routes and assets before anyone builds']}
            shot="plan"
          />
          <FeatureRow
            flip
            title="It writes the Blueprint. You approve it once."
            body="Discovery ends in an Implementation Blueprint: every component, template, page and media item the team will build, and how. You approve it at the first gate. After that, nothing changes without you knowing."
            points={['Component inventory, page inventory, platform notes', 'Versioned, with who wrote it and when you approved it']}
            shot="workbench"
          />
          <FeatureRow
            title="Twenty-one specialists. One mind running them."
            body="Discovery, engineering, content, quality and release, each with a lead. They pick up work in order, hand it on and check each other’s. The same crew every day, on any platform."
            points={['Solution architect, content analyst, component engineer, migrators', 'Parity auditor, performance and accessibility QA, deployment engineer', 'Cypher as chief of staff, so you talk to one voice']}
          >
            <FloorLoop caption="The Floor: who’s working, on what, and what they handed on." />
          </FeatureRow>
          <FeatureRow
            flip
            title="It asks you three things. Not three hundred."
            body="When something is genuinely yours (a source of truth, a trade-off, a risk), it arrives as a card: the question, Cypher’s pick and why, and a deadline. Say nothing and it goes ahead with its pick. Everything else is on pace."
            points={['Every card says what happens if you don’t answer', 'Defer it, or ask the specialist who raised it']}
            shot="bliss"
          />
          <FeatureRow
            title="Every move checked. Every move logged."
            body="Every action passes one gateway and lands in an append-only log: who, which tool, what happened, how long it took and what it cost. Validators review each component before it moves on. Any build can be replayed, step by step."
            points={['Export the log any time', 'Warnings and failures surface on their own']}
            shot="activity"
          />
          <FeatureRow
            flip
            title="You always know. Without a status meeting."
            body="Phases, gates, what’s running and what’s queued, decisions settled without you, recommendations taken, and spend by phase. Or just ask Cypher, in a sentence."
            points={['A scorecard for every project', 'Cost of the run against its budget, as it happens']}
            shot="scorecard"
          />
        </section>

        <section className="s band white">
          <SectionHead title="One sentence, or the whole console. Your choice, per screen." intro="Most days you want to know two things: is it on pace, and what’s mine. On the days you want the rest, it’s all there." />
          <BlissEverything />
        </section>

        <section className="s">
          <SectionHead title="When it’s done, it’s yours." intro="No retainer to keep the lights on. No knowledge that leaves when a team rolls off." />
          <div className="handover">
            {HANDOVER.map(([t, b]) => (
              <div key={t}><b>{t}</b><p>{b}</p></div>
            ))}
          </div>
        </section>

        <section className="s">
          <SectionHead title="Questions people ask" />
          <Faq items={QA} />
        </section>
        <DemoBand label="how-band" line="See it on your site." sub="Thirty minutes. Cypher on your site, on your platform. No slides." />
      </main>
      <SiteFooter />
      <Track />
    </>
  );
}
