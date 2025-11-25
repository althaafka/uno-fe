import { Card } from './Card';
import type { Card as CardType } from '../../types/game';
import { motion } from 'framer-motion';

interface CardStackProps {
  cardCount: number;
  cards?: CardType[];
  maxCardsPerRow?: number;
  cardScale?: number;
  overlapOffset?: number;
  playerPosition: 'top' | 'bottom' | 'left' | 'right';
  onCardClick?: (cardId: string) => void;
  hiddenCardIndex?: number;
}

export const CardStack = ({
  cardCount,
  cards,
  maxCardsPerRow = 15,
  cardScale = 1,
  overlapOffset = 42,
  playerPosition,
  onCardClick,
  hiddenCardIndex,
}: CardStackProps) => {
  const isFaceDown = !cards || cards.length === 0;
  // Orientation based on player position
  const isVertical = playerPosition === 'left' || playerPosition === 'right';

  const cardRotation = {
    top: 180,
    bottom: 0,
    left: 90,
    right: -90,
  }[playerPosition];

  // Card order based on player position
  const shouldReverse = playerPosition === 'right' || playerPosition === 'top';

  const rowCount = Math.ceil(cardCount / maxCardsPerRow);

  // Distribute cards
  const rows: number[] = [];
  let remainingCards = cardCount;
  for (let i = 0; i < rowCount; i++) {
    const cardsInThisRow = Math.min(remainingCards, maxCardsPerRow);
    rows.push(cardsInThisRow);
    remainingCards -= cardsInThisRow;
  }

  const cardWidth = 64 * cardScale;
  const cardHeight = 96 * cardScale;

  if (isVertical) {
    // Vertical stack
    const stackHeight = cardHeight + (maxCardsPerRow - 1) * overlapOffset;
    const stackWidth = cardWidth * rowCount + (rowCount > 1 ? (rowCount - 1) * 4 : 0);

    return (
      <div
        className="flex flex-row gap-1"
        style={{
          height: `${stackHeight}px`,
          width: `${stackWidth}px`,
        }}
      >
        {rows.map((cardsInCol, colIndex) => {
          const colHeight = cardHeight + (cardsInCol - 1) * overlapOffset;
          const centerOffset = (stackHeight - colHeight) / 2;

          return (
            <div key={colIndex} className="relative" style={{ width: `${cardWidth}px` }}>
              {Array.from({ length: cardsInCol }).map((_, cardIndex) => {
                // Calculate position based on reverse setting
                const positionIndex = shouldReverse ? (cardsInCol - 1 - cardIndex) : cardIndex;
                const globalCardIndex = colIndex * maxCardsPerRow + cardIndex;
                const cardData = cards?.[globalCardIndex];

                const isHidden = hiddenCardIndex === globalCardIndex;

                return (
                  <div
                    key={cardIndex}
                    className="absolute"
                    data-card-index={globalCardIndex}
                    data-position={playerPosition}
                    style={{
                      top: `${centerOffset + positionIndex * overlapOffset}px`,
                      opacity: isHidden ? 0 : 1,
                    }}
                  >
                    <Card
                      card={cardData ?? { id: '', color: 0, value: 0 }}
                      isFaceDown={isFaceDown}
                      scale={cardScale}
                      rotate={cardRotation}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal stack
  const stackWidth = cardWidth + (maxCardsPerRow - 1) * overlapOffset;

  return (
    <div
      className="flex flex-col"
      style={{ width: `${stackWidth}px` }}
    >
      {rows.map((cardsInRow, rowIndex) => {
        const rowWidth = cardWidth + (cardsInRow - 1) * overlapOffset;
        const centerOffset = (stackWidth - rowWidth) / 2;

        return (
          <div key={rowIndex} className="relative h-[20px]">
            {Array.from({ length: cardsInRow }).map((_, cardIndex) => {
              const positionIndex = shouldReverse ? (cardsInRow - 1 - cardIndex) : cardIndex;
              const globalCardIndex = rowIndex * maxCardsPerRow + cardIndex;
              const cardData = cards?.[globalCardIndex];
              const isHidden = hiddenCardIndex === globalCardIndex;

              return (
                <motion.div
                  key={cardIndex}
                  className="absolute"
                  data-card-index={globalCardIndex}
                  data-position={playerPosition}
                  style={{
                    left: `${centerOffset + positionIndex * overlapOffset}px`,
                    opacity: isHidden ? 0 : 1,
                  }}
                  whileHover={!isFaceDown && !isHidden ? {
                    y: -20,
                    scale: 1.05,
                    zIndex: 50,
                    transition: { duration: 0.2 }
                  } : undefined}
                  onClick={() => cardData && !isHidden && onCardClick?.(cardData.id)}
                >
                  <Card
                    card={cardData ?? { id: '', color: 0, value: 0 }}
                    isFaceDown={isFaceDown}
                    scale={cardScale}
                    rotate={cardRotation}
                  />
                </motion.div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
