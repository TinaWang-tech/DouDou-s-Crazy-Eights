import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { cn } from '../lib/utils';

interface SuitPickerProps {
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onSelect }) => {
  const suits = [
    { type: Suit.HEARTS, icon: '♥', color: 'text-red-500', label: '红心' },
    { type: Suit.DIAMONDS, icon: '♦', color: 'text-red-500', label: '方块' },
    { type: Suit.CLUBS, icon: '♣', color: 'text-gray-900', label: '梅花' },
    { type: Suit.SPADES, icon: '♠', color: 'text-gray-900', label: '黑桃' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center font-serif italic">选择新的花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit.type}
              onClick={() => onSelect(suit.type)}
              className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className={cn("text-5xl mb-2 group-hover:scale-110 transition-transform", suit.color)}>
                {suit.icon}
              </span>
              <span className="text-gray-600 font-medium">{suit.label}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
