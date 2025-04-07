import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const GameRules = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-100 ml-4 mt-2" // Added margin-left and margin-top
        >
          How to Play
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Counterpoint - Game Rules</SheetTitle>
          <SheetDescription>
            A card game created by David Parlett
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-120px)] mt-4 pr-4">
          <div className="space-y-4 text-left">
            <section>
              <h3 className="font-bold text-lg">The Deck</h3>
              <p>
                37 cards, consisting of A-10-K-Q-J-9-8-7-6 in each suit, plus a
                Joker.
              </p>
              <p className="mt-2">Card point values:</p>
              <ul className="list-disc list-inside">
                <li>Ace: 11 points</li>
                <li>Ten: 10 points</li>
                <li>King: 4 points</li>
                <li>Queen: 3 points</li>
                <li>Jack: 2 points</li>
                <li>Nine, Eight, Seven, Six: 0 points</li>
              </ul>
              <p className="mt-2">
                This makes 30 card-points in each suit and 120 in the whole
                pack.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg">Dealing</h3>
              <p>
                Each player receives 12 cards. The last card is turned face up
                to establish the trump suit.
              </p>
              <p>
                If it is a Nine or the Joker, the deal is played with no trump.
              </p>
              <p>
                The Joker has no independent value but is treated as if it were
                the turn-up card.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg">Bidding</h3>
              <p>
                Players discard 3 bid-cards face down to indicate their bid
                according to this code:
              </p>
              <ul className="list-disc list-inside">
                <li>Diamond: 0 card-points</li>
                <li>Spade: 10 card-points</li>
                <li>Heart: 20 card-points</li>
                <li>Club: 30 card-points</li>
              </ul>
              <p className="mt-2">
                Example: To bid 50 points, you might discard a heart (20) and
                two spades (10+10).
              </p>
              <p>
                Bear in mind that discarded cards reduce the total card-points
                in play.
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg">Play</h3>
              <p>The player to dealer's left leads to the first trick.</p>
              <p>
                Players must follow suit if possible but may otherwise play any
                card.
              </p>
              <p>
                The trick is taken by the highest card of the suit led, or by
                the highest trump if any are played.
              </p>
              <p>The winner of each trick leads to the next.</p>
            </section>

            <section>
              <h3 className="font-bold text-lg">Scoring</h3>
              <p>
                At the end of play, each player counts card-points taken in
                tricks and notes the difference from their bid.
              </p>
              <p>Each player scores the sum of their opponents' differences.</p>
              <p className="mt-2">Bonuses:</p>
              <ul className="list-disc list-inside">
                <li>30 points for making your bid exactly</li>
                <li>20 points for under/over-shooting by 1-2 points</li>
                <li>10 points for under/over-shooting by 3-5 points</li>
              </ul>
              <p className="mt-2">
                Example: Annie bids 20, takes 22, difference 2; Benny bids 30,
                takes 38, difference 8; Connie bids 40, takes 39, difference 1.
              </p>
              <p>
                Annie scores 29 (differences of 8+1 plus bonus of 20); Benny
                scores 3 (differences of 1+2); Connie scores 30 (differences of
                2+8 plus bonus of 20).
              </p>
            </section>

            <section>
              <h3 className="font-bold text-lg">Game</h3>
              <p>
                Play up to any agreed target score, or for any multiple of three
                deals.
              </p>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default GameRules;
