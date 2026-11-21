import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Eye from '@/components/Eye';
import InterestForm from '@/components/InterestForm';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import Analytics from '@/components/site/Analytics';
import JsonLd from '@/components/site/JsonLd';
import { Faq, PageHero, Steps } from '@/components/site/parts';
import { DEMOS } from '@/lib/content/demos';
import { contentPage, faqPage, graph } from '@/lib/schema';

export const dynamicParams = false;
export const viewport: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };
export const generateStaticParams = () => DEMOS.map((d) => ({ platform: d.slug }));

type Props = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const d = DEMOS.find((x) => x.slug === platform);
  if (!d) return {};
  const path = `/demo/${d.slug}`;
  return {
    title: { absolute: d.metaTitle },
    description: d.description,
    alternates: { canonical: path },
    openGraph: { type: 'website', url: path, siteName: 'Cypher', locale: 'en_US', title: d.metaTitle, description: d.description },
    twitter: { card: 'summary_large_image', title: d.metaTitle, description: d.description },
  };
}

/** A platform's own demo page: what the demo shows there, and the form, already on that platform. */
export default async function PlatformDemo({ params }: Props) {
  const { platform } = await params;
  const d = DEMOS.find((x) => x.slug === platform);
  if (!d) notFound();
  const path = `/demo/${d.slug}`;
  return (
    <div className="bl">
      <SiteHeader />
      <main className="wrap">
        <div className="demo-top">
          <div className="demo-copy">
            <PageHero trail={[{ name: 'Book a demo', href: '/demo' }, { name: d.platform, href: path }]} title={d.title} lead={d.lead} />
            <div className="demo-eye" aria-hidden="true"><Eye /></div>
          </div>
          <div id="book" className="demo-form"><InterestForm defaultPlatform={d.platform} /></div>
        </div>
        <section className="s band white">
          <h2 className="sec-h">What you’ll see</h2>
          <Steps items={d.see} />
        </section>
        <section className="s">
          <h2 className="sec-h">Before you ask</h2>
          <Faq items={d.faq} />
          {d.slug === 'optimizely' && (
            <p className="demo-more">Planning the move? Read <Link href="/platforms/optimizely/migration">Moving to Optimizely CMS (SaaS)</Link> and <Link href="/answers/what-is-optimizely-visual-builder">what Visual Builder is</Link>.</p>
          )}
        </section>
      </main>
      <SiteFooter />
      <Analytics />
      <JsonLd data={graph(contentPage({ path, title: d.title, description: d.description, updated: d.updated }), faqPage(d.faq))} />
    </div>
  );
}
