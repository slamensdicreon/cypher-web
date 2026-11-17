import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Eye from '@/components/Eye';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import CtaLink from '@/components/site/CtaLink';
import DemoStart from '@/components/site/DemoStart';
import HomeVideo from '@/components/site/HomeVideo';
import JsonLd from '@/components/site/JsonLd';
import { Arrow, Check, EyeMark } from '@/components/site/Marks';
import { graph, homeVideo, organization, software, website } from '@/lib/schema';

const description =
  'Your marketing roadmap, live in a week. Cypher’s AI specialists build, migrate and personalize on Sitecore, Optimizely or Contentful. You make three decisions.';

export const metadata: Metadata = {
  title: { absolute: 'Cypher | AI website builds, migrations and personalization' },
  description,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName: 'Cypher', locale: 'en_US', title: 'Your whole marketing roadmap, live in a week.', description },
  twitter: { card: 'summary_large_image', title: 'Your whole marketing roadmap, live in a week.', description },
};

export const viewport: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };

/** What a marketer is up against today. */
const PAINS = [
  ['The ticket queue.', 'Every headline change waits behind someone else’s sprint.'],
  ['The change order.', 'Every agency scope grows the moment you ask for something new.'],
  ['The license nobody switched on.', 'You paid for personalization. It’s still off.'],
] as const;

/** The whole job, in three moves. */
const MOVES = [
  ['You bring the goal.', 'The new site, the campaign, the migration, the personalization. On the platform you already run.'],
  ['Cypher plans it, builds it and checks it.', 'Twenty-one AI specialists, one written plan, and every page checked before you see it.'],
  ['You make three decisions.', 'Approve the plan, answer the calls only a marketer can make, and say when it goes live.'],
] as const;

/** A roadmap's worth of work, a day each, each day a playbook. */
const WEEK = [
  ['Mon', 'The new site.', 'Pixel for pixel. Your team edits it on day one.', '/playbooks/website-build'],
  ['Tue', 'The customer portal.', 'Log in, self-serve, done.', '/playbooks/portals'],
  ['Wed', 'The migration.', 'Six sites into one. Every URL kept.', '/playbooks/migration'],
  ['Thu', 'Personalization.', 'Switched on. Finally.', '/playbooks/personalization'],
  ['Fri', 'Yours.', 'The idea nobody would fund. Bring it.', '/playbooks'],
] as const;

/** Why it's safe to say yes, for the marketer and for everyone who signs it off. */
const SAFE = [
  ['You hold both gates.', 'Nothing launches without your sign-off, on the plan and on the finished site.'],
  ['On brand, pixel for pixel.', 'Built in your platform, with your components. Your team edits it on day one.'],
  ['Every change on the record.', 'Who did what, when and why, ready to export for IT, legal or your CMO.'],
  ['Contained by design.', 'Each client in its own space. Cypher asks only for the access a job needs.'],
  ['Yours at the end.', 'Your code, your hosting, your keys. No lock-in, no retainer.'],
  ['Experts behind every build.', 'People who know the platforms stand behind every project.'],
] as const;

const CREDS = [
  ['25 years', 'of engineering, written down so it’s never relearned.'],
  ['10 years', 'of enterprise platforms, every pitfall and workaround.'],
  ['MVPs', 'Platform MVPs built it. Yes, really.'],
] as const;

/**
 * The customer quote: Cypher's first customer, in their own words. `real` keeps the safeguard for
 * any future draft: a quote that isn't real yet shows on preview deployments only, never in production.
 */
const QUOTE = {
  text: '…it was beyond the most impressive thing I’ve ever seen. Discovery was done in 15 minutes, our entire 200-page website lifted and ready to use within 3 hours…',
  who: 'VP Delivery',
  where: 'Icreon',
  real: true,
};
const showQuote = QUOTE.real || process.env.VERCEL_ENV === 'preview';

