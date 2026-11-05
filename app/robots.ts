import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (process.env.ALLOW_INDEXING) return { rules: { userAgent: '*', allow: '/', disallow: '/api/' } };
  return { rules: { userAgent: '*', disallow: '/' } };
}
