import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { GameData, GameState } from '../types/game';
import { gameApi } from '../services/api/gameApi';

interface GameContextValue {
  gameId: string | null;
  gameState: GameState | null;
  isLoading: boolean;
  error: string | null;
  startGame: () => Promise<void>;
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
