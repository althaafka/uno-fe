import type { GameData } from '../../types/game';

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
};

export type { GameData };
