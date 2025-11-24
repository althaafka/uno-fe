import { useCallback } from 'react';
import { useGame } from '../../context/GameContext';

interface LandingScreenProps {
  onGameStart?: () => void;
}

export const LandingScreen = ({ onGameStart }: LandingScreenProps) => {
  const { isLoading, error, startGame } = useGame();

  const handleStartGame = useCallback(async () => {
    try {
      await startGame();
      onGameStart?.();
    } catch {

    }
  }, [startGame, onGameStart]);

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-uno-purple via-slate-900 to-uno-blue overflow-hidden relative flex flex-col items-center justify-center">
      {/* Decorative circles */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-uno-red/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-uno-yellow/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-uno-green/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/3 w-56 h-56 bg-uno-blue/20 rounded-full blur-3xl" />

      {/* Floating cards decoration */}
      <div className="absolute top-16 right-32 rotate-12 opacity-30">
        <div className="w-16 h-24 bg-uno-red rounded-lg shadow-lg" />
      </div>
      <div className="absolute bottom-24 left-24 -rotate-12 opacity-30">
        <div className="w-16 h-24 bg-uno-blue rounded-lg shadow-lg" />
      </div>
      <div className="absolute top-1/3 left-16 rotate-6 opacity-30">
        <div className="w-16 h-24 bg-uno-yellow rounded-lg shadow-lg" />
      </div>
      <div className="absolute bottom-1/4 right-24 -rotate-6 opacity-30">
        <div className="w-16 h-24 bg-uno-green rounded-lg shadow-lg" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-8xl font-black tracking-tight mb-4">
            <span className="text-uno-red">U</span>
            <span className="text-uno-yellow">N</span>
            <span className="text-uno-green">O</span>
          </h1>
          <p className="text-2xl text-white/80 font-light tracking-widest">
            CARD GAME
          </p>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="w-40 h-10 group relative px-10 py-4 bg-gradient-to-r from-uno-red to-uno-yellow rounded-2xl font-bold text-xl text-white shadow-lg shadow-uno-red/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-uno-yellow/40 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className={`flex items-center justify-center ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <svg
              className="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span style={{ marginLeft: '12px' }}>Start Game</span>
          </div>

          {/* Loading spinner */}
          {isLoading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </span>
          )}
        </button>

        {/* Error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-6 py-3 text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-white/40 text-sm">
        Press Start to begin a new game
      </div>
    </div>
  );
};
