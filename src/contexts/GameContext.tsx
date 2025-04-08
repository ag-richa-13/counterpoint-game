
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, GameAction, Card, Player } from '@/types/game';
import {
  initializeGameState,
  dealCards,
  calculateBidValue,
  canPlayCard,
  determineTrickWinner,
  calculateScores,
  createDeck
} from '@/utils/gameUtils';
import { toast } from '@/components/ui/use-toast';

// Initialize context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  playCard: (playerId: number, card: Card) => void;
  makeBid: (playerId: number, bidCards: Card[]) => void;
  startNewGame: () => void;
  setPlayerNames: (names: string[]) => void;
} | undefined>(undefined);

// Game reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'DEAL_CARDS': {
      // Create a fresh deck for each new round
      const freshDeck = createDeck();
      const { playerHands, remainingDeck } = dealCards(freshDeck, 3, 12);
      
      // Get trump card (last card in deck)
      const trumpCard = remainingDeck.length > 0 ? remainingDeck[0] : null;
      let trumpSuit = trumpCard?.suit || null;
      
      // If trump card is a Nine or the Joker, no trump
      if (trumpCard && (trumpCard.rank === '9' || trumpCard.suit === 'joker')) {
        trumpSuit = null;
      }
      
      const updatedPlayers = state.players.map((player, index) => ({
        ...player,
        hand: playerHands[index],
        tricks: [],
        bid: null,
        bidCards: [],
        cardPoints: 0
      }));
      
      return {
        ...state,
        deck: remainingDeck,
        players: updatedPlayers,
        currentPlayerIndex: 0,
        trumpSuit,
        trumpCard,
        currentTrick: [],
        tricks: 0,
        gamePhase: 'bidding',
        message: 'Select 3 cards to make your bid.'
      };
    }

    case 'MAKE_BID': {
      if (state.gamePhase !== 'bidding') return state;
      
      const { playerId, bidCards } = action;
      if (bidCards.length !== 3) return state;
      
      const bidValue = calculateBidValue(bidCards);
      
      const updatedPlayers = state.players.map(player => {
        if (player.id === playerId) {
          // Remove bid cards from hand and add to bidCards
          const updatedHand = player.hand.filter(card => 
            !bidCards.some(bidCard => bidCard.id === card.id)
          );
          
          return {
            ...player,
            hand: updatedHand,
            bid: bidValue,
            bidCards
          };
        }
        return player;
      });
      
      // Check if all players have bid
      const allBid = updatedPlayers.every(player => player.bid !== null);
      
      return {
        ...state,
        players: updatedPlayers,
        currentPlayerIndex: (state.currentPlayerIndex + 1) % 3,
        gamePhase: allBid ? 'playing' : 'bidding',
        message: allBid ? `${updatedPlayers[0].name} leads the first trick.` : 'Select 3 cards to make your bid.'
      };
    }

    case 'PLAY_CARD': {
      if (state.gamePhase !== 'playing') return state;
      
      const { playerId, card } = action;
      if (playerId !== state.currentPlayerIndex) return state;
      
      const currentPlayer = state.players[playerId];
      
      // Check if card can be played
      if (!canPlayCard(card, currentPlayer.hand, state.currentTrick, state.trumpSuit)) {
        return {
          ...state,
          message: 'You must follow suit if possible!'
        };
      }
      
      // Remove card from hand and add to current trick
      const updatedPlayers = [...state.players];
      updatedPlayers[playerId] = {
        ...currentPlayer,
        hand: currentPlayer.hand.filter(c => c.id !== card.id)
      };
      
      const updatedTrick = [...state.currentTrick, card];
      
      // If all players have played a card, determine the winner
      if (updatedTrick.length === 3) {
        const trickStarterIndex = (state.currentPlayerIndex - (updatedTrick.length - 1) + 3) % 3;
        const winnerIndex = determineTrickWinner(updatedTrick, state.trumpSuit, trickStarterIndex);
        
        // Add trick to winner's tricks
        updatedPlayers[winnerIndex] = {
          ...updatedPlayers[winnerIndex],
          tricks: [...updatedPlayers[winnerIndex].tricks, updatedTrick],
          cardPoints: updatedPlayers[winnerIndex].cardPoints + updatedTrick.reduce((sum, c) => sum + c.value, 0)
        };
        
        // Check if this was the last trick
        const isLastTrick = updatedPlayers.every(player => player.hand.length === 0);
        
        return {
          ...state,
          players: updatedPlayers,
          currentPlayerIndex: winnerIndex,
          currentTrick: [],
          tricks: state.tricks + 1,
          trickWinner: winnerIndex,
          gamePhase: isLastTrick ? 'scoring' : 'playing',
          message: isLastTrick 
            ? 'Round complete! Calculating scores...' 
            : `${updatedPlayers[winnerIndex].name} wins the trick and leads next.`
        };
      } else {
        // Move to next player
        return {
          ...state,
          players: updatedPlayers,
          currentTrick: updatedTrick,
          currentPlayerIndex: (state.currentPlayerIndex + 1) % 3,
          message: `${updatedPlayers[(state.currentPlayerIndex + 1) % 3].name}'s turn.`
        };
      }
    }

    case 'CALCULATE_SCORES': {
      const newScores = calculateScores(state.players);
      
      const updatedPlayers = state.players.map((player, index) => ({
        ...player,
        score: player.score + newScores[index]
      }));
      
      // Find player with highest score
      let highestScore = -1;
      let winnerId = -1;
      
      updatedPlayers.forEach(player => {
        if (player.score > highestScore) {
          highestScore = player.score;
          winnerId = player.id;
        }
      });
      
      return {
        ...state,
        players: updatedPlayers,
        gamePhase: 'gameOver',
        winner: winnerId,
        message: `${updatedPlayers[winnerId].name} wins with ${highestScore} points!`
      };
    }

    case 'START_NEW_ROUND':
      return {
        ...state,
        deck: createDeck(), // Create a fresh deck
        gamePhase: 'dealing',
        currentTrick: [],
        tricks: 0,
        trumpCard: null,
        trumpSuit: null,
        trickWinner: null,
        message: 'Dealing cards for a new round...'
      };

    case 'START_NEW_GAME': {
      const currentNames = state.players.map(p => p.name);
      const newState = initializeGameState();
      return {
        ...newState,
        players: newState.players.map((player, index) => ({
          ...player,
          name: currentNames[index] || player.name
        }))
      };
    }

    case 'SET_NAMES':
      return {
        ...state,
        players: state.players.map((player, index) => ({
          ...player,
          name: action.names[index] || `Player ${index + 1}`
        }))
      };

    case 'AI_MOVE':
      return state;

    default:
      return state;
  }
};

