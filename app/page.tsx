import type { Viewport } from 'next';
import Eye from '@/components/Eye';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import CtaLink from '@/components/site/CtaLink';
import DemoStart from '@/components/site/DemoStart';
import { Check, EyeMark } from '@/components/site/Marks';

export const viewport: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };

const HANDLED = [
  ['The spring landing page, live and editable in your CMS.', '10:02'],
  ['Returning visitors now see their own hero.', '9:48'],
  ['Every old campaign URL redirected. Nothing lost.', '9:31'],
] as const;

const FOUR = [
  ['Launch.', 'New sites, campaign pages, portals and storefronts, pixel for pixel. Your team edits them on day one.'],
  ['Migrate.', 'Move platforms without losing a page or a URL. Every page checked against the original.'],
  ['Personalize.', 'The personalization you paid for and never switched on. Audiences, variants and tests, checked first.'],
  ['Optimize.', 'Faster, accessible and easier to find, with the reports to prove it.'],
] as const;

const WEEK = [
  ['Mon', 'The new site.', 'Pixel for pixel. Your team edits it on day one.'],
  ['Tue', 'The campaign pages.', 'Built, tested and live.'],
  ['Wed', 'The migration.', 'Six sites into one. Every URL kept.'],
  ['Thu', 'Personalization.', 'Switched on. Finally.'],
  ['Fri', 'Yours.', 'The idea nobody would fund. Bring it.'],
] as const;

