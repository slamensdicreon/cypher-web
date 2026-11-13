import Decisions from '@/components/Decisions';
import Eye from '@/components/Eye';
import Reveal from '@/components/Reveal';
import Track from '@/components/Track';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import CtaLink from '@/components/site/CtaLink';
import DemoStart from '@/components/site/DemoStart';
import HeroVideo from '@/components/site/HeroVideo';
import { ProductShot, SectionHead } from '@/components/site/Product';

export default function Page() {
  return (
    <>
      <SiteHeader />

      <main className="wrap">
        <div className="hero-v">
          <div className="hero">
            <Eye />
            <div>
              <h1 className="line">Ignorance is bliss.</h1>
              <p>Cypher is twenty-one specialists and the mind that runs them. Point it at any enterprise platform and it builds, migrates, personalizes and optimizes, pixel perfect, for a rounding error of what you pay now. It doesn’t replace you. It promotes you.</p>
              <div className="hero-cta">
                <CtaLink href="/demo" label="home-hero" className="site-cta big">Book a demo</CtaLink>
                <span className="hero-note">Sitecore, Optimizely, Contentful, or whatever you run.</span>
              </div>
            </div>
          </div>
        </div>

        <section className="s home-product">
          <SectionHead center eyebrow="The product" title="This is Cypher." intro="Twenty-one specialists, one floor, every move on the record. Forty-two seconds under the hood." />
          <HeroVideo />
          <ul className="trust-strip">
            <li><b>Any enterprise platform</b><span>Sitecore, Optimizely, Contentful and the rest</span></li>
            <li><b>You hold the gates</b><span>Nothing ships past a gate without your approval</span></li>
            <li><b>Every action on the record</b><span>One gateway, an append-only log, any build replayed</span></li>
            <li><b>Yours when it’s done</b><span>Your code, your hosting, your keys</span></li>
          </ul>
        </section>

        <section className="s band lav">
          <Decisions />
        </section>

        <section className="s band white">
          <div className="beats">
            <div className="beat big"><h2>Your platform. <em>Our</em> problem.</h2><p>Any enterprise platform. It doesn’t stop at the build. <span className="mbr">That’s where most agencies stop.</span></p></div>
          </div>
          <div className="outcomes">
            <div className="outcome"><b>Build.</b><p>Websites, customer and member portals, storefronts, intranets. Pixel for pixel, and your marketers edit it on day one.</p></div>
            <div className="outcome"><b>Migrate.</b><p>Old platform to new, with nothing left behind. Content parity checked, every redirect kept, every page diffed against the original.</p></div>
            <div className="outcome"><b>Personalize.</b><p>The personalization you paid for and never switched on. Audiences, variants and A/B tests, set up and checked before you see them.</p></div>
            <div className="outcome"><b>Optimize.</b><p>Faster, accessible, findable. Lighthouse and axe on every representative page, SEO and redirects done, with the reports as evidence.</p></div>
          </div>
        </section>

        <section className="s">
          <SectionHead eyebrow="How it works" title="Point it at your site. Watch it work." intro="It plans, the team builds and checks, and you make about three decisions. That’s the job now." />
          <div className="hiw-cards">
            <article>
              <ProductShot shot="workbench" sizes="(min-width: 1000px) 340px, 100vw" />
              <span className="hiw-n">01</span>
              <h3>It writes the plan.</h3>
              <p>Discovery ends in a Blueprint: every component, template and page, and how. You approve it once.</p>
            </article>
            <article>
              <ProductShot shot="bliss" sizes="(min-width: 1000px) 340px, 100vw" />
              <span className="hiw-n">02</span>
              <h3>You make three decisions.</h3>
              <p>Each with Cypher’s pick and a deadline. Say nothing and it goes ahead. Everything else is on pace.</p>
            </article>
            <article>
              <ProductShot shot="activity" sizes="(min-width: 1000px) 340px, 100vw" />
              <span className="hiw-n">03</span>
              <h3>Every move is on the record.</h3>
              <p>Checked before it moves on, logged as it happens, replayable after. No status meetings.</p>
            </article>
          </div>
          <p className="sec-more"><CtaLink href="/how-it-works" label="home-how" className="more-link">See how it works</CtaLink></p>
        </section>

        <section className="s band dark">
          <div className="proofs">
            <div className="proof">
              <div className="num">$<i>512</i></div>
              <p>What it cost to run a build an agency quoted at <b>$400,000+</b>. We have the receipts.</p>
              <p className="fine">The cost of the run, not the price of Cypher.</p>
            </div>
            <div className="pillars">
              <div className="pillar"><b>Self-learning.</b><p>Every question becomes a rule. It never asks twice. Agencies ask the same question every project, and bill you for it.</p></div>
              <div className="pillar"><b>Self-healing.</b><p>Things break. It finds why, fixes it and carries on, before anyone thinks to file a ticket.</p></div>
              <div className="pillar"><b>Self-enhancing.</b><p>Every build rewrites its own playbook. It finishes better than it started. Name one vendor who can say that.</p></div>
            </div>
          </div>
        </section>

        <section className="s band white">
          <div className="proofclose">
            <p>We don’t need you to believe us. Point it at your site and watch.</p>
            <p>We’ve watched it conduct over <b>225,000</b> events. We don’t need you to tell us it works.</p>
          </div>
        </section>

        <section className="s band lav">
          <div className="creds">
            <div className="cred"><b>25</b><span>years of engineering, written down so it never has to be relearned.</span></div>
            <div className="cred"><b>10</b><span>years of enterprise platforms. Every pitfall, every workaround, every 2 AM fix.</span></div>
            <div className="cred"><b>MVPs</b><span>Platform MVPs built this. Yes, really.</span></div>
          </div>
        </section>

        <section className="s">
          <div className="plhead"><h2>Your annual roadmap. In a week.</h2><p>Playbooks, not projects. Same crew every day, on any platform, and not one change order.</p></div>
          <div className="week">
            <div className="day"><span className="dn">Mon</span><b>The website.</b><span className="dl">Pixel for pixel. Marketers edit it on day one.</span></div>
            <div className="day"><span className="dn">Tue</span><b>The customer portal.</b><span className="dl">Log in, self-serve, done.</span></div>
            <div className="day"><span className="dn">Wed</span><b>The migration.</b><span className="dl">Six sites into one. Every redirect kept.</span></div>
            <div className="day"><span className="dn">Thu</span><b>Personalization.</b><span className="dl">Switched on. Finally.</span></div>
            <div className="day yours"><span className="dn">Fri</span><b>Yours.</b><span className="dl">The idea nobody would fund. <span className="mbr">Bring it.</span></span></div>
          </div>
          <p className="weeknote">Also on the menu: thirty brand sites on one design system, storefronts, intranets, member portals, A/B tests, accessibility, performance, SEO. Weekends are for whatever your agency said would take a quarter.</p>
          <p className="sec-more"><CtaLink href="/playbooks" label="home-playbooks" className="more-link">Explore the playbooks</CtaLink></p>
        </section>

        <section className="s band white">
          <SectionHead eyebrow="Built for the enterprise" title="Built for people who get audited." intro="Cypher moves fast. It doesn’t move loose." />
          <div className="ent-grid">
            <div><b>Governed</b><p>Playbooks with phases and gates. Roles that can’t mark their own work. You approve the Blueprint and sign off UAT.</p></div>
            <div><b>On the record</b><p>Every action through one gateway into an append-only log: who, which tool, what happened, what it cost. Export it any time.</p></div>
            <div><b>Contained</b><p>Each client in its own space. Cypher asks for the access a job needs and records what it can see.</p></div>
            <div><b>Yours</b><p>Your code in your repository, your hosting, your keys. An editor guide, a component catalog and a known-gaps report at handover.</p></div>
          </div>
        </section>

        <section className="s band dark demo-home" id="join">
          <div className="dh-copy">
            <h2>See it on your site.</h2>
            <p>Book a demo. Cypher works on your site, on whatever platform you run, while you watch.</p>
          </div>
          <DemoStart label="home-band" />
        </section>

      </main>
      <SiteFooter />
      <Reveal />
      <Track />
    </>
  );
}
