import { Card } from '../game/Card';
import { CardStack } from '../game/CardStack';
import { PlayerAvatar } from '../game/PlayerAvatar';
import { GameInfo } from '../game/GameInfo';
import { AnimationLayer } from '../game/AnimationLayer';
import { useGame } from '../../context/GameContext';

export const GameBoard = () => {
  const { gameState, isLoading, error, playCard, isAnimating, animatingCard, onAnimationComplete } = useGame();

  const handleCardClick = async (cardId: string) => {
    if (isAnimating) return;

    try {
      await playCard(cardId);
    } catch (err) {
      console.error('Failed to play card:', err);
    }
  };

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
          className="relative cursor-pointer"
        >
          <div className="absolute top-1 left-1">
            <Card card={{ id: "", color: 0, value: 0 }} isFaceDown scale={1.2}/>
          </div>
          <div className="absolute top-2 left-2">
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
        onUnoClick={() => {}}
      />
    </div>


  </div>)
}
