import { useState, useCallback, useRef } from 'react';
import type { Card, GameEvent, GameState } from '../types/game';
import type { AnimatingCard, PlayerPosition } from '../types/animation';

const ANIMATION_DELAY = 1000;
const COLOR_PICKER_DELAY = 2000; // Delay for color picker

const getEventTypeName = (type: number): string => {
  switch (type) {
    case 0: return 'PlayCard';
    case 1: return 'DrawCard';
    case 2: return 'GameOver';
    case 3: return 'Skip';
    case 4: return 'Reverse';
    case 5: return 'DrawTwo';
    case 6: return 'ChooseColor';
    case 8: return 'uno';
    case 9: return 'failed to call uno';
    default: return type.toString();
  }
};

interface GameOverInfo {
  winnerId: string;
  isGameOver: boolean;
}

interface ColorChoiceInfo {
  playerId: string;
  chosenColor: number;
}

interface UseAnimationQueueResult {
  // State
  gameState: GameState | null;
  isAnimating: boolean;
  animatingCard: AnimatingCard | null;
  gameOver: GameOverInfo | null;
  colorChoice: ColorChoiceInfo | null;
  unoEvent: { playerId: string } | null;

  // Actions
  setInitialGameState: (state: GameState) => void;
  startAnimationSequence: (events: GameEvent[], finalState: GameState, currentGameState: GameState) => void;
  onAnimationComplete: () => void;
  clearGameOver: () => void;
  clearColorChoice: () => void;
  clearUnoEvent: () => void;
  setGameOverTest: (winnerId: string) => void; // For testing purposes
}

