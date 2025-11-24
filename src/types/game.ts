export type CardColor = 0 | 1 | 2 | 3 | 4; // 4=Wild
export type CardValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
// 0-9 numbers, 10=Skip, 11=Reverse, 12=Draw Two, 13=Wild, 14=Wild Draw Four

export interface Card {
  color: CardColor;
  value: CardValue;
}

export type GameDirection = 0 | 1; // 0=clockwise, 1=counter-clockwise
