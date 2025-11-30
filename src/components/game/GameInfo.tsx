import type { GameDirection, CardColor } from '../../types/game';
import { CARD_COLORS } from '../../constants/game';

interface GameInfoProps {
  direction: GameDirection;
  currentColor: CardColor;
  onUnoClick: () => void;
}

export const GameInfo = ({direction, currentColor, onUnoClick}: GameInfoProps) => {
  const getColorIndicator = () => {
    if (currentColor === 4) return 'transparent';
    return CARD_COLORS[currentColor];
  };

  const getDirectionStyle = () => {
    return direction === 0 
      ? "rotate-0 text-orange-400"
      : "rotate-180 text-violet-400";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Direction */}
      <div
        className="relative w-11 h-11 rounded-xl shadow-xl border-3 border-white bg-[#2C3E50] transform rotate-45 flex items-center justify-center overflow-hidden"
        title={direction === 0 ? 'Clockwise' : 'Counter-clockwise'}
      >
        <div 
          className={`transform -rotate-45 transition-all duration-500 ease-in-out ${getDirectionStyle()}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
        </div>
      </div>

      {/*Current Color*/}
      <div
        className="w-11 h-11 rounded-xl shadow-xl border-3 border-white transform rotate-45"
        style={{ backgroundColor: getColorIndicator() }}
        title="Current Color"
      />

      {/* Uno Button*/}
      <button
        onClick={onUnoClick}
        className="w-11 h-11 rounded-xl shadow-xl border-3 border-white transform rotate-45 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: CARD_COLORS[4]
        }}
        title="Call UNO!"
      >
        <span className="transform -rotate-45 text-l font-bold text-white">UNO</span>
      </button>
    </div>
  )
}