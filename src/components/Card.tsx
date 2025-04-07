import React from "react";
import { Card as CardType, Suit } from "@/types/game";
import { getSuitSymbol, getSuitColor } from "@/utils/gameUtils";
import { cn } from "@/lib/utils";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  selected?: boolean;
  faceDown?: boolean;
  playable?: boolean;
  className?: string;
  small?: boolean;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
  card,
  onClick,
  selected = false,
  faceDown = false,
  playable = true,
  className = "",
  small = false,
  style = {},
}) => {
  const { suit, rank } = card;
  const suitSymbol = getSuitSymbol(suit);
  const suitColorClass = getSuitColor(suit);

  const renderCardContent = () => {
    if (faceDown) {
      return (
        <div className="w-full h-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center rounded-md">
          <div className="flex flex-col items-center">
            <div className="text-white text-opacity-20 text-lg sm:text-xl">
              ♠♥♦♣
            </div>
            <div className="text-white text-opacity-10 text-xs sm:text-sm mt-1">
              Counterpoint
            </div>
          </div>
        </div>
      );
    }

    if (suit === "joker") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
          <div className="text-xl sm:text-2xl font-bold">JOKER</div>
          <div className="text-3xl sm:text-4xl mt-2 text-yellow-500">★</div>
        </div>
      );
    }

    return (
      <div className={`w-full h-full flex flex-col ${suitColorClass}`}>
        <div className="flex justify-between p-1">
          <div
            className={`font-bold ${
              small ? "text-xs sm:text-sm" : "text-sm sm:text-lg"
            }`}
          >
            {rank}
          </div>
          <div className={small ? "text-xs sm:text-sm" : "text-sm sm:text-lg"}>
            {suitSymbol}
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div
            className={`${
              small ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
            } font-bold`}
          >
            {suitSymbol}
          </div>
        </div>
        <div className="flex justify-between p-1 rotate-180">
          <div
            className={`font-bold ${
              small ? "text-xs sm:text-sm" : "text-sm sm:text-lg"
            }`}
          >
            {rank}
          </div>
          <div className={small ? "text-xs sm:text-sm" : "text-sm sm:text-lg"}>
            {suitSymbol}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        `relative rounded-md bg-white shadow-md border border-gray-300 transition-all duration-200`,
        small ? "w-10 h-14 sm:w-12 sm:h-16" : "w-16 h-24 sm:w-20 sm:h-28",
        selected &&
          "transform -translate-y-2 sm:-translate-y-4 ring-2 ring-goldAccent",
        !playable && !faceDown && "opacity-60 cursor-not-allowed",
        playable &&
          !faceDown &&
          "hover:shadow-lg cursor-pointer hover:-translate-y-1",
        faceDown && "shadow-inner",
        className
      )}
      onClick={playable && !faceDown ? onClick : undefined}
      style={style}
    >
      <div
        className={cn(
          "w-full h-full overflow-hidden rounded-md",
          faceDown ? "" : "bg-white"
        )}
      >
        {renderCardContent()}
      </div>

      {card.value > 0 && !faceDown && (
        <div className="absolute -bottom-1 -right-1 bg-goldAccent text-black text-[10px] sm:text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
          {card.value}
        </div>
      )}
    </div>
  );
};

export default Card;
