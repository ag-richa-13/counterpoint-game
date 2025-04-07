
export type Suit = 'hearts' | 'diamonds' | 'spades' | 'clubs' | 'joker';
export type Rank = 'A' | 'K' | 'Q' | 'J' | '10' | '9' | '8' | '7' | '6' | 'joker';

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
  image?: string;
}

export type Player = {
  id: number;
  name: string;
  hand: Card[];
  tricks: Card[][];
  bid: number | null;
  bidCards: Card[];
  score: number;
  cardPoints: number;
};

export type GamePhase = 'setup' | 'dealing' | 'bidding' | 'playing' | 'scoring' | 'gameOver';

export interface GameState {
  deck: Card[];
  players: Player[];
  currentPlayerIndex: number;
  trumpSuit: Suit | null;
  trumpCard: Card | null;
  currentTrick: Card[];
  tricks: number;
  gamePhase: GamePhase;
  winner: number | null;
  trickWinner: number | null;
  message: string;
}

export type GameAction = 
  | { type: 'DEAL_CARDS' }
  | { type: 'MAKE_BID'; playerId: number; bidCards: Card[] }
  | { type: 'PLAY_CARD'; playerId: number; card: Card }
  | { type: 'END_TRICK' }
  | { type: 'CALCULATE_SCORES' }
  | { type: 'START_NEW_ROUND' }
  | { type: 'START_NEW_GAME' }
  | { type: 'SET_MESSAGE'; message: string }
  | { type: 'SET_NAMES'; names: string[] }
  | { type: 'AI_MOVE' };

