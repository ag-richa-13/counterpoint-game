
import React from 'react';
import { Card as CardType, Suit, GamePhase } from '@/types/game';
import Card from './Card';
import { Button } from '@/components/ui/button';
import { getSuitSymbol, getSuitColor } from '@/utils/gameUtils';
import { ChevronRight } from 'lucide-react';

interface GameTableProps {
  currentTrick: CardType[];
  trumpCard: CardType | null;
  trumpSuit: Suit | null;
  gamePhase: GamePhase;
  message: string;
  onStartGame: () => void;
  onConfirmBid: () => void;
  bidValue: number;
  canConfirmBid: boolean;
}

const GameTable: React.FC<GameTableProps> = ({
  currentTrick,
  trumpCard,
  trumpSuit,
  gamePhase,
  message,
  onStartGame,
  onConfirmBid,
  bidValue,
  canConfirmBid
}) => {
  return (
    <div className="bg-tableGreen rounded-3xl p-6 shadow-xl border-4 border-woodBrown flex flex-col items-center">
      <div className="text-white text-xl font-semibold mb-4 bg-black/20 p-3 rounded-lg w-full text-center">
        {message}
      </div>

      {gamePhase === 'setup' && (
        <Button 
          onClick={onStartGame}
          className="bg-goldAccent hover:bg-amber-500 text-black font-bold mt-4"
        >
          Start Game
        </Button>
      )}

      {gamePhase === 'bidding' && (
        <div className="flex flex-col items-center bg-black/10 p-4 rounded-lg w-full">
          <div className="mb-4 text-white">
            Your bid: <span className="font-bold text-goldAccent text-2xl">{bidValue}</span> points
          </div>
          <Button 
            onClick={onConfirmBid}
            disabled={!canConfirmBid}
            className="bg-goldAccent hover:bg-amber-500 text-black font-bold disabled:bg-gray-400 flex items-center gap-2"
          >
            Confirm Bid <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Trump Card Display */}
      {trumpCard && (
        <div className="mt-4 bg-black/10 p-4 rounded-lg flex flex-col items-center">
          <div className="text-white text-sm mb-2">Trump Card:</div>
          <Card card={trumpCard} playable={false} />
          {trumpSuit && (
            <div className={`mt-2 text-center font-bold text-xl ${getSuitColor(trumpSuit)}`}>
              {getSuitSymbol(trumpSuit)} {trumpSuit.charAt(0).toUpperCase() + trumpSuit.slice(1)}
            </div>
          )}
          {!trumpSuit && (
            <div className="mt-2 text-center font-bold text-white">
              No Trump
            </div>
          )}
        </div>
      )}

      {/* Current Trick Display */}
      {currentTrick.length > 0 && (
        <div className="mt-8 mb-4 w-full">
          <div className="text-white text-sm mb-2 text-center">Current Trick:</div>
          <div className="flex justify-center items-center gap-6 min-h-40 relative">
            {currentTrick.map((card, index) => (
              <div 
                key={index} 
                className="animate-deal-card" 
                style={{
                  animationDelay: `${index * 0.2}s`,
                  position: 'relative',
                  zIndex: index
                }}
              >
                <Card card={card} playable={false} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameTable;
