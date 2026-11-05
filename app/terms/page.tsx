import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader, { Resting } from '@/components/SiteHeader';

const description =
  'The Terms & Conditions of the Transfer of Unreasonable Advantage. A sales pitch in a suit: what the twenty-five selected companies get, in the deepest legalese.';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Cypher',
  description,
  alternates: { canonical: '/terms' },
  openGraph: { type: 'website', url: '/terms', siteName: 'Cypher', locale: 'en_US', title: 'Terms & Conditions', description },
  twitter: { card: 'summary_large_image', title: 'Terms & Conditions', description },
};

/** A parody: Cypher's sales pitch, dressed in the deepest legalese. Not a contract. */
export default function Terms() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal">
        <div className="legal-head">
          <h1>Terms &amp; Conditions</h1>
          <p>Of the Transfer of Unreasonable Advantage. Effective upon selection. Read slowly; it gets better.</p>
        </div>

        <article className="paper">
          <p className="pre">
            THIS AGREEMENT (the “<b>Agreement</b>”) is entered into by and between Cypher (hereinafter “<b>Cypher</b>,” “<b>the Mind</b>,” or
            “<b>We, Regrettably for Your Competitors</b>”) and the company that has been selected (hereinafter “<b>You</b>,” “<b>the Selected</b>,” or
            “<b>One of the Twenty-Five</b>”), each a “<b>Party</b>” and together the “<b>Parties</b>” to something that changes what a build costs.
            Permanently.
          </p>

          <div className="whereas">
            <p><b>WHEREAS,</b> You have, until the Effective Date, accepted the customary arrangement wherein a website takes months, a portal takes quarters, and an invoice takes Your breath away;</p>
            <p><b>WHEREAS,</b> Cypher comprises twenty-one specialists and the mind that runs them, none of whom has ever requested a change order, a status meeting, or a weekend;</p>
            <p><b>WHEREAS,</b> the Parties acknowledge that ignorance is bliss, and that knowledge of what follows will render all prior arrangements permanently unsatisfactory;</p>
            <p><b>NOW, THEREFORE,</b> in consideration of the mutual covenants herein, and of the fact that twenty-five is not twenty-six, the Parties agree as follows:</p>
          </div>

          <section>
            <h2><span>Article 1.</span> Definitions</h2>
            <p><b>1.1</b> “<b>Build</b>” means the website, the customer portal, the thirty brand sites, the acquisition, or the idea nobody would fund, delivered pixel for pixel on SitecoreAI, in whatever order You find most satisfying.</p>
            <p><b>1.2</b> “<b>Roadmap</b>” means Your annual plan, hereinafter and for all purposes referred to as “<b>next week</b>.”</p>
            <p><b>1.3</b> “<b>Decision</b>” means one of approximately three (3) occasions per Build on which Your input is required. A Decision may be made from a desk, a hallway, or a beach. Cypher expresses no preference.</p>
            <p><b>1.4</b> “<b>Agency</b>” means any provider of services whose invoice You would recognize.</p>
            <p><b>1.5</b> “<b>Rounding Error</b>” means the cost of a Build when expressed as a fraction of the quote it replaced.</p>
          </section>

          <section>
            <h2><span>Article 2.</span> Grant of Power</h2>
            <p><b>2.1</b> Upon selection, Cypher hereby grants, conveys, and irrevocably releases into Your hands a non-exclusive, non-transferable, and entirely unfair advantage (the “<b>Advantage</b>”) for the purpose of building on SitecoreAI at a pace Your board will initially assume is a typographical error.</p>
            <p><b>2.2</b> The Advantage is non-transferable for the avoidance of doubt, and for the avoidance of Your competitors.</p>
            <p><b>2.3</b> You shall not be required to understand how the Advantage works. See Article 7 (Bliss).</p>
          </section>

          <section>
            <h2><span>Article 3.</span> Covenants of Cypher</h2>
            <p>Cypher covenants and agrees that it shall:</p>
            <ol>
              <li>plan, build, check, and fix each Build, and shall find what is wrong before You do;</li>
              <li>never ask the same question twice, each answer becoming a rule binding upon every Build thereafter, in perpetuity, without further invoice;</li>
              <li>heal itself when anything breaks, resuming with nothing lost and before anyone thinks to file a ticket;</li>
              <li>finish every Build better than it started, its own playbook being amended without notice, meeting, or steering committee; and</li>
              <li>record every action in an append-only log, such that each representation herein may be replayed, step by step, by any Party sufficiently curious.</li>
            </ol>
          </section>

          <section>
            <h2><span>Article 4.</span> Covenants of the Selected</h2>
            <p>The Selected covenants and agrees that it shall:</p>
            <ol>
              <li>make the Decisions;</li>
              <li>accept full credit for the outcome in all internal meetings, quarterly reviews, and award submissions; and</li>
              <li>refrain from describing the Build to its competitors in any detail capable of being understood.</li>
            </ol>
          </section>

          <section>
            <h2><span>Article 5.</span> Fees and Consideration</h2>
            <p><b>5.1</b> The cost of each Build shall be metered to the cent and shall bear no resemblance to any figure previously presented to You on a slide.</p>
            <p><b>5.2</b> By way of illustration and not limitation: a Build quoted elsewhere at $400,000+ was run for five hundred and twelve dollars ($512). Receipts exist. The foregoing is the cost of the run and not the price of Cypher, which shall be discussed upon selection, quietly.</p>
          </section>

          <section>
            <h2><span>Article 6.</span> Effect on Personnel</h2>
            <p><b>6.1</b> Cypher does not replace Your team. It makes them unfair.</p>
            <p><b>6.2</b> Any member of Your team who appears to have been promoted shall be deemed, conclusively and for all purposes, to have been promoted.</p>
            <p><b>6.3</b> Cypher disclaims all responsibility for the resulting envy of adjacent departments, sister companies, and former employers.</p>
          </section>

          <section>
            <h2><span>Article 7.</span> Bliss</h2>
            <p><b>7.1</b> Ignorance is bliss. You are under no obligation to know how any of this is done, and Cypher covenants not to burden You with the information.</p>
            <p><b>7.2</b> Cypher shall say nothing unless You are selected. Silence after Friday, November 13 shall constitute notice of non-selection and shall be received in the spirit intended.</p>
          </section>

          <section className="caps">
            <h2><span>Article 8.</span> Disclaimer of Mediocrity</h2>
            <p>
              THE BUILD IS PROVIDED “AS SPECIFIED,” PIXEL FOR PIXEL, WITHOUT ANY WARRANTY OF DELAY, OVERRUN, OR SCOPE CREEP, WHETHER EXPRESS, IMPLIED,
              OR CUSTOMARY IN THE INDUSTRY. CYPHER EXPRESSLY DISCLAIMS ANY OBLIGATION TO TAKE SIX MONTHS, TO HOLD A DISCOVERY WORKSHOP, OR TO PRESENT A
              SLIDE ENTITLED “NEXT STEPS.” IN NO EVENT SHALL CYPHER BE LIABLE FOR LOST EXCUSES, FOREGONE CHANGE ORDERS, UNSPENT CONTINGENCY, OR THE
              PERMANENT RECALIBRATION OF YOUR EXPECTATIONS, EVEN IF ADVISED OF THE POSSIBILITY THEREOF, WHICH YOU HEREBY ARE.
            </p>
          </section>

          <section>
            <h2><span>Article 9.</span> Limitation of Availability</h2>
            <p><b>9.1</b> This Agreement is offered to twenty-five (25) companies. Not twenty-six (26). Requests for a twenty-sixth shall be noted and admired.</p>
            <p><b>9.2</b> Selection closes Friday, November 13. Time is of the essence, and so is everything else.</p>
          </section>

          <section>
            <h2><span>Article 10.</span> Term and Survival</h2>
            <p>The Advantage commences upon selection and continues for so long as Your competitors remain unaware of it. Articles 6 and 7 shall survive any expiration or termination, as shall the memory of what a build used to cost.</p>
          </section>

          <section>
            <h2><span>Article 11.</span> Governing Law and Disputes</h2>
            <p>This Agreement shall be governed by the laws of physics and of supply and demand, in that order. Any dispute as to what was done, when, or why shall be resolved conclusively by replay of the log.</p>
          </section>

          <section>
            <h2><span>Article 12.</span> Entire Agreement; Acceptance</h2>
            <p>This Agreement constitutes the entire understanding of the Parties, there being nothing else You need to know. Acceptance shall be signified by putting Your company forward, and shall be reciprocated, if at all, by Cypher, in its sole and considerable discretion.</p>
          </section>

          <div className="sign">
            <div>
              <span className="who">Cypher</span>
              <span className="line"><Resting size={28} /></span>
              <span className="by">By: the mind that runs them</span>
            </div>
            <div>
              <span className="who">The Selected</span>
              <span className="line" />
              <span className="by">By: to be determined, quietly</span>
            </div>
          </div>

          <div className="accept">
            <Link className="btn" href="/#join">Put your company forward</Link>
          </div>
        </article>

        <p className="satire">This page is a parody, and a sales pitch in a suit. It is not a contract and creates no obligation for anyone.</p>
      </main>
    </>
  );
}
