export interface GameSettings {
  playerCount: number;
  playerName: string;
  initialCardCount: number;
}

const SETTINGS_KEY = 'uno-game-settings';

const defaultSettings: GameSettings = {
  playerCount: 4,
  playerName: 'You',
  initialCardCount: 7,
};

export const saveGameSettings = (settings: GameSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save game settings:', error);
  }
};

export const loadGameSettings = (): GameSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GameSettings;
      return {
        playerCount: Math.min(Math.max(parsed.playerCount || 4, 2), 4),
        playerName: parsed.playerName || 'You',
        initialCardCount: Math.min(Math.max(parsed.initialCardCount || 7, 2), 15),
      };
    }
  } catch (error) {
    console.error('Failed to load game settings:', error);
  }
  return defaultSettings;
};
