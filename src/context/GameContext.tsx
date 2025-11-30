import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { Card, GameData, GameState } from '../types/game';
import type { AnimatingCard } from '../types/animation';
import { gameApi } from '../services/api/gameApi';
import { useAnimationQueue } from '../hooks/useAnimationQueue';

interface GameOverInfo {
  winnerId: string;
  isGameOver: boolean;
}

const isCardPlayable = (card: Card, topCard: Card, currentColor: number): boolean => {
  if (card.color === 4) return true;
  if (card.color === currentColor) return true;
  if (card.value === topCard.value) return true;
  return false;
};

interface ColorPickerInfo {
  isOpen: boolean;
  cardId: string | null;
  isInteractive: boolean;
  selectedColor?: number;
}

interface GameContextValue {
  gameId: string | null;
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  isAnimating: boolean;
  animatingCard: AnimatingCard | null;
  gameOver: GameOverInfo | null;
  colorPicker: ColorPickerInfo;
  unoEvent: {playerId: string} | null;
  startGame: (playerCount?: number) => Promise<void>;
  playCard: (cardId: string) => Promise<void>;
  drawCard: () => Promise<void>;
  resetGame: () => void;
  onAnimationComplete: () => void;
  onColorSelect: (color: number) => Promise<void>;
  onUnoCall: () => void;
  setGameOverTest: (winnerId: string) => void;
  setColorPickerTest: (isInteractive: boolean) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [colorPicker, setColorPicker] = useState<ColorPickerInfo>({
    isOpen: false,
    cardId: null,
    isInteractive: false,
    selectedColor: undefined,
  });
  const [hasCalledUno, setHasCalledUno] = useState(false);
  const [isWaitingForUno, setIsWaitingForUno] = useState(false);
  const unoTimerRef = useRef<number | null>(null);
  const pendingCardRef = useRef<{cardId: string, chosenColor?: number} | null>(null);

  const {
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
    setGameOverTest,
  } = useAnimationQueue();

  useEffect(() => {
    if (colorChoice && gameState) {
      const player = gameState.players.find(p => p.id === colorChoice.playerId);

      if (player && !player.isHuman) {
        setColorPicker({
          isOpen: true,
          cardId: 'color-choice',
          isInteractive: false,
          selectedColor: colorChoice.chosenColor,
        });

        const timer = setTimeout(() => {
          setColorPicker({
            isOpen: false,
            cardId: null,
            isInteractive: false,
            selectedColor: undefined,
          });
          clearColorChoice();
        }, 1500);

        return () => clearTimeout(timer);
      } else {
        clearColorChoice();
      }
    }
  }, [colorChoice, gameState, clearColorChoice]);

