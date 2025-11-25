import type { Card, GameEvent, GameState } from './game';

export type PlayerPosition = 'top' | 'bottom' | 'left' | 'right';

export type AnimationType = 'playCard' | 'drawCard';

export interface AnimatingCard {
  playerId: string;
  cardIndex: number;
  card: Card;
  startPosition: PlayerPosition;
  animationType: AnimationType;
  totalCards: number;
}

export interface AnimationState {
  gameState: GameState | null;
  pendingGameState: GameState | null;
  eventQueue: GameEvent[];
  currentEvent: GameEvent | null;
  animatingCard: AnimatingCard | null;
  isAnimating: boolean;
}

export interface CardPosition {
  x: number;
  y: number;
  rotation: number;
}
