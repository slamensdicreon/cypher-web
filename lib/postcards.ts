/**
 * The postcard campaign. It started as eleven places around the Swan and Dolphin with two versions of
 * the card each, plus evergreen cards; the print run is now six cards that work anywhere (USE_CASES).
 * The rest are RETIRED: off the pages, kept so their scans still have a name.
 * Every QR code carries the card's id in `?c=`, so each submission says which card earned it.
 * Guardrails: no Icreon branding, $512 is the cost of a run (never the price), and nothing hints
 * at who gets declined.
 */
/** The card's colours, from the brand palette. */
export type Theme = 'ink' | 'coral' | 'lavender' | 'white' | 'violet' | 'iris';

/** A still pose of the eye: where it looks (-1..1), how open it is, the pupil radius. */
export type EyeState = { name: string; gx: number; gy: number; open: number; pr: number };

export const EYE: Record<string, EyeState> = {
  sleepy: { name: 'Half-asleep', gx: 0, gy: 0.2, open: 0.42, pr: 7 },
  side: { name: 'Side-eye', gx: -0.95, gy: 0.05, open: 0.74, pr: 6.6 },
  roll: { name: 'Eye-roll', gx: 0.12, gy: -0.95, open: 0.92, pr: 7 },
  wide: { name: 'Wide awake', gx: 0, gy: 0, open: 1.08, pr: 9.6 },
  closed: { name: 'Asleep', gx: 0, gy: 0, open: 0, pr: 7 },
  squint: { name: 'Suspicious', gx: 0.78, gy: 0.08, open: 0.55, pr: 6.4 },
  stare: { name: 'Staring at you', gx: 0, gy: 0, open: 1, pr: 7.4 },
  think: { name: 'Thinking', gx: 0.62, gy: -0.68, open: 1, pr: 6.8 },
  qr: { name: 'Looking at the code', gx: 0.72, gy: 0.88, open: 0.92, pr: 7 },
  back: { name: 'Glancing back', gx: -1, gy: 0.22, open: 1, pr: 7 },
};

/** One card: its id (the QR code's `?c=`), colours, the eye's pose, and the copy. */
export type Postcard = {
  id: string;
  theme: Theme;
  eye: keyof typeof EYE;
  /** The provocation. */
  line: string;
  /** The payoff, in the accent colour. */
  payoff: string;
  /** The small aside at the bottom. */
  kicker: string;
};

/** A place the cards are left, with two versions to compare (A and B); or the evergreen set, for anywhere. */
export type UseCase = { n: string; place: string; note?: string; cards: Postcard[] };

export const SCAN_BASE = 'https://ignoranceisbliss.ai/?c=';

const c = (id: string, theme: Theme, eye: keyof typeof EYE, line: string, payoff: string, kicker: string): Postcard => ({
  id,
  theme,
  eye,
  line,
  payoff,
  kicker,
});

