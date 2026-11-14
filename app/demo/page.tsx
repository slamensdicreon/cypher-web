import type { Metadata, Viewport } from 'next';
import Eye from '@/components/Eye';
import InterestForm from '@/components/InterestForm';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import JsonLd from '@/components/site/JsonLd';
import { faqPage, graph } from '@/lib/schema';
import { Faq, PageHero, Steps } from '@/components/site/parts';

const description = 'Thirty minutes, no slides: Cypher rebuilds your homepage on your platform while you watch. Sitecore, Optimizely, Contentful or whatever you run.';

export const metadata: Metadata = {
  title: { absolute: 'Book a demo: watch Cypher rebuild your homepage' },
  description,
  alternates: { canonical: '/demo' },
  openGraph: { type: 'website', url: '/demo', siteName: 'Cypher', locale: 'en_US', title: 'Book a demo: watch Cypher rebuild your homepage', description },
  twitter: { card: 'summary_large_image', title: 'Book a demo: watch Cypher rebuild your homepage', description },
};

export const viewport: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };

const NEXT = [
  { title: 'You pick the times.', body: 'Three that suit you, in your own time zone. We confirm one within one business day, with a calendar invite.' },
  { title: 'Cypher looks at your site.', body: 'Before the call it reads what you run today, on whatever platform you run it, and what you said you want done.' },
  { title: 'You watch it work.', body: 'Thirty minutes. Cypher on your site, the team on the Floor, a decision or two for you. No slides.' },
  { title: 'You decide what’s next.', body: 'The build, the migration, the personalization you never switched on, or nothing at all. No pressure. Well, a little.' },
];

const QA = [
  { q: 'What do I need to bring?', a: 'Your site’s address and what you want done. That’s it. No access, no credentials, no brief.' },
  { q: 'Which platforms?', a: 'Any enterprise platform. Sitecore, Optimizely and Contentful are home turf; tell us what you run and we’ll show you on it.' },
  { q: 'Who runs the demo?', a: 'A person who knows the platforms, with Cypher doing the work on screen. You can ask it anything.' },
  { q: 'Is this a sales call?', a: 'It’s a demonstration. If you like what you see, we’ll talk about what’s next. If you don’t, you’ll have seen something new.' },
  { q: 'Why my work email?', a: 'So we know it’s really your company. Personal addresses get a polite no, and we never share yours.' },
];

/** Book a demo: the site's one action, with what happens next. */
export default function Demo() {
  return (
    <div className="bl">
      <SiteHeader />
      <main className="wrap">
        <div className="demo-top">
          <div className="demo-copy">
            <PageHero
              trail={[{ name: 'Book a demo', href: '/demo' }]}
              title="See it on your site."
              lead="Tell us where you live online and what you want done. We point Cypher at it, on your platform, and you watch it work. Today, literally, or whenever suits you."
            />
            <div className="demo-eye" aria-hidden="true"><Eye /></div>
          </div>
          <div id="book" className="demo-form"><InterestForm /></div>
        </div>

        <section className="s band white">
          <h2 className="sec-h">What happens next</h2>
          <Steps items={NEXT} />
        </section>

        <section className="s">
          <h2 className="sec-h">Before you ask</h2>
          <Faq items={QA} />
        </section>
      </main>
      <SiteFooter />
      <Track />
      <JsonLd data={graph(faqPage(QA))} />
    </div>
  );
}
