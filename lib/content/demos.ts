/**
 * A platform's own demo page (/demo/[platform]): what the demo shows on that platform, for
 * campaigns aimed at its teams. Facts come from that platform's homepage demo playbook.
 */
export type Demo = {
  slug: string;
  /** As the demo form names it (lib/site PLATFORMS), so the form starts on it. */
  platform: string;
  metaTitle: string;
  description: string;
  title: string;
  lead: string;
  see: { title: string; body: string }[];
  faq: { q: string; a: string }[];
  updated: string;
};

export const DEMOS: Demo[] = [
  {
    slug: 'optimizely',
    platform: 'Optimizely',
    metaTitle: 'Optimizely demo: your homepage on Optimizely SaaS',
    description: 'See your own homepage rebuilt on Optimizely CMS (SaaS), then edit it yourself in Visual Builder. In person or partly live, with a whole-site audit in numbers.',
    title: 'Your homepage, on Optimizely SaaS.',
    lead: 'Cypher audits your whole site, then rebuilds your homepage, header, footer and navigation on Optimizely CMS (SaaS), the way it would build the rest. Then you edit it yourself in Visual Builder. In person or partly live, depending on your team.',
    see: [
      { title: 'Your whole site, in numbers.', body: 'Every page crawled and counted: pages, page layouts, forms, languages and sites. The real size of the job, before anyone quotes it.' },
      { title: 'Your homepage, rebuilt.', body: 'Your homepage, header, footer and navigation on Optimizely SaaS, built from content types and checked against your live site at phone, tablet and desktop widths.' },
      { title: 'You, in Visual Builder.', body: 'Add a section, edit it inline in the live preview, change a navigation link, publish, and see both changes on the site. No developer.' },
      { title: 'What the rest would take.', body: 'The same playbook moves the whole site: every page, 98% content parity or better, every old URL redirected, and the code and hosting handed to you.' },
    ],
    faq: [
      { q: 'Do we need to be on Optimizely already?', a: 'No. If you’re on Optimizely CMS 12, it’s your site on SaaS. If you’re weighing Optimizely, it’s your own site on it, not a sample.' },
      { q: 'Do you need access to our systems?', a: 'No. It runs on our Optimizely instance, from your live site. Bring your site’s address and what you want done.' },
      { q: 'Is it really our homepage?', a: 'Yes: your copy and images, on our preview. Tell us anything that mustn’t be used and it won’t be.' },
      { q: 'How is the demo run?', a: 'In person or partly live, depending on your team. Either way, you edit the page yourself in Visual Builder before we’re done.' },
      { q: 'What happens after?', a: 'If you want the whole site, the Optimizely SaaS migration playbook builds it the same way. If you don’t, you’ve seen your site on SaaS for free.' },
    ],
    updated: '2026-11-21',
  },
];
