
import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import PlayerHand from '@/components/PlayerHand';
import GameTable from '@/components/GameTable';
import ScoreBoard from '@/components/ScoreBoard';
import GameRules from '@/components/GameRules';
import { Card as CardType } from '@/types/game';
import { calculateBidValue } from '@/utils/gameUtils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const GameUI = () => {
  const { state, dispatch, playCard, makeBid, startNewGame, setPlayerNames } = useGame();
  const [selectedBidCards, setSelectedBidCards] = useState<CardType[]>([]);
  const [showNameDialog, setShowNameDialog] = useState(true);
  const [playerNames, setPlayerNameInputs] = useState(['Player 1', 'Player 2', 'Player 3']);
  
  const currentBidValue = calculateBidValue(selectedBidCards);
  
  const handleCardSelect = (card: CardType) => {
    if (selectedBidCards.some(c => c.id === card.id)) {
      setSelectedBidCards(selectedBidCards.filter(c => c.id !== card.id));
    } else {
      if (selectedBidCards.length < 3) {
        setSelectedBidCards([...selectedBidCards, card]);
      } else {
        toast({
          title: "Can't select more cards",
          description: "You can only select 3 cards for your bid.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleConfirmBid = () => {
    if (selectedBidCards.length === 3) {
      makeBid(state.currentPlayerIndex, selectedBidCards);
      setSelectedBidCards([]);
    } else {
      toast({
        title: "Invalid bid",
        description: "You must select exactly 3 cards for your bid.",
        variant: "destructive"
      });
    }
  };
  
  const handleCardPlay = (card: CardType) => {
    playCard(state.currentPlayerIndex, card);
  };
  
  const handleStartNewRound = () => {
    dispatch({ type: 'START_NEW_ROUND' });
    setTimeout(() => dispatch({ type: 'DEAL_CARDS' }), 500);
  };
  
  const handleSubmitNames = () => {
    setPlayerNames(playerNames);
    setShowNameDialog(false);
    startNewGame();
  };
  
  useEffect(() => {
    if (state.gamePhase === 'scoring') {
      setTimeout(() => {
        dispatch({ type: 'CALCULATE_SCORES' });
      }, 1500);
    }
  }, [state.gamePhase, dispatch]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 bg-woodBrown/10 p-4 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-woodBrown">Counterpoint</h1>
          <div className="flex gap-2">
            <GameRules />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white/50 p-2 rounded-xl shadow">
              <PlayerHand
                player={state.players[state.currentPlayerIndex]}
                isCurrentPlayer={true}
                isHumanPlayer={true}
                onCardClick={handleCardPlay}
                gamePhase={state.gamePhase}
                trumpSuit={state.trumpSuit}
                currentTrick={state.currentTrick}
                selectedCards={state.gamePhase === 'bidding' ? selectedBidCards : []}
                onCardSelect={state.gamePhase === 'bidding' ? handleCardSelect : undefined}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.players
                .filter((_p, i) => i !== state.currentPlayerIndex)
                .map((player, idx) => (
                  <div key={player.id} className="bg-white/30 p-2 rounded-xl shadow">
                    <PlayerHand
                      player={player}
                      isCurrentPlayer={false}
                      isHumanPlayer={true}
                      onCardClick={handleCardPlay}
                      gamePhase={state.gamePhase}
                      trumpSuit={state.trumpSuit}
                      currentTrick={state.currentTrick}
                      selectedCards={[]}
                    />
                  </div>
                ))}
            </div>
          </div>
          
          <div className="space-y-6">
            <GameTable
              currentTrick={state.currentTrick}
              trumpCard={state.trumpCard}
              trumpSuit={state.trumpSuit}
              gamePhase={state.gamePhase}
              message={state.message}
              onStartGame={startNewGame}
              onConfirmBid={handleConfirmBid}
              bidValue={currentBidValue}
              canConfirmBid={selectedBidCards.length === 3}
            />
            
            <ScoreBoard
              players={state.players}
              gamePhase={state.gamePhase}
              onStartNewRound={handleStartNewRound}
              onStartNewGame={startNewGame}
            />
          </div>
        </div>
      </div>
      
      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent className="bg-amber-50 border-2 border-woodBrown">
          <DialogHeader>
            <DialogTitle className="text-2xl text-woodBrown">Welcome to Counterpoint!</DialogTitle>
            <DialogDescription className="text-amber-900">
              Enter the player names to get started.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {playerNames.map((name, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-20 text-amber-900">Player {index + 1}:</span>
                <Input 
                  value={name}
                  onChange={(e) => {
                    const newNames = [...playerNames];
                    newNames[index] = e.target.value;
                    setPlayerNameInputs(newNames);
                  }}
                  placeholder={`Player ${index + 1}`}
                  className="border-amber-300 focus:border-goldAccent"
                />
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={handleSubmitNames}
              className="bg-goldAccent hover:bg-amber-500 text-black font-bold"
            >
              Start Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameUI />
    </GameProvider>
  );
};

export default Index;
