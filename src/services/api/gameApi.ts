import type { GameData, GameEvent, GameState } from '../../types/game';

export interface PlayCardResponse {
  success: boolean;
  message: string;
  gameState: GameState;
  events: GameEvent[];
}

export interface DrawCardResponse {
  success: boolean;
  message: string;
  cardWasPlayed: boolean;
  gameState: GameState;
  events: GameEvent[];
}

const API_BASE_URL = 'http://localhost:5165/api';

export const gameApi = {
  startGame: async (): Promise<GameData> => {
    const response = await fetch(`${API_BASE_URL}/Game/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: 'you',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start game: ${response.status}`);
    }

    return response.json();
  },

  playCard: async (gameId: string, playerId: string, cardId: string): Promise<PlayCardResponse> => {
    const response = await fetch(`${API_BASE_URL}/Game/${gameId}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId,
        cardId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to play card: ${response.status}`);
    }

    return response.json();
  },

  drawCard: async (gameId: string, playerId: string): Promise<DrawCardResponse> => {
    const response = await fetch(`${API_BASE_URL}/Game/${gameId}/draw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Failed to draw card: ${response.status}`);
    }

    const data = await response.json();

    // Check if backend returned success: false (e.g., player has playable cards)
    if (!data.success) {
      throw new Error(data.message || 'Failed to draw card');
    }

    return data;
  },
};

export type { GameData };
