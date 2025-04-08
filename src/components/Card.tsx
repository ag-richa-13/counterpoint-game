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
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center rounded-lg p-3">
          <div className="flex flex-col items-center bg-blue-800/30 rounded-lg w-full h-full justify-center">
            <div className="text-white/40 text-lg sm:text-xl font-serif tracking-widest">
              ♠♥♦♣
            </div>
            <div className="text-white/30 text-xs sm:text-sm mt-2 font-serif tracking-wide">
              Counterpoint
            </div>
          </div>
        </div>
      );
    }

    if (suit === "joker") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-between bg-gradient-to-br from-purple-100 via-purple-50 to-purple-200 p-1">
          {/* Top text */}
          <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            JOKER
          </div>
          
          {/* Center star */}
          <div className="flex-grow flex items-center justify-center">
            <div className="relative">
              <span className="text-3xl sm:text-4xl text-yellow-500 animate-pulse drop-shadow-lg">★</span>
              <span className="absolute inset-0 text-3xl sm:text-4xl text-purple-400/50 animate-pulse delay-150">★</span>
            </div>
          </div>
          
          {/* Bottom text (rotated) */}
          <div className="text-sm sm:text-base font-bold bg-gradient-to-r from-yellow-500 via-purple-500 to-pink-500 bg-clip-text text-transparent rotate-180">
            JOKER
          </div>
        </div>
      );
    }

    return (
      <div className={`w-full h-full flex flex-col justify-between p-1 ${suitColorClass}`}>
        {/* Top section */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col items-center">
            <div className={`font-bold font-serif leading-none ${small ? "text-xs" : "text-sm"}`}>
              {rank}
            </div>
            <div className={`${small ? "text-[10px]" : "text-xs"}`}>{suitSymbol}</div>
          </div>
        </div>

        {/* Center symbol */}
        <div className="flex-grow flex items-center justify-center -mt-2">
          <div className={`
            ${small ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"}
            font-bold drop-shadow-md transform
            ${suit === "hearts" || suit === "diamonds" ? "drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]" : "drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]"}
          `}>
            {suitSymbol}
          </div>
        </div>

        {/* Bottom section (rotated) */}
        <div className="flex justify-between items-start rotate-180">
          <div className="flex flex-col items-center">
            <div className={`font-bold font-serif leading-none ${small ? "text-xs" : "text-sm"}`}>
              {rank}
            </div>
            <div className={`${small ? "text-[10px]" : "text-xs"}`}>{suitSymbol}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        `relative rounded-xl bg-white shadow-lg border border-gray-200 transition-all duration-300`,
        small ? "w-16 h-24 sm:w-20 sm:h-28" : "w-24 h-36 sm:w-28 sm:h-40", // Significantly increased sizes
        selected && "transform -translate-y-2 sm:-translate-y-4 ring-2 ring-goldAccent shadow-xl",
        !playable && !faceDown && "opacity-60 cursor-not-allowed",
        playable && !faceDown && "hover:shadow-xl cursor-pointer hover:-translate-y-1 hover:rotate-1",
        faceDown && "shadow-inner",
        className
      )}
      onClick={playable && !faceDown ? onClick : undefined}
      style={style}
    >
      <div className={cn(
        "w-full h-full overflow-hidden rounded-xl",
        !faceDown && "bg-gradient-to-br from-white via-white to-gray-50"
      )}>
        {renderCardContent()}
      </div>

      {card.value > 0 && !faceDown && (
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-500 text-white text-[10px] sm:text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg border border-amber-300">
          {card.value}
        </div>
      )}
    </div>
  );
};

export default Card;
