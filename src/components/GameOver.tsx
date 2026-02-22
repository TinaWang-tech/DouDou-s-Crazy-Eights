import React from 'react';
import { motion } from 'motion/react';
import { Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameOverProps {
  winner: 'player' | 'ai';
  onRestart: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ winner, onRestart }) => {
  React.useEffect(() => {
    if (winner === 'player') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [winner]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
    >
      <div className="text-center p-12 rounded-3xl bg-white/5 border border-white/10 shadow-2xl">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="inline-block mb-6"
        >
          {winner === 'player' ? (
            <div className="bg-yellow-400 p-6 rounded-full shadow-lg shadow-yellow-400/20">
              <Trophy className="w-16 h-16 text-yellow-900" />
            </div>
          ) : (
            <div className="bg-gray-600 p-6 rounded-full">
              <span className="text-6xl">🤖</span>
            </div>
          )}
        </motion.div>
        
        <h2 className="text-5xl font-bold mb-2 font-serif italic">
          {winner === 'player' ? '你赢了！' : 'AI 赢了'}
        </h2>
        <p className="text-gray-400 mb-8 text-xl">
          {winner === 'player' ? '太棒了，你是真正的纸牌大师！' : '别灰心，再来一局试试？'}
        </p>

        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xl transition-all shadow-lg shadow-blue-600/20 mx-auto"
        >
          <RotateCcw className="w-6 h-6" />
          重新开始
        </button>
      </div>
    </motion.div>
  );
};