// Provider component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initializeGameState());

  // Helper function to play a card
  const playCard = (playerId: number, card: Card) => {
    if (state.gamePhase !== 'playing') {
      toast({
        title: "Can't play card",
        description: "It's not the playing phase yet!",
        variant: "destructive"
      });
      return;
    }
    
    if (playerId !== state.currentPlayerIndex) {
      toast({
        title: "Not your turn",
        description: `It's ${state.players[state.currentPlayerIndex].name}'s turn.`,
        variant: "destructive"
      });
      return;
    }
    
    const player = state.players[playerId];
    if (!canPlayCard(card, player.hand, state.currentTrick, state.trumpSuit)) {
      toast({
        title: "Invalid move",
        description: "You must follow suit if possible!",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'PLAY_CARD', playerId, card });
  };

  // Helper function to make a bid
  const makeBid = (playerId: number, bidCards: Card[]) => {
    if (state.gamePhase !== 'bidding') {
      toast({
        title: "Can't bid now",
        description: "The bidding phase is over!",
        variant: "destructive"
      });
      return;
    }
    
    if (playerId !== state.currentPlayerIndex) {
      toast({
        title: "Not your turn",
        description: `It's ${state.players[state.currentPlayerIndex].name}'s turn to bid.`,
        variant: "destructive"
      });
      return;
    }
    
    if (bidCards.length !== 3) {
      toast({
        title: "Invalid bid",
        description: "You must select exactly 3 cards for your bid.",
        variant: "destructive"
      });
      return;
    }
    
    dispatch({ type: 'MAKE_BID', playerId, bidCards });
  };

  // Start a new game
  const startNewGame = () => {
    dispatch({ type: 'START_NEW_GAME' });
    setTimeout(() => dispatch({ type: 'DEAL_CARDS' }), 500);
  };

  // Set player names
  const setPlayerNames = (names: string[]) => {
    dispatch({ type: 'SET_NAMES', names });
  };

  // Removed all AI automation effects

  return (
    <GameContext.Provider value={{ state, dispatch, playCard, makeBid, startNewGame, setPlayerNames }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
