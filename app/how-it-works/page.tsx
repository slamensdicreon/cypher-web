import type { Metadata, Viewport } from 'next';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import JsonLd from '@/components/site/JsonLd';
import { contentPage, faqPage, graph } from '@/lib/schema';
import CtaLink from '@/components/site/CtaLink';
import { Check, EyeMark } from '@/components/site/Marks';
import { Breadcrumbs, Faq } from '@/components/site/parts';

const description =
  'How Cypher works with marketers: approve the plan once, answer about three questions and edit everything on day one. On Sitecore, Optimizely, Contentful and more.';

export const metadata: Metadata = {
  title: { absolute: 'How Cypher works | AI-run website projects, start to launch' },
  description,
  alternates: { canonical: '/how-it-works' },
  openGraph: { type: 'website', url: '/how-it-works', siteName: 'Cypher', locale: 'en_US', title: 'How Cypher works', description },
  twitter: { card: 'summary_large_image', title: 'How Cypher works', description },
};

export const viewport: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };

/** The ten phases, coloured by the team that owns each; two of them are the marketer's. */
const PHASES = [
  ['Intake', 'iris'], ['Discovery', 'iris'], ['Blueprint', 'iris', true], ['Foundation', 'blue'], ['Components', 'blue'],
  ['Templates', 'blue'], ['Migration', 'teal'], ['Experience', 'teal'], ['Deployment', 'blue'], ['UAT', 'gold', true],
] as const;

const TEAM = [
  ['AJ', 'Aisha', 'Solution architect', 'iris'],
  ['MG', 'Maria', 'Content analyst', 'teal'],
  ['EC', 'Emily', 'Component engineer', 'blue'],
  ['RM', 'Ryan', 'Deployment engineer', 'blue'],
  ['PP', 'Priya', 'Accessibility QA', 'gold'],
] as const;

const HANDOVER = [
  ['Pages your team edits', 'Built in your platform, the way you already work.'],
  ['Components you reuse', 'Every component, its fields and its variants, in a catalog.'],
  ['An editor guide', 'How to change every page, written for marketers.'],
  ['Your code and keys', 'In your repository and your hosting. No lock-in.'],
  ['The evidence', 'Speed, accessibility and parity reports, page by page.'],
  ['A known-gaps report', 'Anything not done, and why, in writing.'],
] as const;

const QA = [
  { q: 'How much of my time does it take?', a: 'About three decisions a build, each with my pick and a deadline. The rest is on me.' },
  { q: 'Do I need a developer?', a: 'No. You bring the goals and the calls. My specialists build, and people who know the platforms stand behind every project.' },
  { q: 'Will my team be able to edit it?', a: 'On day one. Everything is built in your platform, with an editor guide written for marketers.' },
  { q: 'Which platforms?', a: 'Any enterprise platform. Sitecore, Optimizely and Contentful are home turf.' },
];

