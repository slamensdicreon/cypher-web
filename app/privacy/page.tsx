import type { Metadata } from 'next';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';

const description = 'What Cypher collects on ignoranceisbliss.ai, why, who processes it, how long it’s kept, and how to have it deleted.';

export const metadata: Metadata = {
  title: 'Privacy | Cypher',
  description,
  alternates: { canonical: '/privacy' },
  openGraph: { type: 'website', url: '/privacy', siteName: 'Cypher', locale: 'en_US', title: 'Privacy', description },
};

const CONTACT = 'cy@ignoranceisbliss.ai';

/** The privacy notice. Plain words; unlike the Terms of Use, this one is meant literally. */
export default function Privacy() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal">
        <div className="legal-head">
          <h1>Privacy</h1>
          <p>What we collect, why, and how to make us forget it. Unlike our Terms of Use, this page means exactly what it says.</p>
        </div>
        <article className="paper privacy">
          <p className="caps">Last updated November 13, 2026</p>

          <section>
            <h2>Who we are</h2>
            <p>Cypher runs ignoranceisbliss.ai. You can reach us at <a href={`mailto:${CONTACT}`}>{CONTACT}</a> or 12 West 21st Street, New York, NY 10010.</p>
          </section>

          <section>
            <h2>What we collect when you book a demo</h2>
            <p>Your work email, and what you choose to tell us: your name, your company’s site, its platform, what you want done, how badly you want it, and the times that suit you, with your time zone. We also note the page and the campaign that brought you (for example, a link from a post). We work out your company’s name from your email’s domain.</p>
            <p>We use it to arrange and run your demo, to reply to you, and to follow up about Cypher. We keep a record of each request, including ones we decline, so we know who has asked.</p>
          </section>

          <section>
            <h2>What we measure on the site</h2>
            <p>We count visits without cookies and without storing your IP address. Each visit is counted under a code made from the date, your network address and your browser, scrambled with a secret key so it can’t be reversed, and it changes every day, so we can’t follow you from one day to the next. With it we record the page, the site that linked to you, a campaign tag if the link had one, your country (from our host’s network) and whether you’re on a phone, tablet or computer. We also count presses of buttons like “Book a demo” and plays of the decision cards.</p>
            <p>To stop the form being abused, we keep a scrambled code of the network a request came from, never the address itself.</p>
          </section>

          <section>
            <h2>Emails</h2>
            <p>If you book a demo, we email you a confirmation and then about your demo. If we send you marketing email, every one has an unsubscribe link that works at once, and our email provider tells us whether a message was delivered, opened or clicked, so we can stop writing to addresses that bounce and to people who say no.</p>
          </section>

          <section>
            <h2>Who processes it for us</h2>
            <p>Our hosting provider runs the site, our database provider stores the records, and our email provider sends and tracks our emails. They process it on our behalf and for no other purpose. We don’t sell your information, and we don’t share it with advertisers.</p>
          </section>

          <section>
            <h2>How long we keep it</h2>
            <p>Demo requests and the conversations that follow stay as long as they’re useful to the relationship, and are deleted when you ask. Visit counts are kept as anonymous totals. An unsubscribe is kept for good, so we never email that address again.</p>
          </section>

          <section>
            <h2>Your choices</h2>
            <p>Write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a> to see what we hold about you, to correct it, or to have it deleted, and we’ll do it within thirty days. Unsubscribe from any marketing email with its link. You can also complain to your local data protection authority.</p>
          </section>

          <section>
            <h2>Changes</h2>
            <p>If this notice changes, the date at the top changes with it. If the change matters, we’ll say so on this page.</p>
          </section>
        </article>
      </main>
      <SiteFooter />
      <Track />
    </>
  );
}
