import type { Metadata } from 'next';
import Eye from '@/components/Eye';
import InterestForm from '@/components/InterestForm';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Track from '@/components/Track';
import { Faq, PageHero, Steps } from '@/components/site/parts';

const description = 'Book a demo of Cypher. We point it at your site, on your platform, and you watch it work: Sitecore, Optimizely, Contentful or any enterprise platform.';

export const metadata: Metadata = {
  title: 'Book a demo | Cypher',
  description,
  alternates: { canonical: '/demo' },
  openGraph: { type: 'website', url: '/demo', siteName: 'Cypher', locale: 'en_US', title: 'Book a demo of Cypher', description },
  twitter: { card: 'summary_large_image', title: 'Book a demo of Cypher', description },
};

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
    <>
      <SiteHeader />
      <main className="wrap">
        <div className="demo-top">
          <div className="demo-copy">
            <PageHero
              eyebrow="Book a demo"
              title="See it on your site."
              lead="Tell us where you live online and what you want done. We point Cypher at it, on your platform, and you watch it work. Today, literally, or whenever suits you."
            />
            <div className="demo-eye" aria-hidden="true"><Eye /></div>
          </div>
          <InterestForm />
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
    </>
  );
}
