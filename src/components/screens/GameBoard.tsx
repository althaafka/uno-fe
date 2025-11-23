import { Card } from '../game/Card';

export const GameBoard = () => {
  return <div className="w-screen h-screen bg-gradient-to-br from-uno-purple to-purple-800 overflow-hidden relative">
    <Card card={{color: 0, value: 0}} isFaceDown />
    <Card card={{color: 0, value: 9}} />
    <Card card={{color: 1, value: 10}} />
    <Card card={{color: 2, value: 11}} />
    <Card card={{color: 3, value: 12}} />
    <Card card={{color: 4, value: 13}} />
    <Card card={{color: 4, value: 14}} />
    <Card card={{color: 4, value: 14}} />
    <Card card={{color: 4, value: 14}} rotate={15} />
<Card card={{color: 4, value: 14}} rotate={-90} />
<Card card={{color: 4, value: 14}} rotate={45} scale={1.2} />

  </div>
}