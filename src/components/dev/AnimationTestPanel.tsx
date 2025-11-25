import { useState } from 'react';
import type { Card } from '../../types/game';
import type { AnimatingCard, PlayerPosition } from '../../types/animation';

interface AnimationTestPanelProps {
  onTriggerAnimation: (animatingCard: AnimatingCard) => void;
}

const SAMPLE_CARD: Card = {
  id: 'test-card',
  color: 1, // Blue
  value: 5,
};

export const AnimationTestPanel = ({ onTriggerAnimation }: AnimationTestPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationType, setAnimationType] = useState<'playCard' | 'drawCard'>('playCard');
  const [position, setPosition] = useState<PlayerPosition>('bottom');
  const [cardIndex, setCardIndex] = useState(0);
  const [totalCards, setTotalCards] = useState(7);

  const handleTrigger = () => {
    const animatingCard: AnimatingCard = {
      card: SAMPLE_CARD,
      animationType,
      startPosition: position,
      cardIndex,
      totalCards,
      playerId: 'test-player',
    };
    onTriggerAnimation(animatingCard);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg z-[200]"
      >
        🎬 Animation Test
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-6 rounded-lg shadow-2xl z-[200] w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Animation Tester</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Animation Type */}
        <div>
          <label className="block text-sm font-medium mb-2">Animation Type</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAnimationType('playCard')}
              className={`flex-1 px-3 py-2 rounded ${
                animationType === 'playCard'
                  ? 'bg-purple-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Play Card
            </button>
            <button
              onClick={() => setAnimationType('drawCard')}
              className={`flex-1 px-3 py-2 rounded ${
                animationType === 'drawCard'
                  ? 'bg-purple-600'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              Draw Card
            </button>
          </div>
        </div>

        {/* Player Position */}
        <div>
          <label className="block text-sm font-medium mb-2">Player Position</label>
          <div className="grid grid-cols-2 gap-2">
            {(['bottom', 'top', 'left', 'right'] as PlayerPosition[]).map((pos) => (
              <button
                key={pos}
                onClick={() => setPosition(pos)}
                className={`px-3 py-2 rounded capitalize ${
                  position === pos
                    ? 'bg-blue-600'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Card Index */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Card Index: {cardIndex}
          </label>
          <input
            type="range"
            min="0"
            max={totalCards - 1}
            value={cardIndex}
            onChange={(e) => setCardIndex(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Total Cards */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Total Cards: {totalCards}
          </label>
          <input
            type="range"
            min="1"
            max="15"
            value={totalCards}
            onChange={(e) => setTotalCards(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Trigger Button */}
        <button
          onClick={handleTrigger}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg mt-4"
        >
          🚀 Trigger Animation
        </button>

        {/* Info */}
        <div className="text-xs text-gray-400 mt-4 p-3 bg-gray-900 rounded">
          <div className="font-semibold mb-1">Current Settings:</div>
          <div>Type: {animationType}</div>
          <div>Position: {position}</div>
          <div>Card: {cardIndex} of {totalCards}</div>
        </div>
      </div>
    </div>
  );
};