/** How it works: how Cypher and a marketer work together, start to launch. */
export default function HowItWorks() {
  return (
    <div className="bl">
      <SiteHeader />

      <main>
        <section className="bl-w bl-inner-hero">
          <div className="bl-stack-sm">
            <Breadcrumbs trail={[{ name: 'How it works', href: '/how-it-works' }]} />
            <h1 className="bl-voice-h1 inner">Here’s how we work together. <b>You stay in charge of the brand.</b></h1>
            <p className="bl-hero-p left">You bring the goals and the brand. I bring twenty-one specialists who build, test and launch. You approve the plan, answer about three questions and say when it goes live.</p>
            <div className="bl-ctas left"><CtaLink href="/demo" label="how-hero" className="bl-btn bl-btn-ink">Book a demo</CtaLink></div>
          </div>
          <div className="bl-hero-mark">
            <span className="bl-halo bl-halo-quiet"><EyeMark state="watching" size={150} label="Cypher, watching" /></span>
          </div>
        </section>

        <section className="bl-w bl-after">
          <div className="bl-panel bl-phases">
            <div className="bl-phases-head">
              <h2 className="bl-h3">Ten steps from brief to launch. Two of them are yours.</h2>
              <span className="bl-legend">
                <span><i className="bg-iris" />Discovery</span><span><i className="bg-blue" />Engineering</span><span><i className="bg-teal" />Content</span><span><i className="bg-gold" />Quality</span>
              </span>
            </div>
            <ol className="bl-phase-list">
              {PHASES.map(([name, team, gate]) => (
                <li key={name}><span className={`bl-seg bg-${team}`} aria-hidden="true" /><b>{name}</b>{gate && <span className="bl-gate">Your gate</span>}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bl-w bl-steps">
          <div className="bl-step">
            <div className="bl-step-copy">
              <span className="bl-step-n" aria-hidden="true">1</span>
              <h3>Tell me what you want to grow.</h3>
              <p>Your site, your platform, what you want to launch. I read your brand, inventory every page and write down what I find. No kickoff workshop, no discovery invoice.</p>
            </div>
            <ul className="bl-panel bl-list bl-list-panel">
              <li><Check />Your brand recorded: colors, type, components</li>
              <li><Check />Every page on your site inventoried</li>
              <li><Check />Platform access checked</li>
              <li><Check />Your goals written down before anyone builds</li>
            </ul>
          </div>

          <div className="bl-step">
            <div className="bl-step-copy">
              <span className="bl-step-n" aria-hidden="true">2</span>
              <h3>I write the plan. You approve it once.</h3>
              <p>Every page, component and audience I’ll build, and how they look in your brand. You approve it once. After that, nothing changes without you knowing.</p>
            </div>
            <div className="bl-panel" aria-hidden="true">
              <span className="bl-doc-head"><b>Spring launch plan</b><span className="bl-meta">Version 1 · written by Aisha, Discovery</span></span>
              <span className="bl-doc-row">Pages and templates</span>
              <span className="bl-doc-row">Components, in your brand</span>
              <span className="bl-doc-row">Audiences and variants</span>
              <span className="bl-row-end"><span className="bl-chip">Approve</span><span className="bl-dec-label c-coral">Your sign-off</span></span>
            </div>
          </div>

          <div className="bl-step">
            <div className="bl-step-copy">
              <span className="bl-step-n" aria-hidden="true">3</span>
              <h3>Twenty-one specialists. One voice.</h3>
              <p>Content, engineering and quality, each with a lead, checking each other’s work. You never chase a developer or wait in a queue. You talk to me.</p>
            </div>
            <ul className="bl-team">
              {TEAM.map(([ini, name, role, team]) => (
                <li key={name} className="bl-person"><span className={`bl-av bg-${team}`} aria-hidden="true">{ini}</span><span><b>{name}</b><span className="bl-meta">{role}</span></span></li>
              ))}
              <li className="bl-person more">and sixteen more</li>
            </ul>
          </div>

          <div className="bl-step">
            <div className="bl-step-copy">
              <span className="bl-step-n" aria-hidden="true">4</span>
              <h3>I ask about three things. The ones only you can answer.</h3>
              <p>Brand, audience, offer: when a call is genuinely yours, it arrives with my pick, my reason and a deadline. Say nothing and I go ahead.</p>
            </div>
            <div className="bl-yours raised" aria-label="A decision card">
              <span className="bl-yours-label"><EyeMark state="needs" size={20} />Yours<span className="bl-push">4:00</span></span>
              <b className="bl-card-title">Which call to action leads the product page?</b>
              <p>Both are on brand. The page can only lead with one.</p>
              <span className="bl-pick"><span><b>I’d lead with ‘Find a store’.</b> It matches the spring campaign.</span></span>
              <span className="bl-chips" aria-hidden="true"><span className="bl-chip">Find a store</span><span className="bl-chip alt">Shop online</span></span>
              <span className="bl-meta">Raised by Maria, Content · 6 min ago</span>
            </div>
          </div>

          <div className="bl-step">
            <div className="bl-step-copy">
              <span className="bl-step-n" aria-hidden="true">5</span>
              <h3>You edit everything on day one.</h3>
              <p>Every page is built in your platform, the way your team already works. Change a headline, swap an image, launch a variant: no ticket, no developer.</p>
            </div>
            <div className="bl-panel" aria-hidden="true">
              <span className="bl-doc-head row"><b>Spring hero</b><span className="bl-meta">Sitecore · Optimizely · Contentful</span></span>
              <span className="bl-field"><span>Headline</span><span className="bl-field-v">Spring, sorted.</span></span>
              <span className="bl-field"><span>Call to action</span><span className="bl-field-v">Find a store</span></span>
              <span className="bl-field"><span>Who sees it</span><span className="bl-field-v">Returning visitors</span></span>
              <span className="bl-row-end"><span className="bl-chip">Publish</span><span className="bl-chip alt">Preview</span></span>
            </div>
          </div>

          <div className="bl-step">
            <div className="bl-step-copy">
              <span className="bl-step-n" aria-hidden="true">6</span>
              <h3>You always know. Without a status meeting.</h3>
              <p>Where it stands, what’s live and what I settled without you. Every change is on the record, so you can show anyone exactly what happened.</p>
            </div>
            <div className="bl-panel roomy">
              <span className="bl-said"><EyeMark state="resting" size={56} /><span className="bl-voice small">On pace. <b>Nothing needs you</b> until Thursday.</span></span>
              <span className="bl-track" aria-hidden="true">{PHASES.map(([name, team], i) => <span key={name} className={i < 5 ? `bg-${team}` : ''} />)}</span>
              <span className="bl-meta">Halfway to launch. Eleven questions settled without you this week.</span>
            </div>
          </div>
        </section>

        <section className="bl-band">
          <div className="bl-w bl-sec bl-stack">
            <div className="bl-head">
              <h2 className="bl-h2">One sentence, or every detail.</h2>
              <p className="bl-lead">Most days you want two things: is it on track, and what needs you. When your CMO wants the detail, it’s one tap away.</p>
            </div>
            <div className="bl-modes">
              <div className="bl-mode light">
                <b>Bliss</b>
                <p className="bl-voice small">The spring pages are live. <b>One thing needs you</b> before 2:24.</p>
                <span className="bl-meta">The default. A sentence, at most three things that are yours, one line for everything else.</span>
              </div>
              <div className="bl-mode dark">
                <b>Everything</b>
                <span className="bl-kpis">
                  <span className="bl-kpi"><span>Pages built</span><b>8 <i>of 16</i></b></span>
                  <span className="bl-kpi"><span>Tests running</span><b>3</b></span>
                </span>
                <span className="bl-mode-note">The full console: tables, metrics, the activity log, and Cypher as a chat.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bl-w bl-sec bl-stack">
          <h2 className="bl-h2">When it’s done, it’s yours.</h2>
          <ul className="bl-hand">
            {HANDOVER.map(([t, b]) => (
              <li key={t}><Check size={22} /><span><b>{t}</b><span>{b}</span></span></li>
            ))}
          </ul>
        </section>

        <section className="bl-w bl-after bl-faq-sec">
          <h2 className="bl-h2">Questions people ask.</h2>
          <Faq items={QA} />
        </section>

        <section className="bl-w bl-after">
          <div className="bl-cta-card">
            <span className="bl-said"><EyeMark state="needs" size={64} /><span className="bl-voice small">Thirty minutes, on your site. <b>No slides.</b></span></span>
            <CtaLink href="/demo" label="how-band" className="bl-btn bl-btn-ink">Book a demo</CtaLink>
          </div>
        </section>
      </main>

      <SiteFooter />
      <Track />
      <JsonLd data={graph(contentPage({ path: '/how-it-works', title: 'How Cypher works', description, updated: '2026-11-14' }), faqPage(QA))} />
    </div>
  );
}
