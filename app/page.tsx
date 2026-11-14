import type { Metadata, Viewport } from 'next';
import Eye from '@/components/Eye';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import JsonLd from '@/components/site/JsonLd';
import { graph, homeVideo, organization, software, website } from '@/lib/schema';
import CtaLink from '@/components/site/CtaLink';
import DemoStart from '@/components/site/DemoStart';
import HomeVideo from '@/components/site/HomeVideo';
import { EyeMark } from '@/components/site/Marks';

const description =
  'Twenty-one AI specialists and the mind that runs them. Cypher builds, migrates, personalizes and optimizes sites on Sitecore, Optimizely, Contentful and more.';

export const metadata: Metadata = {
  title: { absolute: 'Cypher | AI website builds, migrations and personalization' },
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName: 'Cypher', locale: 'en_US', title: 'Ignorance is bliss.', description },
  twitter: { card: 'summary_large_image', title: 'Ignorance is bliss.', description },
};

export const viewport: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };

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
          <HomeVideo />
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
      <JsonLd data={graph(organization(), website(), software(), homeVideo())} />
    </div>
  );
}
