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

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Direction */}
      <div
        className="w-10 h-10 rounded-lg shadow-lg border-3 border-white bg-[#2C3E50] transform rotate-45 flex items-center justify-center"
        title={direction === 0 ? 'Clockwise' : 'Counter-clockwise'}
      >
        <span className="text-2xl text-white transform -rotate-45">
          {direction === 0 ? '↻' : '↺'}
        </span>
      </div>

      {/*Current Color*/}
      <div
        className="w-10 h-10 rounded-lg shadow-lg border-3 border-white transform rotate-45"
        style={{ backgroundColor: getColorIndicator() }}
        title="Current Color"
      />

      {/* Uno Button*/}
      <button
        onClick={onUnoClick}
        className="w-10 h-10 rounded-lg shadow-lg border-3 border-white transform rotate-45 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        style={{
          background: CARD_COLORS[4]
        }}
        title="Call UNO!"
      >
        <span className="transform -rotate-45 text-xs font-bold text-white">UNO</span>
      </button>
    </div>
  )
}