export const useAnimationQueue = (): UseAnimationQueueResult => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingCard, setAnimatingCard] = useState<AnimatingCard | null>(null);
  const [gameOver, setGameOver] = useState<GameOverInfo | null>(null);
  const [colorChoice, setColorChoice] = useState<ColorChoiceInfo | null>(null);
  const [unoEvent, setUnoEvent] = useState<{ playerId: string } | null>(null);

  const eventQueueRef = useRef<GameEvent[]>([]);
  const pendingGameStateRef = useRef<GameState | null>(null);
  const currentEventRef = useRef<GameEvent | null>(null);
  const isSchedulingNextEventRef = useRef(false);

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

  const applyEventToState = useCallback((event: GameEvent, state: GameState, card: Card | null, nextEvent: GameEvent | null): GameState => {
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
          const drawPlayer = newState.players[drawPlayerIndex];

          if (drawPlayer.isHuman && card) {
            drawPlayer.cards.push(card);
          }

          drawPlayer.cardCount += 1;
          newState.deckCardCount = Math.max(0, newState.deckCardCount - 1);
        }
        break;

      case 2: // GameOver
        break;

      case 3: // Skip
        break;

      case 4: // Reverse
        newState.direction = newState.direction === 0 ? 1 : 0;
        break;

      case 6: // ChooseColor
        if (event.color !== undefined && event.color !== null) {
          newState.currentColor = event.color as 0 | 1 | 2 | 3 | 4;
        }
        break;

      case 8: // UNO called
        break;
      case 9: // Failed to call UNO
        break;
    }

    // Update current player based on next event in queue
    if (nextEvent) {
      newState.currentPlayerId = nextEvent.playerId;
    }

    return newState;
  }, []);

  const processNextEvent = useCallback(() => {
    console.log('processNextEvent - Queue length:', eventQueueRef.current.length);

    if (eventQueueRef.current.length === 0) {
      console.log('All events processed');
      setIsAnimating(false);
      setAnimatingCard(null);
      currentEventRef.current = null;
      isSchedulingNextEventRef.current = false; // Reset guard

      if (pendingGameStateRef.current) {
        setGameState(pendingGameStateRef.current);
        pendingGameStateRef.current = null;
      }
      return;
    }

    const event = eventQueueRef.current.shift()!;
    currentEventRef.current = event;

    const player = pendingGameStateRef.current?.players.find(p => p.id === event.playerId);
    const playerName = player?.name || event.playerId;
    const card = event.card || (player && player.cards.length > event.cardIdx ? player.cards[event.cardIdx] : null);

    const eventTypeName = getEventTypeName(event.eventType);
    const cardName = getCardName(card);

    console.log(`Processing: ${eventTypeName} - ${playerName} - ${cardName}`);

    setGameState(currentState => {
      if (!currentState) return currentState;

      if (event.eventType === 0) {
        // PlayCard event - animate card from hand to discard pile
        const card = getCardForEvent(event, currentState);
        const player = currentState.players.find(p => p.id === event.playerId);
        if (card && player) {
          const position = getPlayerPosition(event.playerId, currentState.players);
          console.log(`Setup PlayCard animation: ${playerName} -> Discard`);

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
          const targetIndex = player.cardCount;
          const card: Card = event.card || { id: '', color: 0, value: 0 };

          console.log(`Setup DrawCard animation: Deck -> ${playerName} (position ${targetIndex})`);

          setAnimatingCard({
            playerId: event.playerId,
            cardIndex: targetIndex,
            card,
            startPosition: position,
            animationType: 'drawCard',
            totalCards: player.cardCount + 1,
          });
        }
      } else if (event.eventType === 2) {
        // GameOver: no animation, just set state
        console.log(`GameOver - Winner: ${playerName}`);
        setGameOver({
          winnerId: event.playerId,
          isGameOver: true,
        });

        if (!isSchedulingNextEventRef.current) {
          isSchedulingNextEventRef.current = true;
          setTimeout(() => {
            isSchedulingNextEventRef.current = false;
            processNextEvent();
          }, ANIMATION_DELAY);
        }
      } else if (event.eventType === 6) {
        // ChooseColor: show color picker dialog
        const chosenColor = event.color ?? 0;
        console.log(`${playerName} chose color: ${chosenColor}`);

        const nextEvent = eventQueueRef.current[0] || null;
        const updatedState = applyEventToState(event, currentState, null, nextEvent);

        setColorChoice({
          playerId: event.playerId,
          chosenColor,
        });

        if (!isSchedulingNextEventRef.current) {
          isSchedulingNextEventRef.current = true;
          setTimeout(() => {
            isSchedulingNextEventRef.current = false;
            processNextEvent();
          }, COLOR_PICKER_DELAY);
        }

        return updatedState;
      } else if (event.eventType === 8) {
        console.log(`${playerName} called UNO!`);

        setUnoEvent({
          playerId: event.playerId,
        });

        if (!isSchedulingNextEventRef.current) {
          isSchedulingNextEventRef.current = true;
          setTimeout(() => {
            isSchedulingNextEventRef.current = false;
            processNextEvent();
          }, ANIMATION_DELAY);
        }
      } else {
        // Skip/Reverse/DrawTwo: no animation, apply state changes immediately
        console.log(`${eventTypeName} - No animation, continuing...`);

        const nextEvent = eventQueueRef.current[0] || null;
        const updatedState = applyEventToState(event, currentState, null, nextEvent);

        if (!isSchedulingNextEventRef.current) {
          isSchedulingNextEventRef.current = true;
          setTimeout(() => {
            isSchedulingNextEventRef.current = false;
            processNextEvent();
          }, ANIMATION_DELAY);
        }

        return updatedState;
      }

      return currentState;
    });
  }, [getCardForEvent, getPlayerPosition, applyEventToState]);

  const onAnimationComplete = useCallback(() => {
    const event = currentEventRef.current;

    if (!event) return;

    console.log(`Animation complete: ${getEventTypeName(event.eventType)}`);

    setGameState(currentState => {
      if (!currentState) return currentState;

      const card = animatingCard?.card || null;
      const nextEvent = eventQueueRef.current[0] || null;
      return applyEventToState(event, currentState, card, nextEvent);
    });

    setAnimatingCard(null);
    currentEventRef.current = null;

    console.log('Next event in', ANIMATION_DELAY, 'ms');
    setTimeout(() => {
      processNextEvent();
    }, ANIMATION_DELAY);
  }, [animatingCard, applyEventToState, processNextEvent]);

  const setInitialGameState = useCallback((state: GameState) => {
    setGameState(state);
  }, []);

  const clearGameOver = useCallback(() => {
    setGameOver(null);
  }, []);

  const clearColorChoice = useCallback(() => {
    setColorChoice(null);
  }, []);

  const clearUnoEvent = useCallback(() => {
    setUnoEvent(null);
  }, []);

  const setGameOverTest = useCallback((winnerId: string) => {
    setGameOver({
      winnerId,
      isGameOver: true,
    });
  }, []);

  const getCardName = (card: Card | null): string => {
    if (!card) return 'Unknown';

    const colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Wild'];
    const colorName = colorNames[card.color] || 'Unknown';

    if (card.color === 4) {
      return card.value === 13 ? 'Wild' : 'Wild Draw Four';
    }

    const valueNames: { [key: number]: string } = {
      10: 'Skip',
      11: 'Reverse',
      12: 'Draw Two',
    };

    const valueName = valueNames[card.value] ?? card.value.toString();
    return `${colorName} ${valueName}`;
  };

  const startAnimationSequence = useCallback((
    events: GameEvent[],
    finalState: GameState,
    currentGameState: GameState
  ) => {
    console.log('Starting animation sequence');
    console.log(`Total events: ${events.length}`);

    events.forEach((e, idx) => {
      const player = currentGameState.players.find(p => p.id === e.playerId);
      const playerName = player?.name || 'Unknown';
      const card = e.card || (player && player.cards.length > e.cardIdx ? player.cards[e.cardIdx] : null);

      console.log(`  ${idx + 1}. ${getEventTypeName(e.eventType)} - ${playerName} - ${getCardName(card)}`);
    });

    if (events.length === 0) {
      console.log('No events to animate');
      setGameState(finalState);
      return;
    }

    pendingGameStateRef.current = finalState;
    eventQueueRef.current = [...events];
    setIsAnimating(true);
    setGameState(currentGameState);

    console.log('Processing first event...');
    processNextEvent();
  }, [processNextEvent]);

  return {
    gameState,
    isAnimating,
    animatingCard,
    gameOver,
    colorChoice,
    unoEvent,
    setInitialGameState,
    startAnimationSequence,
    onAnimationComplete,
    clearGameOver,
    clearColorChoice,
    clearUnoEvent,
    setGameOverTest,
  };
};
