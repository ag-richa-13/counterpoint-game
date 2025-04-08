
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
    <div className="bg-gradient-to-br from-emerald-800 to-emerald-900 rounded-3xl p-8 shadow-2xl border-8 border-woodBrown flex flex-col items-center">
      <div className="text-white text-xl font-semibold mb-6 bg-black/30 p-4 rounded-xl w-full text-center backdrop-blur-sm">
        {message}
      </div>

      {gamePhase === 'setup' && (
        <Button 
          onClick={onStartGame}
          className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold mt-4 shadow-lg transform hover:scale-105 transition-all"
        >
          Start Game
        </Button>
      )}

      {gamePhase === 'bidding' && (
        <div className="flex flex-col items-center bg-black/20 p-6 rounded-xl w-full backdrop-blur-sm">
          <div className="mb-4 text-white text-lg">
            Your bid: <span className="font-bold text-amber-400 text-3xl">{bidValue}</span> points
          </div>
          <Button 
            onClick={onConfirmBid}
            disabled={!canConfirmBid}
            className="bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-black font-bold disabled:bg-gray-400 flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all"
          >
            Confirm Bid <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Trump Card Display */}
      {trumpCard && (
        <div className="mt-6 bg-black/20 p-6 rounded-xl flex flex-col items-center backdrop-blur-sm">
          <div className="text-white text-sm mb-3">Trump Card:</div>
          <div className="transform hover:scale-105 transition-all">
            <Card card={trumpCard} playable={false} />
          </div>
          {trumpSuit && (
            <div className={`mt-3 text-center font-bold text-2xl ${getSuitColor(trumpSuit)}`}>
              {getSuitSymbol(trumpSuit)} {trumpSuit.charAt(0).toUpperCase() + trumpSuit.slice(1)}
            </div>
          )}
          {!trumpSuit && (
            <div className="mt-3 text-center font-bold text-2xl text-white">
              No Trump
            </div>
          )}
        </div>
      )}

      {/* Current Trick Display */}
      {currentTrick.length > 0 && (
        <div className="mt-8 mb-4 w-full">
          <div className="text-white text-sm mb-3 text-center">Current Trick:</div>
          <div className="flex justify-center items-center gap-4 h-32">
            {currentTrick.map((card, index) => (
              <div 
                key={index} 
                className="animate-deal-card transform hover:scale-105 transition-all" 
                style={{
                  animationDelay: `${index * 0.2}s`
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
