import { motion } from 'framer-motion';
import { Card } from './Card';
import type { AnimatingCard, PlayerPosition } from '../../types/animation';

interface AnimationLayerProps {
  animatingCard: AnimatingCard | null;
  onAnimationComplete: () => void;
}

const ANIMATION_DURATION = 0.75; // ms

const getStartPosition = (position: PlayerPosition, cardIndex: number): { x: number; y: number; rotation: number } => {
  const cardOffset = cardIndex * 42;

  switch (position) {
    case 'bottom':
      return {
        x: -200 + cardOffset,
        y: 280,
        rotation: 0,
      };
    case 'top':
      return {
        x: -200 + cardOffset,
        y: -280,
        rotation: 180,
      };
    case 'left':
      return {
        x: -380,
        y: -150 + cardOffset * 0.6,
        rotation: 90,
      };
    case 'right':
      return {
        x: 380,
        y: -150 + cardOffset * 0.6,
        rotation: -90,
      };
  }
};

const getEndPosition = (): { x: number; y: number; rotation: number } => {
  return {
    x: 0,
    y: 0,
    rotation: 0,
  };
};

export const AnimationLayer = ({ animatingCard, onAnimationComplete }: AnimationLayerProps) => {
  if (!animatingCard) {
    return null;
  }

  const startPos = getStartPosition(animatingCard.startPosition, animatingCard.cardIndex);
  const endPos = getEndPosition();

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
            scale: 1.2,
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
            isFaceDown={animatingCard.startPosition !== 'bottom'}
          />
        </motion.div>
      </div>
    </div>
  );
};
