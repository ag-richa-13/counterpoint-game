# Counterpoint Card Game

A digital implementation of David Parlett's Counterpoint card game.

## Game Rules

### Cards
- 37 cards: A-10-K-Q-J-9-8-7-6 in each suit, plus a Joker
- Card point values:
  - Ace: 11 points
  - Ten: 10 points
  - King: 4 points
  - Queen: 3 points
  - Jack: 2 points
  - 9-6: 0 points
  - Total: 30 points per suit (120 total card points)

### Gameplay

#### Deal
- 12 cards dealt to each player
- Last card (37th) turned face up to establish trump suit
- If the turned card is a Nine or Joker, the round is played with no trump
- Joker takes on the value and suit of the turned up card

#### Bidding
Players bid by discarding 3 cards face down using this code:
- Diamond: 0 points
- Spade: 10 points
- Heart: 20 points
- Club: 30 points

Example bids:
- Three diamonds: 0-9 points
- Three clubs: 90-99 points
- Three spades: 30-39 points (10+10+10)
- One club, two diamonds: 30-39 points (30+0+0)

#### Trick Taking
- Nine tricks per round
- Must follow suit if possible
- Highest card of led suit or highest trump wins
- Winner leads next trick

#### Scoring
- Players compare trick points with their bid
- Score = Sum of opponents' bid-trick differences
- Bonuses:
  - 30 points: Exact bid match
  - 20 points: Within 1-2 points of bid
  - 10 points: Within 3-5 points of bid

## Features

- Interactive card gameplay
- Real-time score tracking
- Responsive design
- Intuitive user interface
- Automated trick resolution
- Bidding system

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Vite

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/ag-richa-13/counterpoint-game
```
