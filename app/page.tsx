import Decisions from '@/components/Decisions';
import Eye from '@/components/Eye';
import InterestForm from '@/components/InterestForm';
import Reveal from '@/components/Reveal';
import SiteHeader, { Resting } from '@/components/SiteHeader';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <SiteHeader />

      <main className="wrap">
        <div className="hero">
          <Eye />
          <div>
            <h1 className="line">Ignorance is bliss.</h1>
            <p>Cypher is twenty-one specialists and the mind that runs them. Point it at anything on SitecoreAI and it ships, pixel perfect, for a rounding error of what you pay now. It doesn’t replace you. It promotes you.</p>
          </div>
        </div>

        <section className="s band lav">
          <Decisions />
        </section>

        <section className="s band white">
          <div className="beats">
            <div className="beat big"><h2>We’re not selling it. We’re <em>choosing</em> who gets it.</h2><p>Twenty-five companies. Selected, not sold to.</p></div>
          </div>
        </section>

        <section className="s band dark">
          <div className="proofs">
            <div className="proof">
              <div className="num">$<i>512</i></div>
              <p>What it cost to run a SitecoreAI build an agency quoted at <b>$400,000+</b>. We have the receipts.</p>
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
            <p>We don’t need you to believe us. <span className="nw">Twenty-five</span> companies are about to watch.</p>
            <p>We’ve watched it conduct over <b>225,000</b> events. We don’t need you to tell us it works.</p>
          </div>
        </section>

        <section className="s band lav">
          <div className="creds">
            <div className="cred"><b>25</b><span>years of engineering, written down so it never has to be relearned.</span></div>
            <div className="cred"><b>10</b><span>years of Sitecore. Every pitfall, every workaround, every 2 AM fix.</span></div>
            <div className="cred"><b>MVPs</b><span>Sitecore MVPs are part of this. Yes, really.</span></div>
          </div>
        </section>

        <section className="s">
          <div className="plhead"><h2>Your annual roadmap. In a week.</h2><p>Playbooks, not projects. Same crew every day, on SitecoreAI, and not one change order.</p></div>
          <div className="week">
            <div className="day"><span className="dn">Mon</span><b>The website.</b><span className="dl">Pixel for pixel. Marketers edit it on day one.</span></div>
            <div className="day"><span className="dn">Tue</span><b>The customer portal.</b><span className="dl">Log in, self-serve, done.</span></div>
            <div className="day"><span className="dn">Wed</span><b>Thirty brand sites.</b><span className="dl">One design system. One afternoon each.</span></div>
            <div className="day"><span className="dn">Thu</span><b>The acquisition.</b><span className="dl">Six sites into one. Every redirect kept.</span></div>
            <div className="day yours"><span className="dn">Fri</span><b>Yours.</b><span className="dl">The idea nobody would fund. Bring it.</span></div>
          </div>
          <p className="weeknote">Also on the menu: storefronts, intranets, member portals, design systems, personalization, accessibility. Weekends are for the one that starts with O. Ask us in the hallway.</p>
        </section>

        <section className="s">
          <div className="join" id="join">
            <div className="copy">
              <h2>Twenty-five companies. Not twenty-six.</h2>
              <p>After Symposium, Cypher sits down with twenty-five companies. You bring the website, the portal, the idea you couldn’t fund. You leave with it built, on SitecoreAI. Guaranteed, which is exactly why we can’t do it for everyone.</p>
              <p className="close">Selection closes Friday, November 13.</p>
            </div>
            <InterestForm />
          </div>
        </section>

        <div className="end">
          <div className="endl">
            <span className="sig"><Resting size={24} />I’ll say nothing unless you’re selected.</span>
            <p className="q">Not affiliated with the conference. Obviously.</p>
          </div>
          <Link className="terms" href="/terms">Terms &amp; Conditions</Link>
        </div>
      </main>
      <Reveal />
    </>
  );
}
