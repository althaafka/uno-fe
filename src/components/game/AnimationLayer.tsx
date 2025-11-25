import { motion } from 'framer-motion';
import { Card } from './Card';
import type { AnimatingCard, PlayerPosition } from '../../types/animation';

interface AnimationLayerProps {
  animatingCard: AnimatingCard | null;
  onAnimationComplete: () => void;
}

const ANIMATION_DURATION = 0.75; // seconds

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

// Player card stack position (for PlayCard animation start)
// TO DO: player hand's position still wrong
const getPlayerCardPosition = (position: PlayerPosition, cardIndex: number, _totalCards: number): { x: number; y: number; rotation: number } => {
  const cardOffset = cardIndex * 42;
  const cardOffsetVertical = cardIndex * 24;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  switch (position) {
    case 'bottom':
      return {
        x: -200 + cardOffset,
        y: screenHeight/2 - 130,
        rotation: 0,
      };
    case 'top':
      return {
        x: 140 - cardOffset,
        y: -screenHeight/2 + 30,
        rotation: 180,
      };
    case 'left':
      return {
        x: -screenWidth/2 + 50,
        y: -180 + cardOffsetVertical,
        rotation: 90,
      };
    case 'right':
      return {
        x: screenWidth/2 - 110,
        y: 82 - cardOffsetVertical,
        rotation: -90,
      };
  }
};

// Player hand end position (for DrawCard animation end)
// TO DO: player hand's position still wrong
const getPlayerHandEndPosition = (position: PlayerPosition, cardIndex: number): { x: number; y: number; rotation: number } => {
  const cardOffset = cardIndex * 42;
  const cardOffsetVertical = cardIndex * 24;

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  switch (position) {
    case 'bottom':
      return {
        x: -200 + cardOffset,
        y: screenHeight/2 - 130,
        rotation: 0,
      };
    case 'top':
      return {
        x: 140 - cardOffset,
        y: -screenHeight/2 + 30,
        rotation: 180,
      };
    case 'left':
      return {
        x: -screenWidth/2 + 50,
        y: -180 + cardOffsetVertical,
        rotation: 90,
      };
    case 'right':
      return {
        x: screenWidth/2 - 110,
        y: 82 - cardOffsetVertical,
        rotation: -90,
      };
  }
};

export const AnimationLayer = ({ animatingCard, onAnimationComplete }: AnimationLayerProps) => {
  if (!animatingCard) {
    return null;
  }

  let startPos: { x: number; y: number; rotation: number };
  let endPos: { x: number; y: number; rotation: number };
  let targetScale: number;

  if (animatingCard.animationType === 'playCard') {
    startPos = getPlayerCardPosition(animatingCard.startPosition, animatingCard.cardIndex, animatingCard.totalCards);
    endPos = getDiscardPosition();
    targetScale = 1.2;
  } else {
    startPos = getDeckPosition();
    endPos = getPlayerHandEndPosition(animatingCard.startPosition, animatingCard.cardIndex);
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
