import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit, Rank } from '../types';
import { cn } from '../lib/utils';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

const SuitIcon = ({ suit, className }: { suit: Suit; className?: string }) => {
  switch (suit) {
    case Suit.HEARTS: return <span className={cn("text-red-500", className)}>♥</span>;
    case Suit.DIAMONDS: return <span className={cn("text-red-500", className)}>♦</span>;
    case Suit.CLUBS: return <span className={cn("text-black dark:text-gray-200", className)}>♣</span>;
    case Suit.SPADES: return <span className={cn("text-black dark:text-gray-200", className)}>♠</span>;
    default: return null;
  }
};

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className,
  index = 0
}) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none",
        isFaceUp ? "bg-white border-gray-200" : "bg-blue-800 border-blue-600",
        isPlayable && "ring-4 ring-yellow-400 border-yellow-400 shadow-lg shadow-yellow-400/50",
        !isPlayable && isFaceUp && "opacity-80 grayscale-[0.2]",
        className
      )}
      style={{
        zIndex: index,
      }}
    >
      {isFaceUp ? (
        <>
          <div className="absolute top-1 left-1.5 flex flex-col items-center leading-none">
            <span className={cn("text-sm sm:text-lg font-bold", (card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS) ? "text-red-500" : "text-gray-900")}>
              {card.rank}
            </span>
            <SuitIcon suit={card.suit} className="text-xs sm:text-sm" />
          </div>
          
          <div className="text-3xl sm:text-5xl">
            <SuitIcon suit={card.suit} />
          </div>

          <div className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none rotate-180">
            <span className={cn("text-sm sm:text-lg font-bold", (card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS) ? "text-red-500" : "text-gray-900")}>
              {card.rank}
            </span>
            <SuitIcon suit={card.suit} className="text-xs sm:text-sm" />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
           <div className="w-12 h-16 sm:w-16 sm:h-24 border-2 border-blue-400/30 rounded-md flex items-center justify-center">
              <span className="text-blue-200/20 text-4xl font-serif italic">8</span>
           </div>
        </div>
      )}
    </motion.div>
  );
};
