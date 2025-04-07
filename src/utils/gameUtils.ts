
import { Card, Suit, Rank, Player, GameState } from '@/types/game';

// Create a deck of cards with the proper point values
export const createDeck = (): Card[] => {
  const suits: Suit[] = ['hearts', 'diamonds', 'spades', 'clubs'];
  const ranks: Rank[] = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6'];
  
  const cards: Card[] = [];
  
  // Create cards for each suit and rank
  suits.forEach(suit => {
    ranks.forEach(rank => {
      let value = 0;
      
      // Assign point values based on the rank
      switch(rank) {
        case 'A': value = 11; break;
        case '10': value = 10; break;
        case 'K': value = 4; break;
        case 'Q': value = 3; break;
        case 'J': value = 2; break;
        default: value = 0;
      }
      
      cards.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value
      });
    });
  });
  
  // Add joker
  cards.push({
    id: 'joker',
    suit: 'joker',
    rank: 'joker',
    value: 0
  });
  
  return cards;
};

// Shuffle an array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Deal cards to players
export const dealCards = (deck: Card[], numPlayers: number, cardsPerPlayer: number): { playerHands: Card[][], remainingDeck: Card[] } => {
  const shuffledDeck = shuffleArray(deck);
  const playerHands: Card[][] = Array(numPlayers).fill([]).map(() => []);
  
  // Deal cards one at a time to each player
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (shuffledDeck.length > 0) {
        const card = shuffledDeck.shift()!;
        playerHands[j] = [...playerHands[j], card];
      }
    }
  }
  
  return { playerHands, remainingDeck: shuffledDeck };
};

// Calculate the bid value based on the bid cards
export const calculateBidValue = (bidCards: Card[]): number => {
  return bidCards.reduce((total, card) => {
    switch(card.suit) {
      case 'diamonds': return total + 0;
      case 'spades': return total + 10;
      case 'hearts': return total + 20;
      case 'clubs': return total + 30;
      default: return total;
    }
  }, 0);
};

// Determine if a card can be played
export const canPlayCard = (card: Card, hand: Card[], currentTrick: Card[], trumpSuit: Suit | null): boolean => {
  // If this is the first card in the trick, any card can be played
  if (currentTrick.length === 0) {
    return true;
  }
  
  const leadSuit = currentTrick[0].suit;
  
  // Check if player has any cards of the lead suit
  const hasSuit = hand.some(c => c.suit === leadSuit);
  
  // If player has the lead suit, they must play it
  if (hasSuit) {
    return card.suit === leadSuit;
  }
  
  // If player doesn't have the lead suit, they can play any card
  return true;
};

// Determine the winner of a trick
export const determineTrickWinner = (trick: Card[], trumpSuit: Suit | null, leadPlayerIndex: number): number => {
  if (trick.length === 0) return leadPlayerIndex;
  
  const leadCard = trick[0];
  let winningCard = leadCard;
  let winnerOffset = 0;
  
  trick.forEach((card, index) => {
    // If this card is a trump and the winning card is not, this card wins
    if (trumpSuit && card.suit === trumpSuit && winningCard.suit !== trumpSuit) {
      winningCard = card;
      winnerOffset = index;
    }
    // If both cards are trumps, higher rank wins
    else if (trumpSuit && card.suit === trumpSuit && winningCard.suit === trumpSuit) {
      if (getCardRankValue(card) > getCardRankValue(winningCard)) {
        winningCard = card;
        winnerOffset = index;
      }
    }
    // If both cards are the same suit, higher rank wins
    else if (card.suit === leadCard.suit) {
      if (getCardRankValue(card) > getCardRankValue(winningCard)) {
        winningCard = card;
        winnerOffset = index;
      }
    }
    // If this card is not a trump and not the lead suit, it can't win
  });
  
  return (leadPlayerIndex + winnerOffset) % 3;
};

// Helper to convert card rank to numeric value for comparison
export const getCardRankValue = (card: Card): number => {
  switch (card.rank) {
    case 'A': return 14;
    case 'K': return 13;
    case 'Q': return 12;
    case 'J': return 11;
    case '10': return 10;
    case '9': return 9;
    case '8': return 8;
    case '7': return 7;
    case '6': return 6;
    case 'joker': return 15; // Joker is highest
    default: return 0;
  }
};

// Calculate scores at the end of a round
export const calculateScores = (players: Player[]): number[] => {
  const scores: number[] = Array(players.length).fill(0);
  
  // Calculate the difference between bid and actual card points for each player
  const differences = players.map(player => {
    return Math.abs((player.bid || 0) - player.cardPoints);
  });
  
  // Each player scores the sum of their opponents' differences
  players.forEach((player, index) => {
    // Sum of opponents' differences
    const opponentIndices = Array.from({ length: players.length }, (_, i) => i).filter(i => i !== index);
    const opponentDifferenceSum = opponentIndices.reduce((sum, i) => sum + differences[i], 0);
    
    // Bonus for accuracy
    let bonus = 0;
    const diff = differences[index];
    
    if (diff === 0) {
      bonus = 30; // Exact bid
    } else if (diff <= 2) {
      bonus = 20; // Within 1-2 points
    } else if (diff <= 5) {
      bonus = 10; // Within 3-5 points
    }
    
    scores[index] = opponentDifferenceSum + bonus;
  });
  
  return scores;
};

// Initialize a new game state
export const initializeGameState = (): GameState => {
  const deck = createDeck();
  const players: Player[] = [
    { id: 0, name: 'Player 1', hand: [], tricks: [], bid: null, bidCards: [], score: 0, cardPoints: 0 },
    { id: 1, name: 'Player 2', hand: [], tricks: [], bid: null, bidCards: [], score: 0, cardPoints: 0 },
    { id: 2, name: 'Player 3', hand: [], tricks: [], bid: null, bidCards: [], score: 0, cardPoints: 0 }
  ];
  
  return {
    deck,
    players,
    currentPlayerIndex: 0,
    trumpSuit: null,
    trumpCard: null,
    currentTrick: [],
    tricks: 0,
    gamePhase: 'setup',
    winner: null,
    trickWinner: null,
    message: 'Welcome to Counterpoint! Press "Start Game" to begin.'
  };
};

export const getSuitSymbol = (suit: Suit): string => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'spades': return '♠';
    case 'clubs': return '♣';
    case 'joker': return '★';
    default: return '';
  }
};

export const getSuitColor = (suit: Suit): string => {
  switch (suit) {
    case 'hearts':
    case 'diamonds':
      return 'text-cardRed';
    case 'spades':
    case 'clubs':
    case 'joker':
      return 'text-cardBlack';
    default:
      return '';
  }
};
