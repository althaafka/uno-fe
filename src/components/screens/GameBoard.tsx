import { Card } from '../game/Card';
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
        cardCount: 7,
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
        cardCount: 52,
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
    const [gameState, setGameState] = useState<any>(null);
    
  return <div className="w-screen h-screen bg-uno-purple overflow-hidden relative">
    {/* <Card card={{color: 0, value: 0}} isFaceDown /> */}
    {/* <Card card={{color: 0, value: 9}} /> */}
    <Card card={{color: 4, value: 14}} />
    <Card card={{color: 4, value: 14}} rotate={15} />
<Card card={{color: 4, value: 14}} rotate={-90} />
<Card card={{color: 4, value: 14}} rotate={45} scale={1.2} />
    <PlayerAvatar name="Player 1" cardCount={7}/>
    <PlayerAvatar name="Player 1" cardCount={32} isCurrentPlayer/>


  </div>
}