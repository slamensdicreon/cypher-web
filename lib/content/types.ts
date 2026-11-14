/**
 * The site's longer pages, written as data: platforms, playbooks, answers and checklists. Every one
 * renders through the same template, so each gets the same answer-first layout, questions and
 * answers, structured data, sitemap entry and line in llms.txt.
 *
 * House rules for anything written here: plain words for a marketer; no competitor or agency named;
 * no price for Cypher; no new numbers about Cypher (only the ones the site already uses); platform
 * facts kept general unless certain; American spelling; curly apostrophes (’).
 */

export type Faq = { q: string; a: string };

/** One section of a page: a heading, then any of paragraphs, a list, or numbered steps. */
export type Block = {
  h: string;
  p?: string[];
  list?: string[];
  steps?: { t: string; b: string }[];
};

export type Page = {
  /** URL segment, lower-case words joined by hyphens. */
  slug: string;
  /** The short name used in breadcrumbs, cards and the menu. */
  name: string;
  /** The H1: the light clause, then the bold clause (Cypher’s voice). `bold` may be empty. */
  h1: { light: string; bold: string };
  /** The <title>, under 60 characters, saying plainly what the page is about. */
  metaTitle: string;
  /** The meta description, 140 to 160 characters. */
  description: string;
  /** The answer first: 40 to 60 words, plain, quotable on its own by an answer engine. */
  answer: string;
  blocks: Block[];
  /** Three to five questions, each answered in one to three sentences. */
  faq: Faq[];
  /** Paths of related pages on this site, e.g. '/playbooks/migration'. */
  related: string[];
  /** ISO date (YYYY-MM-DD) the page was last reviewed. */
  updated: string;
};

/** /platforms/[slug] */
export type Platform = Page & {
  /** One line for the platforms index card. */
  card: string;
};

/** /platforms/[platform]/[slug]: one platform and one outcome, only where there is real substance. */
export type Combo = Page & {
  platform: string;
  card: string;
};

/** /playbooks/[slug] */
export type Playbook = Page & {
  /** One line for the playbooks index card. */
  card: string;
  /** What you get, three items, for the index card. */
  gets: string[];
  /** True for the playbook shown in the demo. */
  demo?: boolean;
};

/** /answers/[slug]: the H1 is the question itself. */
export type Answer = Page & {
  topic: 'Migration' | 'Personalization and testing' | 'Launch' | 'Platforms' | 'Working with Cypher';
};

/** /resources/[slug]: a checklist or a template. */
export type Resource = Page & {
  card: string;
  /** The checklist itself, in groups. */
  groups: { h: string; items: string[] }[];
  /** A file to download, e.g. a CSV template in /public/resources. */
  download?: { href: string; label: string };
};

/** /glossary#slug */
export type Term = {
  slug: string;
  term: string;
  /** One or two sentences, plain, quotable on its own. */
  def: string;
  /** Paths of related pages on this site. */
  see?: string[];
};
