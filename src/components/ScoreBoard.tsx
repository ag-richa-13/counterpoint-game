
import React from 'react';
import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';  // Add this import

interface ScoreBoardProps {
  players: Player[];
  gamePhase: string;
  onStartNewRound: () => void;
  onStartNewGame: () => void;
}

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  players,
  gamePhase,
  onStartNewRound,
  onStartNewGame
}) => {
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white/90 rounded-xl shadow-xl p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-center mb-6 text-gray-800">Score Board</h2>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className={cn(
              "flex justify-between items-center p-3 rounded-lg border-2 transition-all hover:shadow-md",
              index === 0 ? "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200" : "bg-white border-gray-200"
            )}
          >
            <div className="font-semibold">{player.name}</div>
            <div className={cn(
              "font-bold text-lg",
              index === 0 ? "text-amber-600" : "text-gray-700"
            )}>
              {player.score}
            </div>
          </div>
        ))}
      </div>
      
      {(gamePhase === 'scoring' || gamePhase === 'gameOver') && (
        <div className="mt-6 space-y-3">
          <Button 
            onClick={onStartNewRound}
            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg transform hover:scale-105 transition-all"
          >
            Start New Round
          </Button>
          <Button 
            onClick={onStartNewGame}
            variant="outline"
            className="w-full border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 transform hover:scale-105 transition-all"
          >
            Start New Game
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScoreBoard;
