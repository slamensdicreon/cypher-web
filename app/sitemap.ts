import type { MetadataRoute } from 'next';
import { entries } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

/** Every public page, with when it was last reviewed where we know. */
export default function sitemap(): MetadataRoute.Sitemap {
  const top: Record<string, number> = { '/': 1, '/how-it-works': 0.9, '/playbooks': 0.9, '/platforms': 0.9, '/demo': 0.9, '/answers': 0.8, '/resources': 0.7, '/glossary': 0.7 };
  return [
    ...entries().map((e) => ({
      url: `${SITE_URL}${e.path === '/' ? '/' : e.path}`,
      ...(e.updated ? { lastModified: e.updated } : {}),
      changeFrequency: (e.path === '/' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: top[e.path] ?? 0.7,
    })),
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
