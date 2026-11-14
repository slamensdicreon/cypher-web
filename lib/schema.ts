import { SITE_URL } from '@/lib/site';

/**
 * Structured data (schema.org JSON-LD) for search and answer engines. What it says matches what the
 * page says; nothing here claims a price, a rating or a partnership.
 */

const ORG_ID = `${SITE_URL}/#org`;
const SITE_ID = `${SITE_URL}/#site`;
const url = (path: string) => SITE_URL + (path === '/' ? '/' : path);

/** One sentence that says what Cypher is, used wherever a description of Cypher is needed. */
export const WHAT_CYPHER_IS =
  'Cypher is twenty-one AI specialists and the mind that runs them. It builds, migrates, personalizes and optimizes websites on Sitecore, Optimizely, Contentful and other enterprise platforms, and the marketer makes about three decisions.';

export const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Cypher',
  url: url('/'),
  logo: `${SITE_URL}/icon.svg`,
  slogan: 'Ignorance is bliss.',
  description: WHAT_CYPHER_IS,
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  name: 'Cypher',
  alternateName: 'Ignorance is bliss.',
  url: url('/'),
  publisher: { '@id': ORG_ID },
});

export const software = () => ({
  '@type': 'SoftwareApplication',
  name: 'Cypher',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: url('/'),
  description: WHAT_CYPHER_IS,
  publisher: { '@id': ORG_ID },
  featureList: [
    'Website builds, pixel for pixel, editable on day one',
    'Platform migrations with every redirect kept and every page checked against the original',
    'Personalization and A/B/n tests set up and checked',
    'Speed, accessibility and SEO work with reports as evidence',
    'Two approval gates and an append-only record of every action',
  ],
});

export const homeVideo = () => ({
  '@type': 'VideoObject',
  name: 'Under the hood',
  description:
    'Forty-two seconds inside Cypher: the eye dives into the Floor, where twenty-one specialists work; Bliss and Everything; a screen for every part of a build; it plans, builds, checks and fixes; you make three decisions.',
  thumbnailUrl: [`${SITE_URL}/video/under-the-hood.jpg`, `${SITE_URL}/video/under-the-hood-square.jpg`],
  contentUrl: `${SITE_URL}/video/under-the-hood-1080.mp4`,
  uploadDate: '2026-11-13',
  duration: 'PT42S',
  publisher: { '@id': ORG_ID },
});

export const faqPage = (items: { q: string; a: string }[]) => ({
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

/** A content page: an Article for answers and guides, a WebPage for the rest. */
export const contentPage = (p: { path: string; title: string; description: string; updated: string; article?: boolean }) => ({
  '@type': p.article ? 'Article' : 'WebPage',
  '@id': `${url(p.path)}#page`,
  url: url(p.path),
  [p.article ? 'headline' : 'name']: p.title,
  description: p.description,
  dateModified: p.updated,
  isPartOf: { '@id': SITE_ID },
  ...(p.article ? { author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID } } : {}),
});

/** Wrap any number of nodes in one graph. */
export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });
