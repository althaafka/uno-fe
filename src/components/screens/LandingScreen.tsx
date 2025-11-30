import { useCallback, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Card } from '../game/Card';
import { GameDialog } from '../game/GameDialog';

interface LandingScreenProps {
  onGameStart?: () => void;
}

export const LandingScreen = ({ onGameStart }: LandingScreenProps) => {
  const { isLoading, error, startGame } = useGame();
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [initialCardCount, setInitialCardCount] = useState<number>(7);
  const [playerName, setPlayerName] = useState<string>('You');
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const MAX_NAME_LENGTH = 15;

  const handlePlayerNameChange = (name: string) => {
    // Enforce max length
    const trimmedName = name.slice(0, MAX_NAME_LENGTH);
    setPlayerName(trimmedName);
  };

  const handleStartGame = useCallback(async () => {
    try {
      await startGame(playerCount, playerName, initialCardCount);
      onGameStart?.();
    } catch {
      // Error is handled by context state
    }
  }, [startGame, onGameStart, playerCount, playerName, initialCardCount]);

  return (
    <div className="w-screen h-screen bg-uno-purple overflow-hidden relative flex flex-col items-center justify-center">

      {/* Background Radial Gradient for depth (matches board feel) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />

      {/* Settings button - Top Right */}
      <div className="absolute top-8 right-8 z-40">
        <button
          onClick={() => setShowSettings(true)}
          className="group h-12 w-12 flex justify-center relative bg-gradient-to-b from-uno-purple to-uno-dark-purple rounded-xl font-black text-lg text-white shadow-[0_4px_0_#382f50] active:shadow-[0_2px_0_#382f50] active:translate-y-1 transition-all duration-150 hover:brightness-130 brightness-120"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </div>
        </button>
      </div>

      {/* Settings Dialog */}
      <GameDialog
        isOpen={showSettings}
        title="GAME SETUP"
        onClose={() => setShowSettings(false)}
        buttons={[
          {
            text: 'SAVE',
            onClick: () => setShowSettings(false),
            variant: 'primary'
          }
        ]}
      >
        <div className="flex flex-col gap-6 w-full">
          {/* Player Name Input */}
          <div className="flex flex-col gap-2">
            <label className="text-uno-yellow font-bold text-lg uppercase tracking-wide">Player Name</label>
            <div className="relative">
              <input
                type="text"
                value={playerName}
                onChange={(e) => handlePlayerNameChange(e.target.value)}
                placeholder="Enter Name"
                maxLength={MAX_NAME_LENGTH}
                className="w-full px-4 py-3 rounded-xl font-bold bg-black/20 text-white placeholder-white/30 border-2 border-white/10 focus:border-uno-yellow focus:outline-none focus:bg-black/40 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 font-mono">
                {playerName.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
          </div>

          {/* Player Count */}
          <div className="flex flex-col gap-2">
            <label className="text-uno-yellow font-bold text-lg uppercase tracking-wide">Number of Players</label>
            <div className="grid grid-cols-3 gap-5">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className={`py-1.5 rounded-xl font-black text-xl transition-all duration-200 border-2 ${
                    playerCount === count
                      ? 'bg-white text-uno-purple border-white shadow-lg scale-105'
                      : 'bg-transparent text-white border-white/20 hover:bg-white/10'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Initial Cards */}
          <div className="flex flex-col gap-2">
            <label className="text-uno-yellow font-bold text-lg uppercase tracking-wide">Starting Cards</label>
            <div className="flex items-center bg-black/20 p-2 rounded-xl border-2 border-white/10">
              <button
                onClick={() => setInitialCardCount(Math.max(2, initialCardCount - 1))}
                disabled={initialCardCount <= 2}
                className="w-8 h-8 flex items-center justify-center bg-white/10 text-white font-bold text-2xl rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                -
              </button>
              <div className="flex-1 text-center font-black text-2xl text-white">
                {initialCardCount}
              </div>
              <button
                onClick={() => setInitialCardCount(Math.min(15, initialCardCount + 1))}
                disabled={initialCardCount >= 15}
                className="w-8 h-8 flex items-center justify-center bg-white/10 text-white font-bold text-2xl rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </GameDialog>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-16">

        {/* Logo and Cards Group */}
        <div className="relative flex flex-col items-center">
          {/* 5 Face-Down Cards Fan */}
          <div className="relative h-30 w-full flex justify-center items-center mb-8">
            <div className="absolute transform -translate-x-32 translate-y-4 -rotate-12 hover:-translate-y-2 transition-transform duration-300">
               <Card card={{ id: "deck-1", color: 3, value: 4 }} isFaceDown scale={1.2} isClickable={false}/>
            </div>
            <div className="absolute transform -translate-x-16 -translate-y-2 -rotate-6 hover:-translate-y-6 transition-transform duration-300 z-10">
               <Card card={{ id: "deck-2", color: 2, value: 9 }} isFaceDown scale={1.2} />
            </div>
            <div className="absolute transform -translate-y-6 z-20 hover:-translate-y-10 transition-transform duration-300">
               <Card card={{ id: "deck-3", color: 0, value: 0 }} isFaceDown scale={1.2} />
            </div>
            <div className="absolute transform translate-x-16 -translate-y-2 rotate-6 hover:-translate-y-6 transition-transform duration-300 z-10">
               <Card card={{ id: "deck-4", color: 1, value: 11 }} isFaceDown scale={1.2} />
            </div>
            <div className="absolute transform translate-x-32 translate-y-4 rotate-12 hover:-translate-y-2 transition-transform duration-300">
               <Card card={{ id: "deck-5", color: 0, value: 12 }} isFaceDown scale={1.2} />
            </div>
          </div>

          {/* Big UNO Text */}
          <h1 className="text-[10rem] leading-none font-black tracking-tighter drop-shadow-2xl z-30 transform -rotate-6">
            <span className="text-uno-red drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]" style={{ textShadow: '6px 6px 0px neutral-800' }}>U</span>
            <span className="text-uno-yellow drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]" style={{ textShadow: '6px 6px 0px neutral-800' }}>N</span>
            <span className="text-uno-green drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]" style={{ textShadow: '6px 6px 0px neutral-800' }}>O</span>
            <span className="text-uno-blue text-9xl align-top ml-2 animate-bounce drop-shadow-[0_8px_0_rgba(0,0,0,0.3)]" style={{ textShadow: '5px 5px 0px neutral-800' }}>!</span>
          </h1>

          <p className="text-2xl text-white/90 font-bold tracking-[0.5em] mt-4 uppercase text-shadow-sm">
            The Classic Card Game
          </p>
        </div>

        {/* Start button and game info */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={handleStartGame}
            disabled={isLoading}
            className="group h-12 w-40 relative bg-gradient-to-b from-uno-yellow to-orange-500 rounded-full font-black text-3xl text-uno-purple shadow-[0_8px_0_rgb(180,83,9)] active:shadow-[0_2px_0_rgb(180,83,9)] active:translate-y-1 transition-all duration-150 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div className={`flex text-4xl items-center justify-center gap-3 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              <span>PLAY</span>
            </div>

            {/* Loading spinner */}
            {isLoading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 animate-spin text-uno-purple" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </span>
            )}
          </button>

          {/* Current Settings Summary */}
          <div className="text-white/50 text-sm font-mono flex gap-4">
            <span>{playerCount} Players</span>
            <span>•</span>
            <span>{initialCardCount} Cards</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="absolute -bottom-24 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-bounce">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Footer Version/Info */}
      <div className="absolute bottom-4 text-white/60 text-l font-mono">
        Press Play to begin a new game
      </div>
    </div>
  );
};