/** Home: Cypher, speaking to the marketer who wants to grow a brand on their platform. */
export default function Page() {
  return (
    <div className="bl">
      <SiteHeader />

      <main>
        <section className="bl-w bl-hero">
          <Eye />
          <h1 className="bl-voice-h1">Your whole marketing roadmap, live in a week. <b>You make three decisions.</b></h1>
          <p className="bl-hero-p">I’m Cypher: twenty-one specialists and the mind that runs them. Bring me the new site, the campaign, the personalization you paid for and never switched on. I build it on Sitecore, Optimizely, Contentful or whatever you run, your team edits it on day one, and I only ask what a marketer should decide.</p>
          <div className="bl-ctas">
            <CtaLink href="/demo" label="home-hero" className="bl-btn bl-btn-ink">Book a demo</CtaLink>
            <CtaLink href="/how-it-works" label="home-how" className="bl-btn bl-btn-ghost">See how it works</CtaLink>
          </div>
        </section>

        <section className="bl-w bl-after">
          <figure className="bl-mock" aria-label="Cypher in Bliss mode, on a spring launch">
            <div className="bl-mock-top" aria-hidden="true">
              <span className="bl-project"><span className="bl-initials bg-blue">NW</span>Spring launch · Northwind</span>
              <span className="bl-dial"><span className="on">Bliss</span><span>Everything</span></span>
            </div>
            <p className="bl-voice">The spring pages are built. <b>One thing is yours,</b> before 2:24. Everything else is on pace.</p>
            <div className="bl-mock-grid">
              <div className="bl-yours">
                <span className="bl-yours-label"><EyeMark state="needs" size={20} />Yours<span className="bl-push">2:24</span></span>
                <h2 className="bl-card-title">Which hero leads the spring campaign?</h2>
                <p>Both versions are built and on brand. Maria is ready to publish.</p>
                <span className="bl-pick"><EyeMark state="watching" size={22} /><span><b>I’d test both.</b> Half your visitors see each, and I keep the winner.</span></span>
                <span className="bl-chips" aria-hidden="true"><span className="bl-chip">Test both</span><span className="bl-chip alt">Pick one</span></span>
                <span className="bl-meta">If you say nothing: I test both, at 2:24.</span>
              </div>
              <div className="bl-handled">
                <h3>Handled without you.</h3>
                <ul className="bl-list">
                  {HANDLED.map(([t, at]) => (
                    <li key={t}><Check /><span className="bl-grow">{t}</span><span className="bl-meta">{at}</span></li>
                  ))}
                </ul>
                <div className="bl-team-line">
                  <span className="bl-faces" aria-hidden="true">
                    <span className="bg-iris">AJ</span><span className="bg-blue">EC</span><span className="bg-teal">MG</span><span className="bg-gold">RP</span>
                  </span>
                  <span>Maria is waiting on you. <b>Everyone else is fine.</b></span>
                </div>
              </div>
            </div>
          </figure>
        </section>

        <section className="bl-w bl-after bl-stack">
          <h2 className="bl-h2 bl-measure">Four things marketers wait months for. Done in days.</h2>
          <div className="bl-four">
            {FOUR.map(([t, b]) => (
              <div key={t}><h3>{t}</h3><p>{b}</p></div>
            ))}
          </div>
        </section>

        <section className="bl-band">
          <div className="bl-w bl-sec bl-stack">
            <div className="bl-head">
              <h2 className="bl-h2">Three decisions. Not three hundred.</h2>
              <p className="bl-lead">The calls only a marketer can make, each with my pick and a deadline. Everything technical, I handle.</p>
            </div>
            <div className="bl-cards3">
              <article className="bl-dec">
                <span className="bl-dec-label c-iris">Gate 1 · The plan</span>
                <h3 className="bl-card-title">Approve the plan?</h3>
                <p>Every page, component and audience I’ll build, and how they look in your brand.</p>
                <span className="bl-pick"><span><b>I’d approve.</b> After this, nothing changes without you knowing.</span></span>
                <span className="bl-meta">If you say nothing: I wait. It’s your call.</span>
              </article>
              <article className="bl-dec coral">
                <span className="bl-dec-label c-coral">A question only you can answer</span>
                <h3 className="bl-card-title">Who sees the spring offer first?</h3>
                <p>Two audiences qualify. The offer can only lead for one.</p>
                <span className="bl-pick"><span><b>I’d start with returning visitors.</b> They already know the brand.</span></span>
                <span className="bl-meta">If you say nothing: returning visitors, at 4:00.</span>
              </article>
              <article className="bl-dec">
                <span className="bl-dec-label c-gold">Gate 2 · Launch</span>
                <h3 className="bl-card-title">Ready to go live?</h3>
                <p>Every page checked on phone, tablet and desktop, for speed and accessibility.</p>
                <span className="bl-pick"><span><b>It’s ready.</b> Anything not done is in writing.</span></span>
                <span className="bl-meta">If you say nothing: I wait. It’s your launch.</span>
              </article>
            </div>
          </div>
        </section>

        <section className="bl-ink">
          <div className="bl-w bl-proof">
            <div className="bl-proof-num">
              <span className="bl-num">$512</span>
              <p>What it cost to run a build an agency quoted at <b>$400,000+</b>. Think about what the rest of your budget could do.</p>
              <p className="bl-fine">The cost of the run, not the price of Cypher.</p>
            </div>
            <div>
              <div className="bl-pillars">
                <div><h3>Self-learning.</h3><p>Answer once and it’s a rule. I never ask twice.</p></div>
                <div><h3>Self-healing.</h3><p>Things break. I fix them before anyone files a ticket.</p></div>
                <div><h3>Self-enhancing.</h3><p>Every launch makes the next one better.</p></div>
              </div>
              <p className="bl-proof-more"><b>225,000</b> events conducted. Twenty-five years of engineering, written down.</p>
            </div>
          </div>
        </section>

        <section className="bl-w bl-sec bl-stack">
          <div className="bl-head">
            <h2 className="bl-h2">Your annual roadmap. In a week.</h2>
            <p className="bl-lead">No dev queue. No change orders. No waiting for next quarter. Playbooks, not projects.</p>
          </div>
          <div className="bl-week">
            {WEEK.map(([d, t, l]) => (
              <div key={d} className="bl-day"><span className="bl-dn">{d}</span><b>{t}</b><span className="bl-dl">{l}</span></div>
            ))}
          </div>
          <CtaLink href="/playbooks" label="home-playbooks" className="bl-more">Explore the playbooks</CtaLink>
        </section>

        <section className="bl-w bl-closing" id="join">
          <EyeMark state="resting" size={72} />
          <h2 className="bl-giant">Ignorance is bliss.</h2>
          <p className="bl-closing-p">Book a demo. <b>I’ll rebuild your homepage while you watch.</b></p>
          <DemoStart label="home-band" />
        </section>
      </main>

      <SiteFooter />
      <Track />
    </div>
  );
}