const ALL_EARLIER: UseCase[] = [
  { n: '01', place: 'In the bathroom', cards: [
    c('pc01a', 'ink', 'closed', 'You’ve been in this bathroom longer than our last migration.', 'Take your time.', 'Wash your hands first.'),
    c('pc01b', 'lavender', 'side', 'Somewhere, an agency is billing for this break.', 'We’d have shipped the homepage.', 'Flush with confidence.'),
  ] },
  { n: '02', place: 'In the coffee line', cards: [
    c('pc02a', 'white', 'sleepy', 'Your coffee will take longer than your next homepage.', 'Bring the coffee. Leave with the website.', 'Oat milk is extra. The build isn’t.'),
    c('pc02b', 'coral', 'wide', 'Still waiting on your latte? Your agency is still waiting on sign-off.', 'We don’t wait. We build.', 'Extra shot of ambition.'),
  ] },
  { n: '03', place: 'Inside the elevators', cards: [
    c('pc03a', 'coral', 'side', 'Everyone in this elevator wants what’s on this card.', 'Twenty-five of them get it.', 'Don’t make eye contact.'),
    c('pc03b', 'violet', 'think', 'This elevator moves faster than your last SitecoreAI project.', 'Going up?', 'Doors close November 13.'),
  ] },
  { n: '04', place: 'On a session-room seat', cards: [
    c('pc04a', 'ink', 'roll', 'The speaker is on slide 40. We’d have shipped by slide 4.', 'Stay for the Q&A. Or don’t.', 'Leave this for someone slower.'),
    c('pc04b', 'white', 'squint', 'This session runs 45 minutes. Long enough to rebuild your homepage.', 'Not long enough to explain how.', 'Silence your phone. Not your ambition.'),
  ] },
  { n: '05', place: 'On the bar', cards: [
    c('pc05a', 'violet', 'wide', 'Your agency quoted $400,000+. We ran it for $512.', 'Next round’s on them.', 'The cost of the run, not the price.'),
    c('pc05b', 'coral', 'stare', 'Last call for paying $400,000+ for a website.', 'We ran one for $512.', 'The cost of the run, not the price.'),
  ] },
  { n: '06', place: 'On hotel door hangers', cards: [
    c('pc06a', 'lavender', 'closed', 'Do not disturb. Your website is being rebuilt.', 'Done before checkout.', 'No housekeeping required.'),
    c('pc06b', 'ink', 'wide', 'While you were sleeping, it rebuilt the portal.', 'Room service doesn’t do that.', 'Checkout is Friday, November 13.'),
  ] },
  { n: '07', place: 'At the expo hall exits', cards: [
    c('pc07a', 'coral', 'squint', 'Every booth in there sells hours. We stopped counting them.', 'Ask them what a build costs. Then scan this.', 'Act casual.'),
    c('pc07b', 'white', 'side', 'Collected enough tote bags? Collect an unfair advantage.', 'Twenty-five companies. Not twenty-six.', 'No booth. No swag. No pitch.'),
  ] },
  { n: '08', place: 'At registration', cards: [
    c('pc08a', 'ink', 'stare', 'Someone here is about to look like they hired a hundred people.', 'Make sure it’s you.', 'They didn’t hire anyone.'),
    c('pc08b', 'lavender', 'squint', 'Twenty-five companies get selected. The rest get a lanyard.', 'Choose wisely. We will.', 'Keep the lanyard.'),
  ] },
  { n: '09', place: 'On the breakfast tables', cards: [
    c('pc09a', 'white', 'think', 'It learned more overnight than your last project did all quarter.', 'And it never asks twice.', 'Self-learning. Self-healing. Self-enhancing.'),
    c('pc09b', 'violet', 'wide', 'It doesn’t need coffee. It needs three decisions from you.', 'That’s the job now.', 'Eat. We’ll build.'),
  ] },
  { n: '10', place: 'Outside the keynote', cards: [
    c('pc10a', 'lavender', 'qr', 'The keynote showed you the future of SitecoreAI. We’re booking it.', 'Twenty-five sessions, right after Symposium.', 'Sitecore MVPs built it.'),
    c('pc10b', 'ink', 'wide', 'You just watched the future. Twenty-five companies get to keep it.', 'Selected, not sold to.', 'No standing ovation required.'),
  ] },
  { n: '11', place: 'On the airport shuttle', cards: [
    c('pc11a', 'violet', 'back', 'Ignorance is bliss. Until your competitor gets selected.', 'Last call before you fly home.', 'Mind the gap. Between you and them.'),
    c('pc11b', 'coral', 'side', 'Your competitor is on this shuttle.', 'Scan before they do.', 'Window seat. Unfair advantage.'),
  ] },
  { n: 'E', place: 'Anywhere', note: 'Evergreen: handed out, left on a table, dropped on the floor. No place in particular.', cards: [
    c('pcev1', 'ink', 'side', 'You weren’t supposed to find this.', 'But since you did.', 'Act natural.'),
    c('pcev2', 'coral', 'stare', 'Someone handed you this for a reason.', 'They think you can handle it.', 'Don’t make them regret it.'),
    c('pcev3', 'lavender', 'wide', 'Your SitecoreAI roadmap called. It wants to be done next week.', 'Pick up.', 'Annual plans are so last year.'),
    c('pcev4', 'violet', 'roll', 'No kickoff. No workshop. No six-month plan.', 'Just the website.', 'Your agency will hate this card.'),
    c('pcev5', 'white', 'squint', '$512. Remember the number.', 'Ask what it built.', 'The cost of the run, not the price.'),
    c('pcev6', 'coral', 'qr', 'Not everyone gets one of these.', 'Twenty-five companies. Not twenty-six.', 'Keep it somewhere safe.'),
  ] },
  // Market numbers, each with its source on the card. From Forrester, The Total Economic Impact of
  // Sitecore XM Cloud, July 2025 (commissioned by Sitecore): the composite's $258,500 lift-and-shift,
  // an education institution's ~€400,000 like-for-like rebuild, and a business insurer's ~5,000 hours
  // for 23 sites. The $750K–$1.25M is our estimate: those hours at $150–$250/hr partner rates.
  { n: 'M', place: 'The math', note: 'Market numbers, cited on the card. Forrester TEI of Sitecore XM Cloud, July 2025 (commissioned by Sitecore). Dollar figures for hours are our estimate.', cards: [
    c('pcm1', 'ink', 'stare', 'Forrester priced a plain lift-and-shift at $258,500.', 'Not a redesign. The same site, moved.', 'Source: Forrester TEI, Sitecore XM Cloud, July 2025.'),
    c('pcm2', 'coral', 'wide', '€400,000 and six months to rebuild the same website.', 'Same functionality. On purpose.', 'An education institution, per Forrester TEI, July 2025.'),
    c('pcm3', 'violet', 'roll', '5,000 hours to move 23 sites to XM Cloud.', 'At partner rates: $750K to $1.25M.', 'Hours: Forrester TEI, 2025. Dollars: our estimate at $150–$250/hr.'),
    c('pcm4', 'white', 'squint', 'The going rate for an XM Cloud migration: $258K to $1.25M.', 'Cypher’s run cost: $512.', 'Forrester TEI 2025; top end our estimate. Run cost, not price.'),
  ] },
  // Topical: a wink at this week's headlines. No names on the card; the line works without the story.
  { n: 'N', place: 'In the news', note: 'Topical, for this week only. A wink at the headlines with no names on the card; it still lands for anyone who missed the story.', cards: [
    c('pcnews1', 'ink', 'side', 'Some models get you investigated.', 'Ours gets you promoted.', 'The only model worth the headlines.'),
  ] },
];

