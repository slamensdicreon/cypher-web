import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '500', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ignoranceisbliss.ai';
const description =
  'Cypher builds on SitecoreAI. Twenty-five companies get selected. Selection closes Friday, November 13.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Ignorance is bliss.',
  description,
  openGraph: { title: 'Ignorance is bliss.', description, type: 'website', siteName: 'Cypher' },
  twitter: { card: 'summary_large_image', title: 'Ignorance is bliss.', description },
  robots: process.env.ALLOW_INDEXING ? { index: true, follow: true } : { index: false, follow: false },
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
