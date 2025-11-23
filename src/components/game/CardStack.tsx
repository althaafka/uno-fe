import { Card } from './Card';

interface CardStackProps {
  cardCount: number;
  maxCardsPerRow?: number;
  cardScale?: number;
  overlapOffset?: number;
  playerPosition: 'top' | 'bottom' | 'left' | 'right';
}

export const CardStack = ({
  cardCount,
  maxCardsPerRow = 15,
  cardScale = 1,
  overlapOffset = 42,
  playerPosition,
}: CardStackProps) => {
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

  const cardWidth = 64 * cardScale; // w-16 = 64px
  const cardHeight = 96 * cardScale; // h-24 = 96px

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

                return (
                  <div
                    key={cardIndex}
                    className="absolute"
                    style={{
                      top: `${centerOffset + positionIndex * overlapOffset}px`,
                    }}
                  >
                    <Card
                      card={{ color: 0, value: 0 }}
                      isFaceDown
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

              return (
                <div
                  key={cardIndex}
                  className="absolute"
                  style={{
                    left: `${centerOffset + positionIndex * overlapOffset}px`,
                  }}
                >
                  <Card
                    card={{ color: 0, value: 0 }}
                    isFaceDown
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
};
