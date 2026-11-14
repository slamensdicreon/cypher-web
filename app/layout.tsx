import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import './bliss.css';
import WakeUp from '@/components/WakeUp';
import { matrixRain, SOURCE_MESSAGE } from '@/lib/matrix';

/** What View Source opens on. Never rendered: a template's contents stay inert. */
const SOURCE_ART = `<!--\n\n${matrixRain(96, 36, SOURCE_MESSAGE)}\n\n-->`;

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ignoranceisbliss.ai';
const title = 'Cypher | AI website builds, migrations and personalization';
const ogTitle = 'Your whole marketing roadmap, live in a week.';
const description =
  'Your marketing roadmap, live in a week. Cypher’s AI specialists build, migrate and personalize on Sitecore, Optimizely or Contentful. You make three decisions.';

// Each page's share image comes from the opengraph-image.tsx beside it (the site's from
// app/opengraph-image.tsx); Next.js adds og:image as an absolute URL on metadataBase, and X falls
// back to it.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  applicationName: 'Cypher',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName: 'Cypher', locale: 'en_US', title: ogTitle, description },
  twitter: { card: 'summary_large_image', title: ogTitle, description },
  robots: process.env.ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } } : {}),
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#141433',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <head>
        <template id="wake-up" dangerouslySetInnerHTML={{ __html: SOURCE_ART }} />
      </head>
      <body>
        {children}
        <WakeUp />
      </body>
    </html>
  );
}
