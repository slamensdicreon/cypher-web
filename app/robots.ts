import type { MetadataRoute } from 'next';

/**
 * Link-preview crawlers. They only read the page's title, description and share image, and some
 * (X's, LinkedIn's) skip a site whose robots.txt shuts them out, which leaves a shared link bare.
 * So they are always let in, even while search engines are kept out.
 */
const PREVIEW_BOTS = [
  'Twitterbot',
  'facebookexternalhit',
  'Facebot',
  'meta-externalagent',
  'LinkedInBot',
  'Slackbot',
  'Slackbot-LinkExpanding',
  'Discordbot',
  'WhatsApp',
  'TelegramBot',
  'Applebot',
  'SkypeUriPreview',
  'redditbot',
  'Embedly',
];

export default function robots(): MetadataRoute.Robots {
  if (process.env.ALLOW_INDEXING) return { rules: { userAgent: '*', allow: '/', disallow: '/api/' } };
  return {
    rules: [
      { userAgent: PREVIEW_BOTS, allow: '/', disallow: '/api/' },
      { userAgent: '*', disallow: '/' },
    ],
  };
}
