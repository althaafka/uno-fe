import { useCallback, useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Card } from '../game/Card'; // Import the Card component

interface LandingScreenProps {
  onGameStart?: () => void;
}

export const LandingScreen = ({ onGameStart }: LandingScreenProps) => {
  const { isLoading, error, startGame } = useGame();
  const [playerCount, setPlayerCount] = useState<number>(4);

  const handleStartGame = useCallback(async () => {
    try {
      await startGame(playerCount);
      onGameStart?.();
    } catch {
      // Error is handled by context state
    }
  }, [startGame, onGameStart, playerCount]);

  return (
    <div className="w-screen h-screen bg-uno-purple overflow-hidden relative flex flex-col items-center justify-center">
      
      {/* Background Radial Gradient for depth (matches board feel) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent pointer-events-none" />

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-16">
        
        {/* Logo and Cards Group */}
        <div className="relative flex flex-col items-center">
          
          {/* 5 Face-Down Cards Fan */}
          <div className="relative h-30 w-full flex justify-center items-center">
            {/* Card 1 */}
            <div className="absolute transform -translate-x-32 translate-y-4 -rotate-12 hover:-translate-y-2 transition-transform duration-300">
               <Card card={{ id: "deck-1", color: 3, value: 4 }} isFaceDown scale={1.2} isClickable={false}/>
            </div>
            {/* Card 2 */}
            <div className="absolute transform -translate-x-16 -translate-y-2 -rotate-6 hover:-translate-y-6 transition-transform duration-300 z-10">
               <Card card={{ id: "deck-2", color: 2, value: 9 }} isFaceDown scale={1.2} />
            </div>
            {/* Card 3 (Center) */}
            <div className="absolute transform -translate-y-6 z-20 hover:-translate-y-10 transition-transform duration-300">
               <Card card={{ id: "deck-3", color: 0, value: 0 }} isFaceDown scale={1.2} />
            </div>
            {/* Card 4 */}
            <div className="absolute transform translate-x-16 -translate-y-2 rotate-6 hover:-translate-y-6 transition-transform duration-300 z-10">
               <Card card={{ id: "deck-4", color: 1, value: 11 }} isFaceDown scale={1.2} />
            </div>
            {/* Card 5 */}
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

        {/* Player Count Selection */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/90 font-bold text-lg">Select Number of Players</p>
          <div className="flex gap-4">
            {[2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`px-8 py-4 rounded-lg font-bold text-xl transition-all duration-200 ${
                  playerCount === count
                    ? 'bg-uno-yellow text-uno-purple shadow-lg scale-110'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Start button */}
        <button
          onClick={handleStartGame}
          disabled={isLoading}
          className="group relative px-12 py-5 bg-gradient-to-b from-uno-yellow to-orange-500 rounded-full font-black text-2xl text-uno-purple shadow-[0_6px_0_rgb(180,83,9)] active:shadow-[0_2px_0_rgb(180,83,9)] active:translate-y-1 transition-all duration-150 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className={`flex items-center justify-center gap-3 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
            <span>START</span>
            <svg
              className="w-8 h-8 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
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

        {/* Error message */}
        {error && (
          <div className="absolute bottom-12 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold animate-bounce">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Footer Version/Info */}
      <div className="absolute bottom-4 text-white/60 text-l font-mono">
        Press Start to begin a new game
      </div>
    </div>
  );
};