/**
 * The print run: the six cards we actually print, 4.25 × 5.5 in, one per sheet, each in its own colour.
 * They keep the ids they were born with, so their QR codes and their scans carry on.
 */
export const USE_CASES: UseCase[] = [
  { n: 'P', place: 'The print run', note: 'The six we print: 4.25 × 5.5 in, portrait, one per sheet, each in its own colour. Handed out or left anywhere; none needs a particular spot.', cards: [
    c('pcev1', 'ink', 'side', 'You weren’t supposed to find this.', 'But since you did.', 'Act natural.'),
    c('pcev2', 'coral', 'stare', 'Someone handed you this for a reason.', 'They think you can handle it.', 'Don’t make them regret it.'),
    c('pcnews1', 'violet', 'squint', 'Some models get you investigated.', 'Ours gets you promoted.', 'The only model worth the headlines.'),
    c('pcsl1', 'white', 'think', 'It’s smarter than it was this morning.', 'Is your agency?', 'Every build rewrites its own playbook.'),
    c('pcev4', 'lavender', 'roll', 'No kickoff. No workshop. No six-month plan.', 'Just the website.', 'Your agency will hate this card.'),
    c('pc08a', 'iris', 'wide', 'Someone here is about to look like they hired a hundred people.', 'Make sure it’s you.', 'They didn’t hire anyone.'),
  ] },
];

/** Every earlier card, retired from print but kept so their scans still have a name in the admin. */
const PRINT_IDS = new Set(USE_CASES.flatMap((u) => u.cards.map((x) => x.id)));
export const RETIRED: UseCase[] = ALL_EARLIER.map((u) => ({ ...u, cards: u.cards.filter((x) => !PRINT_IDS.has(x.id)) })).filter((u) => u.cards.length);