/** Home: the problem, the promise, how it works, what you can hand it, why it's safe, and the proof. */
export default function Page() {
  return (
    <div className="bl">
      <SiteHeader />

      <main>
        <section className="bl-w bl-hero">
          <Eye />
          <h1 className="bl-voice-h1">Your whole marketing roadmap, live in a week. <b>You make three decisions.</b></h1>
          <p className="bl-hero-p">Sitecore, Optimizely, Contentful or whatever you run.<br />Your team edits it on day one.</p>
          <div className="bl-hero-actions">
            <div className="bl-ctas">
              <CtaLink href="/demo" label="home-hero" className="bl-btn bl-btn-ink">Book a demo</CtaLink>
              <CtaLink href="/how-it-works" label="home-how-hero" className="bl-btn bl-btn-ghost">How it works</CtaLink>
            </div>
            <span className="bl-cta-note">30 minutes. Your platform. No slides.</span>
          </div>
        </section>

        <section className="bl-w bl-after">
          <HomeVideo />
          <p className="bl-video-cap">Forty-two seconds inside Cypher: twenty-one AI specialists, one plan, <b>your three decisions.</b></p>
        </section>

        <section className="bl-w bl-after bl-stack">
          <h2 className="bl-h2v">Your roadmap isn’t the problem. <b>The queue is.</b></h2>
          <div className="bl-four three">
            {PAINS.map(([t, b]) => (
              <div key={t}><h3>{t}</h3><p>{b}</p></div>
            ))}
          </div>
        </section>

        <section className="bl-band">
          <div className="bl-w bl-sec bl-moves">
            <div className="bl-stack-sm">
              <h2 className="bl-h2v">You bring the goal. <b>Cypher does the rest.</b></h2>
              <ol className="bl-art-steps">
                {MOVES.map(([t, b], i) => (
                  <li key={t}><span className="bl-step-n" aria-hidden="true">{i + 1}</span><span><b>{t}</b><span>{b}</span></span></li>
                ))}
              </ol>
              <CtaLink href="/how-it-works" label="home-how" className="bl-more">See how it works</CtaLink>
            </div>
            <article className="bl-dec coral bl-moves-card" aria-label="One of your three decisions">
              <span className="bl-yours-label"><EyeMark state="needs" size={20} />Yours<span className="bl-push">4:00</span></span>
              <h3 className="bl-card-title">Who sees the spring offer first?</h3>
              <p>Two audiences qualify. The offer can only lead for one.</p>
              <span className="bl-pick"><EyeMark state="watching" size={22} /><span><b>I’d start with returning visitors.</b> They already know the brand.</span></span>
              <span className="bl-chips" aria-hidden="true"><span className="bl-chip">Returning visitors</span><span className="bl-chip alt">New visitors</span></span>
              <span className="bl-meta">If you say nothing: returning visitors, at 4:00.</span>
            </article>
          </div>
        </section>

        <section className="bl-w bl-sec bl-stack">
          <div className="bl-head">
            <h2 className="bl-h2v">Your annual roadmap. <b>In a week.</b></h2>
            <p className="bl-lead">No dev queue. No change orders. No waiting for next quarter. Each day is a playbook, run the same way every time.</p>
          </div>
          <div className="bl-week">
            {WEEK.map(([d, t, l, href]) => (
              <Link key={d} href={href} className="bl-day">
                <span className="bl-dn">{d}</span><b>{t}</b><span className="bl-dl">{l}</span>
                <span className="bl-day-arrow" aria-hidden="true"><Arrow /></span>
              </Link>
            ))}
          </div>
          <CtaLink href="/playbooks" label="home-playbooks" className="bl-more">Explore the playbooks</CtaLink>
        </section>

        <section className="bl-band">
          <div className="bl-w bl-sec bl-stack">
            <div className="bl-head">
              <h2 className="bl-h2v">It doesn’t replace your team. <b>It promotes it.</b></h2>
              <p className="bl-lead">And it’s built for everyone who has to sign it off: you, IT, legal and your CMO.</p>
            </div>
            <ul className="bl-hand">
              {SAFE.map(([t, b]) => (
                <li key={t}><Check size={22} /><span><b>{t}</b><span>{b}</span></span></li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bl-ink">
          <div className="bl-w bl-proof">
            <div className="bl-proof-num">
              <span className="bl-num">$512</span>
              <p>What it cost to run a build an agency quoted at <b>$400,000+</b>.</p>
              <p className="bl-fine">The cost of the run, not the price of Cypher.</p>
            </div>
            <ul className="bl-creds">
              {CREDS.map(([n, l]) => (
                <li key={n}><b>{n}</b><span>{l}</span></li>
              ))}
            </ul>
            {showQuote && (
              <figure className="bl-quote">
                {!QUOTE.real && <span className="bl-draft">Draft quote · preview only · replace with a real customer</span>}
                <blockquote>“{QUOTE.text}”</blockquote>
                <figcaption>{QUOTE.who}, {QUOTE.where}</figcaption>
              </figure>
            )}
            <div className="bl-proof-cta">
              <p className="bl-h2v small">Don’t take our word for it. <b>Bring your homepage.</b></p>
              <CtaLink href="/demo" label="home-proof" className="bl-btn bl-btn-white">Book a demo</CtaLink>
            </div>
          </div>
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