  const startGame = useCallback(async (playerCount: number = 4) => {
    setIsLoading(true);
    setError(null);

    try {
      const data: GameData = await gameApi.startGame(playerCount);
      console.log('Game started successfully:', data);
      setGameId(data.gameId);
      setInitialGameState(data.gameState);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error starting game:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [setInitialGameState]);

  const onUnoCall = useCallback(() => {
    if (!isWaitingForUno) {
      setHasCalledUno(true);
      console.log('Player called UNO! (early)');
      return;
    }

    if (unoTimerRef.current) {
      clearTimeout(unoTimerRef.current);
      unoTimerRef.current = null;
    }

    setIsWaitingForUno(false);
    setHasCalledUno(false);

    const pending = pendingCardRef.current;
    if (!pending || !gameId || !gameState) {
      return;
    }

    const humanPlayer = gameState.players.find(p => p.isHuman);
    if (!humanPlayer) {
      return;
    }

    console.log('Player called UNO! (during timer)');
    setError(null);

    gameApi.playCard(gameId, humanPlayer.id, pending.cardId, pending.chosenColor, true)
      .then(response => {
        if (response.success) {
          console.log('Play card with UNO call response:', response);
          startAnimationSequence(response.events, response.gameState, gameState);
        } else {
          console.log("Play card error:", response);
          throw new Error(response.message);
        }
      })
      .catch(err => {
        const errorMessage = err instanceof Error ? err.message : 'Failed to play card';
        setError(errorMessage);
        console.error('Error playing card:', err);
      })
      .finally(() => {
        pendingCardRef.current = null;
      });
  }, [isWaitingForUno, gameId, gameState, startAnimationSequence]);

  const playCard = useCallback(async (cardId: string) => {
    if (!gameId || !gameState) {
      throw new Error('No active game');
    }


    if (isAnimating) {
      return;
    }

    const humanPlayer = gameState.players.find(p => p.isHuman);
    if (!humanPlayer) {
      throw new Error('No human player found');
    }

    const cardToPlay = humanPlayer.cards.find(c => c.id === cardId);
    if (!cardToPlay) {
      return;
    }

    if (!isCardPlayable(cardToPlay, gameState.topCard, gameState.currentColor)) {
      console.log("Card not playable", gameState.topCard, cardToPlay);
      return;
    }

    if (cardToPlay.color === 4) {
      setColorPicker({
        isOpen: true,
        cardId,
        isInteractive: true,
        selectedColor: undefined,
      });
      return;
    }

    const willHaveOneCard = humanPlayer.cards.length === 2;

    if (willHaveOneCard) {
      setIsWaitingForUno(true);
      pendingCardRef.current = { cardId };

      console.log('Waiting for UNO call... (1.5s)');

      unoTimerRef.current = window.setTimeout(() => {
        setIsWaitingForUno(false);
        const calledUno = hasCalledUno;
        setHasCalledUno(false);

        console.log(`Timer expired - calledUno: ${calledUno}`);

        setError(null);

        gameApi.playCard(gameId, humanPlayer.id, cardId, undefined, calledUno)
          .then(response => {
            if (response.success) {
              console.log('Play card response:', response, `calledUno: ${calledUno}`);
              startAnimationSequence(response.events, response.gameState, gameState);
            } else {
              console.log("Play card error:", response);
              throw new Error(response.message);
            }
          })
          .catch(err => {
            const errorMessage = err instanceof Error ? err.message : 'Failed to play card';
            setError(errorMessage);
            console.error('Error playing card:', err);
          })
          .finally(() => {
            pendingCardRef.current = null;
          });
      }, 1500);

      return;
    }

    setError(null);

    try {
      const response = await gameApi.playCard(gameId, humanPlayer.id, cardId, undefined, false);
      if (response.success) {
        console.log('Play card response:', response);
        startAnimationSequence(response.events, response.gameState, gameState);
      } else {
        console.log("Play card error:", response);
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play card';
      setError(errorMessage);
      console.error('Error playing card:', err);
      throw err;
    }
  }, [gameId, gameState, isAnimating, hasCalledUno, startAnimationSequence]);

  const onColorSelect = useCallback(async (color: number) => {
    const currentCardId = colorPicker.cardId;

    setColorPicker({
      isOpen: false,
      cardId: null,
      isInteractive: false,
      selectedColor: undefined,
    });

    if (!gameId || !gameState || !currentCardId || currentCardId === 'test-wild-card') {
      console.log('Test color selected:', color);
      return;
    }

    const humanPlayer = gameState.players.find(p => p.isHuman);
    if (!humanPlayer) {
      return;
    }

    const willHaveOneCard = humanPlayer.cards.length === 2;

    if (willHaveOneCard) {
      setIsWaitingForUno(true);
      pendingCardRef.current = { cardId: currentCardId, chosenColor: color };

      console.log('Waiting for UNO call (Wild)... (1.5s)');

      unoTimerRef.current = window.setTimeout(() => {
        setIsWaitingForUno(false);
        const calledUno = hasCalledUno;
        setHasCalledUno(false);

        console.log(`Timer expired (Wild) - calledUno: ${calledUno}`);

        setError(null);

        gameApi.playCard(gameId, humanPlayer.id, currentCardId, color, calledUno)
          .then(response => {
            if (response.success) {
              console.log('Play card with color response:', response, `calledUno: ${calledUno}`);
              startAnimationSequence(response.events, response.gameState, gameState);
            } else {
              console.log("Play card error:", response);
              throw new Error(response.message);
            }
          })
          .catch(err => {
            const errorMessage = err instanceof Error ? err.message : 'Failed to play card';
            setError(errorMessage);
            console.error('Error playing card:', err);
          })
          .finally(() => {
            pendingCardRef.current = null;
          });
      }, 1500);

      return;
    }

    setError(null);

    try {
      const response = await gameApi.playCard(gameId, humanPlayer.id, currentCardId, color, false);
      if (response.success) {
        console.log('Play card with color response:', response);
        startAnimationSequence(response.events, response.gameState, gameState);
      } else {
        console.log("Play card error:", response);
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play card';
      setError(errorMessage);
      console.error('Error playing card:', err);
      throw err;
    }
  }, [gameId, gameState, colorPicker.cardId, hasCalledUno, startAnimationSequence]);

  const drawCard = useCallback(async () => {
    if (!gameId || !gameState) {
      throw new Error('No active game');
    }

    if (isAnimating) {
      return;
    }

    const humanPlayer = gameState.players.find(p => p.isHuman);
    if (!humanPlayer) {
      throw new Error('No human player found');
    }

    setError(null);

    try {
      const response = await gameApi.drawCard(gameId, humanPlayer.id);

      console.log('Draw card response:', response);

      startAnimationSequence(response.events, response.gameState, gameState);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to draw card';
      setError(errorMessage);
      console.error('Error playing card:', err);

      setTimeout(() => setError(null), 3000);
      throw err;
    }
  }, [gameId, gameState, isAnimating, startAnimationSequence]);

  const resetGame = useCallback(() => {
    if (unoTimerRef.current) {
      clearTimeout(unoTimerRef.current);
      unoTimerRef.current = null;
    }

    setGameId(null);
    setInitialGameState(null as unknown as GameState);
    setError(null);
    clearGameOver();
    setHasCalledUno(false);
    setIsWaitingForUno(false);
    pendingCardRef.current = null;
    setColorPicker({
      isOpen: false,
      cardId: null,
      isInteractive: false,
      selectedColor: undefined,
    });
  }, [setInitialGameState, clearGameOver]);

  const setColorPickerTest = useCallback((isInteractive: boolean) => {
    setColorPicker({
      isOpen: true,
      cardId: 'test-wild-card',
      isInteractive,
      selectedColor: isInteractive ? undefined : 1,
    });

    if (!isInteractive) {
      setTimeout(() => {
        setColorPicker({
          isOpen: false,
          cardId: null,
          isInteractive: false,
          selectedColor: undefined,
        });
        console.log('Opponent finished choosing color (test)');
      }, 3000);
    }
  }, []);

  const value: GameContextValue = {
    gameId,
    gameState,
    isLoading,
    error,
    isAnimating,
    animatingCard,
    gameOver,
    colorPicker,
    unoEvent,
    startGame,
    playCard,
    drawCard,
    resetGame,
    onAnimationComplete,
    onColorSelect,
    onUnoCall,
    setGameOverTest,
    setColorPickerTest,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextValue => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
