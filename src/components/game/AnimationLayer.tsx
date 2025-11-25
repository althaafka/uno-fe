import { motion } from 'framer-motion';
import { Card } from './Card';
import type { AnimatingCard, PlayerPosition } from '../../types/animation';

interface AnimationLayerProps {
  animatingCard: AnimatingCard | null;
  onAnimationComplete: () => void;
}

const ANIMATION_DURATION = 1; // seconds

// Deck position
const getDeckPosition = (): { x: number; y: number; rotation: number } => {
  return {
    x: -120,
    y: -45,
    rotation: 0,
  };
};

// Discard pile position
const getDiscardPosition = (): { x: number; y: number; rotation: number } => {
  return {
    x: -20,
    y: -45,
    rotation: 0,
  };
};

// Get the rotation for each player position
const getRotationForPosition = (position: PlayerPosition): number => {
  switch (position) {
    case 'bottom': return 0;
    case 'top': return 180;
    case 'left': return 90;
    case 'right': return -90;
  }
};

// Get card position by finding the actual DOM element
const getCardPositionFromDOM = (
  position: PlayerPosition,
  cardIndex: number
): { x: number; y: number; rotation: number } | null => {
  const selector = `[data-position="${position}"][data-card-index="${cardIndex}"]`;

  const cardElement = document.querySelector(selector) as HTMLElement;

  if (cardElement) {
    const rect = cardElement.getBoundingClientRect();
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;

    const result = {
      x: rect.left + rect.width / 2 - screenCenterX -32,
      y: rect.top + rect.height / 2 - screenCenterY -48,
      rotation: getRotationForPosition(position),
    };

    return result;
  }

  return null;
};

// For DrawCard: Calculate new card position based on last card position
const getDrawCardEndPosition = (
  position: PlayerPosition,
  lastCardIndex: number
): { x: number; y: number; rotation: number } | null => {
  const lastCardPos = getCardPositionFromDOM(position, lastCardIndex);

  if (!lastCardPos) {
    console.warn('Could not find last card position for DrawCard');
    return null;
  }

  const newPos = { ...lastCardPos };

  switch (position) {
    case 'bottom':
      newPos.x += 42;
      break;
    case 'top':
      newPos.x -= 42;
      break;
    case 'left':
      newPos.y += 24;
      break;
    case 'right':
      newPos.y -= 24;
      break;
  }

  console.log('DrawCard position calculated:', {
    position,
    lastCardIndex,
    lastCardPos,
    newPos,
  });

  return newPos;
};

export const AnimationLayer = ({ animatingCard, onAnimationComplete }: AnimationLayerProps) => {
  if (!animatingCard) {
    return null;
  }

  let startPos: { x: number; y: number; rotation: number };
  let endPos: { x: number; y: number; rotation: number };
  let targetScale: number;

  if (animatingCard.animationType === 'playCard') {
    const domPos = getCardPositionFromDOM(animatingCard.startPosition, animatingCard.cardIndex);

    startPos = domPos || {
      x: 0,
      y: 200,
      rotation: getRotationForPosition(animatingCard.startPosition),
    };
    endPos = getDiscardPosition();
    targetScale = 1.2;
  } else {
    startPos = getDeckPosition();

    const lastCardIndex = animatingCard.cardIndex - 1;
    const calculatedPos = lastCardIndex >= 0
      ? getDrawCardEndPosition(animatingCard.startPosition, lastCardIndex)
      : null;

    endPos = calculatedPos || {
      x: 0,
      y: 200,
      rotation: getRotationForPosition(animatingCard.startPosition),
    };
    targetScale = 1;
  }

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 100 }}
    >
      <div className="absolute top-1/2 left-1/2">
        <motion.div
          initial={{
            x: startPos.x,
            y: startPos.y,
            rotate: startPos.rotation,
            scale: 1,
          }}
          animate={{
            x: endPos.x,
            y: endPos.y,
            rotate: endPos.rotation,
            scale: targetScale,
          }}
          transition={{
            duration: ANIMATION_DURATION,
            ease: 'easeInOut',
          }}
          onAnimationComplete={onAnimationComplete}
          style={{
            position: 'absolute',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Card
            card={animatingCard.card}
            isFaceDown={
              animatingCard.animationType === 'drawCard' ||
              animatingCard.startPosition !== 'bottom'
            }
          />
        </motion.div>
      </div>
    </div>
  );
};
