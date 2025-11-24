import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Card, GameData, GameState } from '../types/game';
import { gameApi } from '../services/api/gameApi';

const isCardPlayable = (card: Card, topCard: Card, currentColor: number): boolean => {
  if (card.color === 4) return true;
  if (card.color === currentColor) return true;
  if (card.value === topCard.value) return true;
  return false;
};

interface GameContextValue {
  gameId: string | null;
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  startGame: () => Promise<void>;
  playCard: (cardId: string) => Promise<void>;
  resetGame: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data: GameData = await gameApi.startGame();
      console.log('Game started successfully:', data);
      setGameId(data.gameId);
      setGameState(data.gameState);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error starting game:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const playCard = useCallback(async (cardId: string) => {
    if (!gameId || !gameState) {
      throw new Error('No active game');
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

    setError(null);

    try {
      const response = await gameApi.playCard(gameId, humanPlayer.id, cardId);
      if (response.success) {
        setGameState(response.gameState);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play card';
      setError(errorMessage);
      console.error('Error playing card:', err);
      throw err;
    }
  }, [gameId, gameState]);

  const resetGame = useCallback(() => {
    setGameId(null);
    setGameState(null);
    setError(null);
  }, []);

  const value: GameContextValue = {
    gameId,
    gameState,
    isLoading,
    error,
    startGame,
    playCard,
    resetGame,
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
