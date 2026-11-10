import type { RGB } from './eyeEngine';
import type { Theme } from './postcards';

/** The card colours, shared by the printed cards (via CSS) and the social ads (rendered to PNG). */

const INK: RGB = [20, 20, 51];
const CORAL: RGB = [232, 85, 61];

/** The eye's ball and pupil on each card colour: on coral the colours swap, an ink ball with a coral pupil. */
export const EYE_COLORS: Record<Theme, { ball: RGB; pupil: RGB }> = {
  ink: { ball: CORAL, pupil: INK },
  coral: { ball: INK, pupil: CORAL },
  lavender: { ball: CORAL, pupil: INK },
  white: { ball: CORAL, pupil: INK },
  violet: { ball: CORAL, pupil: INK },
  iris: { ball: INK, pupil: CORAL },
};

/** Background, text, payoff, small text and halo for each card colour (match .t-* in globals.css). */
export const THEMES: Record<Theme, { bg: string; fg: string; pay: string; muted: string; halo: string }> = {
  ink: { bg: '#141433', fg: '#ffffff', pay: '#e8553d', muted: '#b7a6ff', halo: 'rgba(232,85,61,0.3)' },
  coral: { bg: '#e8553d', fg: '#141433', pay: '#ffffff', muted: '#141433', halo: 'rgba(20,20,51,0.2)' },
  lavender: { bg: '#dcd6f6', fg: '#141433', pay: '#a8321d', muted: '#3b3a5c', halo: 'rgba(232,85,61,0.32)' },
  white: { bg: '#ffffff', fg: '#141433', pay: '#c8402b', muted: '#6a6889', halo: 'rgba(232,85,61,0.24)' },
  violet: { bg: '#2c2c5a', fg: '#ffffff', pay: '#b7a6ff', muted: '#b7a6ff', halo: 'rgba(232,85,61,0.34)' },
  // Cypher's iris (the platform's design system), the sixth colour for the print run
  iris: { bg: '#6b4ee6', fg: '#ffffff', pay: '#ffd6cc', muted: '#e4dcff', halo: 'rgba(20,20,51,0.24)' },
};

export const THEME_NAME: Record<Theme, string> = { ink: 'ink', coral: 'coral', lavender: 'lavender', white: 'white', violet: 'deep violet', iris: 'iris' };
