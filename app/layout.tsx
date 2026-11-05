import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '500', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ignoranceisbliss.ai';
const title = 'Ignorance is bliss.';
const description =
  'Cypher builds on SitecoreAI for a rounding error of what you pay now. We’re not selling it. We’re choosing twenty-five companies. Closes Nov 13.';

// The share image comes from app/opengraph-image.tsx and app/twitter-image.tsx; Next.js adds
// og:image, its size, type and alt, and twitter:image, as absolute URLs on metadataBase.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${title} | Cypher`,
  description,
  applicationName: 'Cypher',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', url: '/', siteName: 'Cypher', locale: 'en_US', title, description },
  twitter: { card: 'summary_large_image', title, description },
  robots: process.env.ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
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
      <body>{children}</body>
    </html>
  );
}
