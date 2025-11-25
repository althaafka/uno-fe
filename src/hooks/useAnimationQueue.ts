import { useState, useCallback, useRef } from 'react';
import type { Card, GameEvent, GameState } from '../types/game';
import type { AnimatingCard, PlayerPosition } from '../types/animation';

const ANIMATION_DELAY = 1000;

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
    console.log('🔄 processNextEvent called, queue length:', eventQueueRef.current.length);

    if (eventQueueRef.current.length === 0) {
      // All events processed
      console.log('✅ All events processed, finishing animation sequence');
      setIsAnimating(false);
      setAnimatingCard(null);
      currentEventRef.current = null;

      if (pendingGameStateRef.current) {
        console.log('📊 Applying final game state');
        setGameState(pendingGameStateRef.current);
        pendingGameStateRef.current = null;
      }
      return;
    }

    const event = eventQueueRef.current.shift()!;
    currentEventRef.current = event;

    console.log('🎯 Processing event:', {
      type: event.eventType === 0 ? 'PlayCard' : 'DrawCard',
      playerId: event.playerId,
      cardIdx: event.cardIdx,
    });

    setGameState(currentState => {
      if (!currentState) return currentState;

      if (event.eventType === 0) {
        // PlayCard event - animate card from hand to discard pile
        const card = getCardForEvent(event, currentState);
        const player = currentState.players.find(p => p.id === event.playerId);
        if (card && player) {
          const position = getPlayerPosition(event.playerId, currentState.players);
          setAnimatingCard({
            playerId: event.playerId,
            cardIndex: event.cardIdx,
            card,
            startPosition: position,
            animationType: 'playCard',
            totalCards: player.cardCount,
          });
        }
      } else if (event.eventType === 1) {
        // DrawCard event - animate card from deck to player hand
        const player = currentState.players.find(p => p.id === event.playerId);
        if (player) {
          const position = getPlayerPosition(event.playerId, currentState.players);
          const targetIndex = player.cardCount; // This will be the NEW card's index
          const dummyCard: Card = { id: '', color: 0, value: 0 };

          console.log('Setting up DrawCard animation:', {
            position,
            targetIndex,
            currentCardCount: player.cardCount,
          });

          setAnimatingCard({
            playerId: event.playerId,
            cardIndex: targetIndex,
            card: dummyCard,
            startPosition: position,
            animationType: 'drawCard',
            totalCards: player.cardCount + 1,
          });
        }
      } else {
        const newState = applyEventToState(event, currentState, null);
        setTimeout(() => processNextEvent(), ANIMATION_DELAY);
        return newState;
      }

      return currentState;
    });
  }, [getCardForEvent, getPlayerPosition, applyEventToState]);

  const onAnimationComplete = useCallback(() => {
    const event = currentEventRef.current;

    console.log('Animation complete for event:', event?.eventType === 0 ? 'PlayCard' : 'DrawCard');

    setGameState(currentState => {
      if (!currentState || !event) return currentState;

      // Apply state changes after animation
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
    console.log('🎬 Starting animation sequence:', {
      eventsCount: events.length,
      events: events.map(e => ({
        type: e.eventType === 0 ? 'PlayCard' : e.eventType === 1 ? 'DrawCard' : 'Unknown',
        playerId: e.playerId,
        cardIdx: e.cardIdx,
      })),
    });

    if (events.length === 0) {
      console.log('⚠️ No events to animate, updating state directly');
      setGameState(finalState);
      return;
    }

    pendingGameStateRef.current = finalState;
    eventQueueRef.current = [...events];
    setIsAnimating(true);
    setGameState(currentGameState);

    console.log('▶️ Processing first event...');
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
