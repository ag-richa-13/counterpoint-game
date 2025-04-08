
import React from 'react';
import { Player } from '@/types/game';
import { Button } from '@/components/ui/button';

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
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white/80 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold text-center mb-4 text-gray-800">Score Board</h2>
      
      <div className="space-y-3">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id} 
            className={`flex justify-between items-center p-3 rounded-lg 
              ${index === 0 ? 'bg-amber-50 border-2 border-amber-400' : 'bg-white border border-gray-200'}
              transform transition-all duration-200 hover:scale-102 hover:shadow-md`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 flex items-center justify-center rounded-full 
                ${index === 0 ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {index + 1}
              </span>
              <div className="font-semibold text-gray-800">{player.name}</div>
            </div>
            <div className={`font-bold text-lg ${index === 0 ? 'text-amber-600' : 'text-gray-700'}`}>
              {player.score}
            </div>
          </div>
        ))}
      </div>
      
      {gamePhase === 'scoring' || gamePhase === 'gameOver' ? (
        <div className="mt-4 space-y-2">
          <Button 
            onClick={onStartNewRound}
            className="w-full bg-tableGreen hover:bg-green-700"
          >
            Start New Round
          </Button>
          <Button 
            onClick={onStartNewGame}
            variant="outline"
            className="w-full border-tableGreen text-tableGreen hover:bg-tableGreen hover:text-white"
          >
            Start New Game
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default ScoreBoard;
