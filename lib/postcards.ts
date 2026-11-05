/**
 * The postcard campaign: ten cards, each left somewhere specific around the Swan and Dolphin.
 * Every QR code carries the card's id in `?c=`, so each submission says which card earned it.
 * Guardrails: no Icreon branding, $512 is the cost of a run (never the price), and nothing hints
 * at who gets declined.
 */
/** The card's colours, from the brand palette. */
export type Theme = 'ink' | 'coral' | 'lavender' | 'white' | 'violet';

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

export type Postcard = {
  id: string;
  theme: Theme;
  eye: keyof typeof EYE;
  /** Where the card is left. */
  place: string;
  /** The provocation. */
  line: string;
  /** The payoff, in coral. */
  payoff: string;
  /** The small aside at the bottom. */
  kicker: string;
};

export const SCAN_BASE = 'https://ignoranceisbliss.ai/?c=';

export const POSTCARDS: Postcard[] = [
  { id: 'pc01', theme: 'white', eye: 'sleepy', place: 'The coffee line', line: 'Your coffee will take longer than your next homepage.', payoff: 'Bring the coffee. Leave with the website.', kicker: 'Oat milk is extra. The build isn’t.' },
  { id: 'pc02', theme: 'coral', eye: 'side', place: 'Inside the elevators', line: 'Everyone in this elevator wants what’s on this card.', payoff: 'Twenty-five of them get it.', kicker: 'Don’t make eye contact.' },
  { id: 'pc03', theme: 'ink', eye: 'roll', place: 'On a session-room seat', line: 'The speaker is on slide 40. We’d have shipped by slide 4.', payoff: 'Stay for the Q&A. Or don’t.', kicker: 'Leave this for someone slower.' },
  { id: 'pc04', theme: 'violet', eye: 'wide', place: 'On the bar', line: 'Your agency quoted $400,000+. We ran it for $512.', payoff: 'Next round’s on them.', kicker: 'The cost of the run, not the price.' },
  { id: 'pc05', theme: 'lavender', eye: 'closed', place: 'Hotel door hangers', line: 'Do not disturb. Your website is being rebuilt.', payoff: 'Done before checkout.', kicker: 'No housekeeping required.' },
  { id: 'pc06', theme: 'coral', eye: 'squint', place: 'The expo hall exits', line: 'Every booth in there sells hours. We stopped counting them.', payoff: 'Ask them what a build costs. Then scan this.', kicker: 'Act casual.' },
  { id: 'pc07', theme: 'ink', eye: 'stare', place: 'Registration', line: 'Someone here is about to look like they hired a hundred people.', payoff: 'Make sure it’s you.', kicker: 'They didn’t hire anyone.' },
  { id: 'pc08', theme: 'white', eye: 'think', place: 'The breakfast tables', line: 'It learned more overnight than your last project did all quarter.', payoff: 'And it never asks twice.', kicker: 'Self-learning. Self-healing. Self-enhancing.' },
  { id: 'pc09', theme: 'lavender', eye: 'qr', place: 'Outside the keynote', line: 'The keynote showed you the future of SitecoreAI. We’re booking it.', payoff: 'Twenty-five sessions, right after Symposium.', kicker: 'Sitecore MVPs are in on it.' },
  { id: 'pc10', theme: 'violet', eye: 'back', place: 'The airport shuttle', line: 'Ignorance is bliss. Until your competitor gets selected.', payoff: 'Last call before you fly home.', kicker: 'Mind the gap. Between you and them.' },
];
