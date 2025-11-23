import type { CardColor, CardValue } from '../types/game';

export const CARD_COLORS: Record<CardColor, string> = {
  0: 'var(--color-uno-red)', // Red
  1: 'var(--color-uno-blue)', // Blue
  2: 'var(--color-uno-green)', // Green
  3: 'var(--color-uno-yellow)', // Yellow
  4: 'linear-gradient(135deg, var(--color-uno-red) 0%, var(--color-uno-blue) 25%, var(--color-uno-green) 50%, var(--color-uno-yellow) 75%)', // Wild
};

export const CARD_COLOR_NAMES: Record<CardColor, string> = {
  0: 'Red',
  1: 'Blue',
  2: 'Green',
  3: 'Yellow',
  4: 'Wild',
};

export const CARD_VALUE_NAMES: Record<CardValue, string> = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: 'Skip',
  11: 'Reverse',
  12: '+2',
  13: 'Wild',
  14: '+4',
};

export const CARD_DIMENSIONS = {
  width: 63,
  height: 88,
};
