import { Card } from '../game/Card';
import { CardStack } from '../game/CardStack';
import { useState} from 'react';
import { PlayerAvatar } from '../game/PlayerAvatar';
const MOCK_GAME_DATA = {
  gameId: "b9089e75-be0f-4803-bbe9-968a22a3543e",
  gameState: {
    players: [
      {
        id: "e94176b0-d3b0-4143-b903-4dcc482c9134",
        name: "You",
        isHuman: true,
        cardCount: 12,
        cards: [
          { color: 2, value: 5 },
          { color: 0, value: 6 },
          { color: 1, value: 3 },
          { color: 3, value: 11 },
          { color: 2, value: 7 },
          { color: 0, value: 10 },
          { color: 4, value: 13 },
        ],
      },
      {
        id: "f6b34cf5-1b5a-4b3a-b6b7-9c7b58a43432",
        name: "Player 2",
        isHuman: false,
        cardCount: 2,
        cards: [],
      },
      {
        id: "76fe872b-f9c8-4102-b977-04d3a80f6462",
        name: "Player 3",
        isHuman: false,
        cardCount: 12,
        cards: [],
      },
      {
        id: "c9832660-03a4-4e91-9b66-43e69139f376",
        name: "Player 4",
        isHuman: false,
        cardCount: 35,
        cards: [],
      },
    ],
    topCard: { color: 0, value: 12 },
    currentColor: 0,
    currentPlayerId: "e94176b0-d3b0-4143-b903-4dcc482c9134",
    direction: 0,
    deckCardCount: 79,
  },
};

export const GameBoard = () => {
  const [gameState, setGameState] = useState<any>(MOCK_GAME_DATA.gameState);

  const humanPlayer = gameState.players?.find((p: any) => p.isHuman);
  const otherPlayers = gameState.players?.filter((p: any) => !p.isHuman);
  const player3 = otherPlayers[1];
  const player4 = otherPlayers[2];
  const player2 = otherPlayers[0];

  return (
  <div className="w-screen h-screen bg-uno-purple overflow-hidden relative">
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
      />
    </div>

    {/* Player Left*/}
    <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
      <CardStack
        cardCount={player2.cardCount}
        overlapOffset={24}
        maxCardsPerRow={15}
        playerPosition='left'
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
        maxCardsPerRow={15}
        playerPosition='bottom'
      />
      <PlayerAvatar
        name={humanPlayer.name}
        cardCount={humanPlayer.cardCount}
        isCurrentPlayer={gameState.currentPlayerId === humanPlayer.id}
      />
    </div>


  </div>)
}