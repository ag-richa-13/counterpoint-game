
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
  // Sort players by score (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white/80 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold text-center mb-4 text-gray-800">Score Board</h2>
      
      <div className="space-y-2">
        {sortedPlayers.map((player) => (
          <div 
            key={player.id} 
            className="flex justify-between items-center p-2 rounded bg-white border border-gray-200"
          >
            <div className="font-semibold">{player.name}</div>
            <div className="font-bold text-amber-700">{player.score}</div>
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
