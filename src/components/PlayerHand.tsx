
import React from 'react';
import { Player as PlayerType, Card as CardType, GamePhase } from '@/types/game';
import Card from './Card';
import { cn } from '@/lib/utils';
import { canPlayCard } from '@/utils/gameUtils';

interface PlayerHandProps {
  player: PlayerType;
  isCurrentPlayer: boolean;
  isHumanPlayer: boolean;
  onCardClick: (card: CardType) => void;
  gamePhase: GamePhase;
  trumpSuit: string | null;
  currentTrick: CardType[];
  selectedCards?: CardType[];
  onCardSelect?: (card: CardType) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({
  player,
  isCurrentPlayer,
  isHumanPlayer,
  onCardClick,
  gamePhase,
  trumpSuit,
  currentTrick,
  selectedCards = [],
  onCardSelect
}) => {
  // Sort cards by suit and rank
  const sortedHand = [...player.hand].sort((a, b) => {
    // Sort by suit first
    const suitOrder = { 'hearts': 0, 'diamonds': 1, 'spades': 2, 'clubs': 3, 'joker': 4 };
    const suitComparison = suitOrder[a.suit] - suitOrder[b.suit];
    if (suitComparison !== 0) return suitComparison;
    
    // Then sort by rank
    const rankOrder = { 'A': 0, 'K': 1, 'Q': 2, 'J': 3, '10': 4, '9': 5, '8': 6, '7': 7, '6': 8, 'joker': 9 };
    return rankOrder[a.rank] - rankOrder[b.rank];
  });

  const isCardSelected = (card: CardType) => {
    return selectedCards.some(selectedCard => selectedCard.id === card.id);
  };

  const isCardPlayable = (card: CardType) => {
    if (gamePhase !== 'playing') return false;
    if (!isCurrentPlayer) return false;
    return canPlayCard(card, player.hand, currentTrick, trumpSuit as any);
  };

  const handleCardClick = (card: CardType) => {
    if (gamePhase === 'bidding' && isCurrentPlayer && onCardSelect) {
      onCardSelect(card);
    } else if (gamePhase === 'playing' && isCurrentPlayer) {
      onCardClick(card);
    }
  };

  // Calculate overlap based on number of cards
  const getCardOffset = (index: number, total: number) => {
    // Adjust the maximum width to prevent cards from extending outside
    const maxWidth = isCurrentPlayer ? 70 : 80; // Reduced from 80/90 to 70/80
    const cardWidthPercentage = total > 1 ? maxWidth / (total - 1) : 0;
    return `${index * cardWidthPercentage}%`;
  };

  return (
    <div className={cn(
      "relative p-4 rounded-lg transition-all duration-300 overflow-hidden",
      isCurrentPlayer ? "bg-amber-100/70 shadow-lg border-2 border-goldAccent" : "bg-white/40",
      isCurrentPlayer && "shadow-[0_0_15px_rgba(245,158,11,0.3)]"
    )}>
      <div className="mb-2 flex justify-between items-center">
        <h3 className={cn(
          "font-bold",
          isCurrentPlayer ? "text-amber-800" : "text-gray-700"
        )}>
          {player.name}
          {player.bid !== null && gamePhase !== 'bidding' && (
            <span className="ml-2 text-sm font-normal text-gray-600">
              (Bid: {player.bid})
            </span>
          )}
        </h3>
        {gamePhase === 'gameOver' && (
          <div className="text-sm font-semibold">
            Score: {player.score} | Card Points: {player.cardPoints}
          </div>
        )}
      </div>
      
      {isCurrentPlayer ? (
        <div className="bg-tableGreen/10 rounded-lg p-2 w-full h-[180px] flex items-center justify-center overflow-hidden"> {/* Increased height more */}
          <div className="relative w-full h-[140px] mt-10"> {/* Increased margin-top */}
            {sortedHand.map((card, index) => (
              <div
                key={card.id}
                className="absolute transition-all duration-200"
                style={{
                  left: getCardOffset(index, sortedHand.length),
                  zIndex: index,
                  transform: isCardSelected(card) ? 'translateY(-16px)' : 'none'
                }}
              >
                <Card
                  card={card}
                  onClick={() => handleCardClick(card)}
                  selected={isCardSelected(card)}
                  faceDown={false}
                  playable={isCurrentPlayer && (gamePhase === 'bidding' || isCardPlayable(card))}
                  small={true}  // Always keep cards small to maintain consistent size
                  className={isCurrentPlayer ? "hover:shadow-xl transition-all duration-200" : ""}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="relative h-[90px] flex items-center justify-center overflow-hidden"> {/* Fixed height */}
          <div className="relative w-full h-[80px]"> {/* Fixed height */}
            {sortedHand.map((card, index) => (
              <div
                key={card.id}
                className="absolute"
                style={{
                  left: getCardOffset(index, sortedHand.length),
                  zIndex: index,
                }}
              >
                <Card
                  key={card.id}
                  card={card}
                  faceDown={true}
                  small={true}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {player.tricks.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm text-gray-600 mb-1">
            Tricks Won: {player.tricks.length}
          </h4>
          <div className="flex flex-wrap gap-1 overflow-x-auto">
            {player.tricks.map((trick, i) => (
              <div key={i} className="flex">
                {trick.slice(0, 1).map((card, j) => (
                  <Card key={`${i}-${j}`} card={card} small />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerHand;
