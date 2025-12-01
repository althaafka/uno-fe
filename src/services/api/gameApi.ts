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
  startGame: async (playerCount: number = 4, playerName: string = 'You', initialCardCount: number = 7): Promise<GameData> => {
    const response = await fetch(`${API_BASE_URL}/Game/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerName: playerName,
        playerCount: playerCount,
        initialCardCount: initialCardCount,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start game: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  },

  playCard: async (gameId: string, playerId: string, cardId: string, chosenColor?: number, calledUno?: boolean): Promise<PlayCardResponse> => {
    const response = await fetch(`${API_BASE_URL}/Game/${gameId}/play`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerId,
        cardId,
        chosenColor: chosenColor !== undefined ? chosenColor : null,
        calledUno: calledUno ?? false,
      }),
    });

    // console.log("play card req:",{
    //     playerId,
    //     cardId,
    //     chosenColor: chosenColor !== undefined ? chosenColor : null,
    //     calledUno: calledUno ?? false,
    //   })

    const result = await response.json();

    if (!response.ok) {
      console.log("Error:", result)
      throw new Error(`Failed to play card: ${response.status}`);
    }

    return result.data;
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

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.message || `Failed to draw card: ${response.status}`);
    }

    if (!result.success) {
      throw new Error(result.message || 'Failed to draw card');
    }

    console.log("Draw card response:", result);
    return result.data;
  },
};

export type { GameData };
