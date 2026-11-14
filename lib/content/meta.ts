import type { Metadata, Viewport } from 'next';
import type { Page } from './types';

/** The light browser chrome every public page uses. */
export const LIGHT: Viewport = { themeColor: '#f6f5fc', colorScheme: 'light' };

/** Title, description, canonical and social cards for a content page. */
export function pageMeta(p: Pick<Page, 'metaTitle' | 'description'>, path: string): Metadata {
  return {
    title: { absolute: p.metaTitle },
    description: p.description,
    alternates: { canonical: path },
    openGraph: { type: 'article', url: path, siteName: 'Cypher', locale: 'en_US', title: p.metaTitle, description: p.description },
    twitter: { card: 'summary_large_image', title: p.metaTitle, description: p.description },
  };
}
