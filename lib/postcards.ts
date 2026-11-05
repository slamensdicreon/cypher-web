/**
 * The postcard campaign: ten cards, each left somewhere specific around the Swan and Dolphin.
 * Every QR code carries the card's id in `?c=`, so each submission says which card earned it.
 * Guardrails: no Icreon branding, $512 is the cost of a run (never the price), and nothing hints
 * at who gets declined.
 */
export type Postcard = {
  id: string;
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
  { id: 'pc01', place: 'The coffee line', line: 'Your coffee will take longer than your next homepage.', payoff: 'Bring the coffee. Leave with the website.', kicker: 'Oat milk is extra. The build isn’t.' },
  { id: 'pc02', place: 'Inside the elevators', line: 'Everyone in this elevator wants what’s on this card.', payoff: 'Twenty-five of them get it.', kicker: 'Don’t make eye contact.' },
  { id: 'pc03', place: 'On a session-room seat', line: 'The speaker is on slide 40. We’d have shipped by slide 4.', payoff: 'Stay for the Q&A. Or don’t.', kicker: 'Leave this for someone slower.' },
  { id: 'pc04', place: 'On the bar', line: 'Your agency quoted $400,000+. We ran it for $512.', payoff: 'Next round’s on them.', kicker: 'The cost of the run, not the price.' },
  { id: 'pc05', place: 'Hotel door hangers', line: 'Do not disturb. Your website is being rebuilt.', payoff: 'Done before checkout.', kicker: 'No housekeeping required.' },
  { id: 'pc06', place: 'The expo hall exits', line: 'Every booth in there sells hours. We stopped counting them.', payoff: 'Ask them what a build costs. Then scan this.', kicker: 'Act casual.' },
  { id: 'pc07', place: 'Registration', line: 'Someone here is about to look like they hired a hundred people.', payoff: 'Make sure it’s you.', kicker: 'They didn’t hire anyone.' },
  { id: 'pc08', place: 'The breakfast tables', line: 'It learned more overnight than your last project did all quarter.', payoff: 'And it never asks twice.', kicker: 'Self-learning. Self-healing. Self-enhancing.' },
  { id: 'pc09', place: 'Outside the keynote', line: 'The keynote showed you the future of SitecoreAI. We’re booking it.', payoff: 'Twenty-five sessions, right after Symposium.', kicker: 'Sitecore MVPs are in on it.' },
  { id: 'pc10', place: 'The airport shuttle', line: 'Ignorance is bliss. Until your competitor gets selected.', payoff: 'Last call before you fly home.', kicker: 'Mind the gap. Between you and them.' },
];
