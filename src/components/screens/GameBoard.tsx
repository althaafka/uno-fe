import { Card } from '../game/Card';
import { CardStack } from '../game/CardStack';
import { PlayerAvatar } from '../game/PlayerAvatar';
import { GameInfo } from '../game/GameInfo';
import { AnimationLayer } from '../game/AnimationLayer';
import { AnimationTestPanel } from '../dev/AnimationTestPanel';
import { GameDialog } from '../game/GameDialog';
import { ColorPickerDialog } from '../game/ColorPickerDialog';
import { useGame } from '../../context/GameContext';
import { useState } from 'react';
import type { AnimatingCard } from '../../types/animation';

interface GameBoardProps {
  onBackToLanding: () => void;
}

export const GameBoard = ({ onBackToLanding }: GameBoardProps) => {
  const { gameState, isLoading, error, playCard, drawCard, isAnimating, animatingCard, onAnimationComplete, gameOver, colorPicker, onColorSelect, onUnoCall, resetGame, setGameOverTest, setColorPickerTest } = useGame();
  const [testAnimatingCard, setTestAnimatingCard] = useState<AnimatingCard | null>(null);

  const handleCardClick = async (cardId: string) => {
    if (isAnimating) return;

    try {
      await playCard(cardId);
    } catch (err) {
      console.error('Failed to play card:', err);
    }
  };

  const handleDeckClick = async () => {
    if (isAnimating) return;

    // Only allow human player to draw on their turn
    if (!gameState) return;

    const humanPlayer = gameState.players.find(p => p.isHuman);
    if (!humanPlayer) return;

    if (gameState.currentPlayerId !== humanPlayer.id) {
      console.log('Not your turn');
      return;
    }

    try {
      await drawCard();
    } catch (err) {
      console.error('Failed to draw card:', err);
    }
  };

  const handleTestAnimation = (card: AnimatingCard) => {
    setTestAnimatingCard(card);
  };

  const handleTestAnimationComplete = () => {
    setTestAnimatingCard(null);
  };

  const handleTestGameOver = (winnerId: string, isHumanWinner: boolean) => {
    if (!gameState) return;

    // Get the actual winner ID from game state
    const mockWinnerId = isHumanWinner
      ? gameState.players.find(p => p.isHuman)?.id || winnerId
      : gameState.players.find(p => !p.isHuman)?.id || winnerId;

    console.log('Test Game Over triggered:', { winnerId: mockWinnerId, isHumanWinner });

    // Trigger game over using the test function
    setGameOverTest(mockWinnerId);
  };

  const handleTestColorPicker = (isInteractive: boolean) => {
    console.log('Test Color Picker triggered:', { isInteractive });
    setColorPickerTest(isInteractive);
  };

  const handleBackToLandingClick = () => {
    resetGame();
    onBackToLanding();
  };

  const currentAnimatingCard = animatingCard || testAnimatingCard;

  // Determine winner message
  const getGameOverMessage = () => {
    if (!gameOver || !gameState) return { title: '', message: '' };

    const humanPlayer = gameState.players.find(p => p.isHuman);
    const winner = gameState.players.find(p => p.id === gameOver.winnerId);

    if (!winner) return { title: '', message: '' };

    if (humanPlayer?.id === gameOver.winnerId) {
      return {
        title: 'Congratulations!',
        message: 'You won the game!',
      };
    } else {
      return {
        title: 'Game Over',
        message: `${winner.name} won the game!`,
      };
    }
  };

  const gameOverMessage = getGameOverMessage();

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-uno-purple flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error || !gameState) {
    return (
      <div className="w-screen h-screen bg-uno-purple flex items-center justify-center">
        <div className="text-red-400 text-2xl">{error || 'No game data'}</div>
      </div>
    );
  }

  const humanPlayer = gameState.players.find((p) => p.isHuman);
  const otherPlayers = gameState.players.filter((p) => !p.isHuman);
  const player2 = otherPlayers[0]; // left
  const player3 = otherPlayers[1]; // top
  const player4 = otherPlayers[2]; // right

  if (!humanPlayer) {
    return (
      <div className="w-screen h-screen bg-uno-purple flex items-center justify-center">
        <div className="text-red-400 text-2xl">No human player found</div>
      </div>
    );
  }

  const getHiddenCardIndex = (playerId: string): number | undefined => {
    if (animatingCard && animatingCard.playerId === playerId) {
      return animatingCard.cardIndex;
    }
    return undefined;
  };

  return (
  <div className="w-screen h-screen bg-uno-purple overflow-hidden relative">
    {/* Animation Layer */}
    <AnimationLayer
      animatingCard={animatingCard}
      onAnimationComplete={onAnimationComplete}
    />

    {/* <AnimationLayer
      animatingCard={currentAnimatingCard}
      onAnimationComplete={testAnimatingCard ? handleTestAnimationComplete : onAnimationComplete}
    /> */}

    {/* Game Over Dialog */}
    <GameDialog
      isOpen={gameOver?.isGameOver ?? false}
      title={gameOverMessage.title}
      message={gameOverMessage.message}
      buttons={[
        {
          text: 'Back to Menu',
          onClick: handleBackToLandingClick,
          variant: 'primary',
        },
      ]}
    />

    {/* Color Picker Dialog */}
    <ColorPickerDialog
      isOpen={colorPicker.isOpen}
      onColorSelect={onColorSelect}
      message={colorPicker.isInteractive ? 'Choose a color' : 'Opponent chose a color'}
      isInteractive={colorPicker.isInteractive}
      selectedColor={colorPicker.selectedColor}
    />

    {/* Error Message */}
    {error && (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[150]">
        <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-semibold">{error}</span>
        </div>
      </div>
    )}

    {/* Dev Tool - Animation Test Panel */}
    {import.meta.env.DEV && (
      <AnimationTestPanel
        onTriggerAnimation={handleTestAnimation}
        onTriggerGameOver={handleTestGameOver}
        onTriggerColorPicker={handleTestColorPicker}
      />
    )}

    {/* Player Top*/}
    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-start gap-6">
      <PlayerAvatar
        name={player3.name}
        cardCount={player3.cardCount}
        isCurrentPlayer={gameState.currentPlayerId === player3.id}
      />
      <CardStack
        cardCount={player3.cardCount}
        maxCardsPerRow={15}
        playerPosition='top'
        hiddenCardIndex={getHiddenCardIndex(player3.id)}
      />
    </div>

    {/* Player Right*/}
    <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
      <PlayerAvatar
        name={player4.name}
        cardCount={player4.cardCount}
        isCurrentPlayer={gameState.currentPlayerId === player4.id}
      />
      <CardStack
        cardCount={player4.cardCount}
        overlapOffset={24}
        maxCardsPerRow={15}
        playerPosition='right'
        hiddenCardIndex={getHiddenCardIndex(player4.id)}
      />
    </div>

    {/* Player Left*/}
    <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
      <CardStack
        cardCount={player2.cardCount}
        overlapOffset={24}
        maxCardsPerRow={15}
        playerPosition='left'
        hiddenCardIndex={getHiddenCardIndex(player2.id)}
      />
      <PlayerAvatar
        name={player2.name}
        cardCount={player2.cardCount}
        isCurrentPlayer={gameState.currentPlayerId === player2.id}
      />
    </div>

    {/*Human Player*/}
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex  items-start gap-6">
      <CardStack
        cardCount={humanPlayer.cardCount}
        cards={humanPlayer.cards}
        maxCardsPerRow={15}
        playerPosition='bottom'
        onCardClick={handleCardClick}
        hiddenCardIndex={getHiddenCardIndex(humanPlayer.id)}
      />
      <PlayerAvatar
        name={humanPlayer.name}
        cardCount={humanPlayer.cardCount}
        isCurrentPlayer={gameState.currentPlayerId === humanPlayer.id}
      />
    </div>

    {/*Center Area*/}
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-10">
      {/*Deck*/}
      <div className="flex flex-col items-center gap-2">
        <div
          className="relative cursor-pointer hover:scale-105 transition-transform"
          onClick={handleDeckClick}
          title={gameState?.currentPlayerId === gameState?.players.find(p => p.isHuman)?.id
            ? "Click to draw a card"
            : "Wait for your turn"}
        >
          <div className="absolute top-1 left-1 pointer-events-none">
            <Card card={{ id: "", color: 0, value: 0 }} isFaceDown scale={1.2}/>
          </div>
          <div className="absolute top-2 left-2 pointer-events-none">
            <Card card={{ id: "", color: 0, value: 0 }} isFaceDown scale={1.2}/>
          </div>
            <Card card={{ id: "", color: 0, value: 0 }} isFaceDown scale={1.2}/>
          </div>
      </div>

      {/* Discard pile */}
      <div>
        <Card card={gameState.topCard} scale={1.2}/>
      </div>

      {/*Game Info*/}
      <GameInfo
        direction={gameState.direction}
        currentColor={gameState.currentColor}
        onUnoClick={onUnoCall}
      />
    </div>


  </div>)
}
