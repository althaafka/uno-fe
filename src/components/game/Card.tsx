import type { Card as CardType } from '../../types/game';
import { CARD_COLORS, CARD_VALUE_NAMES } from '../../constants/game';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  isClickable?: boolean;
  isSelected?: boolean;
  isFaceDown?: boolean;
  isDisabled?: boolean;
  rotate?: number;
  scale?: number;
}

export const Card = ({
  card,
  onClick,
  isClickable = false,
  isSelected = false,
  isFaceDown = false,
  isDisabled = false,
  rotate = 0,
  scale = 1,
}: CardProps) => {
  const cardColor = CARD_COLORS[card.color];
  const cardValue = CARD_VALUE_NAMES[card.value];

  const getActionSymbol = (): string | null => {
    switch (card.value) {
      case 10:
        return '⃠';
      case 11:
        return '⇄';
      case 12:
        return '+2';
      case 13:
        return '◆';
      case 14:
        return '+4';
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        w-16 h-24 relative rounded-lg shadow-lg cursor-pointer select-none
        transition-all duration-200
        ${isSelected ? 'ring-4 ring-white ring-opacity-80' : ''}
        ${isDisabled ? 'opacity-50' : 'opacity-100'}
      `}
      style={{
        transform: `rotate(${rotate}deg) scale(${scale})`,
      }}
      onClick={isClickable && !isDisabled ? onClick : undefined}
    >
      <div
        className="w-16 h-24 rounded-lg flex items-center justify-center border-3 border-white overflow-hidden"
        style={{
          background: isFaceDown ? '#2C3E50' : cardColor,
        }}
      >
        {isFaceDown ? (
          <div className="text-center">
            <div className="text-2xl font-black text-white opacity-30">UNO</div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            {/* Top-left corner */}
            <div className="absolute z-1 top-2 left-2 text-white font-bold text-xs">
              {getActionSymbol() || cardValue}
            </div>

            {/* Center value/symbol */}
            <div className="text-white z-1 font-black text-3xl">
              {getActionSymbol() || cardValue}
            </div>

            {/* Bottom-right corner (upside down) */}
            <div className="absolute bottom-2 z-1 right-2 text-white font-bold text-xs rotate-180">
              {getActionSymbol() || cardValue}
            </div>

            {/* Wild cards additional decoration */}
            {card.color === 4 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-20 bg-[#2C3E50] bg-opacity-20 rounded-lg" />
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
