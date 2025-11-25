import { useState, useCallback, useRef } from 'react';
import type { Card, GameEvent, GameState } from '../types/game';
import type { AnimatingCard, PlayerPosition } from '../types/animation';

const ANIMATION_DELAY = 750;

interface UseAnimationQueueResult {
  // State
  gameState: GameState | null;
  isAnimating: boolean;
  animatingCard: AnimatingCard | null;

  // Actions
  setInitialGameState: (state: GameState) => void;
  startAnimationSequence: (events: GameEvent[], finalState: GameState, currentGameState: GameState) => void;
  onAnimationComplete: () => void;
}

export const useAnimationQueue = (): UseAnimationQueueResult => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<AnimatingCard | null>(null);

  const eventQueueRef = useRef<GameEvent[]>([]);
  const pendingGameStateRef = useRef<GameState | null>(null);
  const currentEventRef = useRef<GameEvent | null>(null);

  const getPlayerPosition = useCallback((playerId: string, players: GameState['players']): PlayerPosition => {
    const humanIndex = players.findIndex(p => p.isHuman);
    const playerIndex = players.findIndex(p => p.id === playerId);

    const relativeIndex = (playerIndex - humanIndex + players.length) % players.length;

    const positions: PlayerPosition[] = ['bottom', 'left', 'top', 'right'];
    return positions[relativeIndex];
  }, []);

  const getCardForEvent = useCallback((event: GameEvent, state: GameState): Card | null => {
    if (event.card) {
      return event.card;
    }

    const player = state.players.find(p => p.id === event.playerId);
    if (player && player.cards && player.cards.length > event.cardIdx) {
      return player.cards[event.cardIdx];
    }

    return null;
  }, []);

  const applyEventToState = useCallback((event: GameEvent, state: GameState, card: Card | null): GameState => {
    const newState = JSON.parse(JSON.stringify(state)) as GameState;

    switch (event.eventType) {
      case 0: // PlayCard
        if (!card) break;
        const playerIndex = newState.players.findIndex(p => p.id === event.playerId);
        if (playerIndex !== -1) {
          const player = newState.players[playerIndex];

          if (player.isHuman && player.cards.length > event.cardIdx) {
            player.cards.splice(event.cardIdx, 1);
          }
          player.cardCount = Math.max(0, player.cardCount - 1);

          newState.topCard = card;
          newState.currentColor = card.color === 4 ? newState.currentColor : card.color;
        }
        break;

      case 1: // DrawCard
        const drawPlayerIndex = newState.players.findIndex(p => p.id === event.playerId);
        if (drawPlayerIndex !== -1) {
          newState.players[drawPlayerIndex].cardCount += 1;
          newState.deckCardCount = Math.max(0, newState.deckCardCount - 1);
        }
        break;

    }

    return newState;
  }, []);

  const processNextEvent = useCallback(() => {
    if (eventQueueRef.current.length === 0) {
      // All events processed
      setIsAnimating(false);
      setAnimatingCard(null);
      currentEventRef.current = null;

      if (pendingGameStateRef.current) {
        setGameState(pendingGameStateRef.current);
        pendingGameStateRef.current = null;
      }
      return;
    }

    const event = eventQueueRef.current.shift()!;
    currentEventRef.current = event;

    setGameState(currentState => {
      if (!currentState) return currentState;

      if (event.eventType === 0) {
        const card = getCardForEvent(event, currentState);
        if (card) {
          const position = getPlayerPosition(event.playerId, currentState.players);
          setAnimatingCard({
            playerId: event.playerId,
            cardIndex: event.cardIdx,
            card,
            startPosition: position,
          });
        }
      } else {
        // Non play card doesnt have animation yet
        const newState = applyEventToState(event, currentState, null);
        setTimeout(() => processNextEvent(), ANIMATION_DELAY);
        return newState;
      }

      return currentState;
    });
  }, [getCardForEvent, getPlayerPosition, applyEventToState]);

  const onAnimationComplete = useCallback(() => {
    const event = currentEventRef.current;

    setGameState(currentState => {
      if (!currentState || !event) return currentState;

      const card = animatingCard?.card;
      if (!card) return currentState;

      return applyEventToState(event, currentState, card);
    });

    setAnimatingCard(null);
    currentEventRef.current = null;

    setTimeout(() => {
      processNextEvent();
    }, ANIMATION_DELAY);
  }, [animatingCard, applyEventToState, processNextEvent]);

  const setInitialGameState = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  const startAnimationSequence = useCallback((
    events: GameEvent[],
    finalState: GameState,
    currentGameState: GameState
  ) => {
    if (events.length === 0) {
      setGameState(finalState);
      return;
    }
    pendingGameStateRef.current = finalState;

    eventQueueRef.current = [...events];

    setIsAnimating(true);

    setGameState(currentGameState);

    processNextEvent();
  }, [processNextEvent]);

  return {
    gameState,
    isAnimating,
    animatingCard,
    setInitialGameState,
    startAnimationSequence,
    onAnimationComplete,
  };
};
