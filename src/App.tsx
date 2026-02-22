import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Suit, 
  Rank, 
  CardData, 
  GameState, 
  GameStatus 
} from './types';
import { 
  createDeck, 
  shuffleDeck, 
  isPlayable, 
  SUITS 
} from './constants';
import { Card } from './components/Card';
import { SuitPicker } from './components/SuitPicker';
import { GameOver } from './components/GameOver';
import { cn } from './lib/utils';
import { Layers, Info, RefreshCw, Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    status: 'waiting',
    wildSuit: null,
    winner: null,
  });

  const [isMuted, setIsMuted] = useState(false);
  const aiThinkingRef = useRef(false);

  // Initialize Game
  const initGame = useCallback(() => {
    const fullDeck = shuffleDeck(createDeck());
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Ensure the first discard is not an 8 for simplicity
    let firstDiscardIndex = 0;
    while (fullDeck[firstDiscardIndex].rank === Rank.EIGHT) {
      firstDiscardIndex++;
    }
    const discardPile = [fullDeck.splice(firstDiscardIndex, 1)[0]];

    setState({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile,
      currentTurn: 'player',
      status: 'playing',
      wildSuit: null,
      winner: null,
    });
  }, []);

  const topCard = state.discardPile.length > 0 ? state.discardPile[state.discardPile.length - 1] : null;

  // AI Logic
  useEffect(() => {
    if (state.status === 'playing' && state.currentTurn === 'ai' && !aiThinkingRef.current && topCard) {
      aiThinkingRef.current = true;
      
      const timer = setTimeout(() => {
        const playableCards = state.aiHand.filter(card => isPlayable(card, topCard, state.wildSuit));
        
        if (playableCards.length > 0) {
          // AI Strategy: Play a non-8 if possible, otherwise play an 8
          const nonEight = playableCards.find(c => c.rank !== Rank.EIGHT);
          const cardToPlay = nonEight || playableCards[0];
          
          handlePlayCard(cardToPlay, 'ai');
        } else if (state.deck.length > 0) {
          handleDrawCard('ai');
        } else {
          // Skip turn if no moves and no deck
          setState(prev => ({ ...prev, currentTurn: 'player' }));
        }
        
        aiThinkingRef.current = false;
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [state.currentTurn, state.status, state.aiHand, state.deck, topCard, state.wildSuit]);

  const handlePlayCard = (card: CardData, turn: 'player' | 'ai') => {
    if (!topCard) return;
    const isEight = card.rank === Rank.EIGHT;
    
    setState(prev => {
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      const newHand = prev[handKey].filter(c => c.id !== card.id);
      const newDiscardPile = [...prev.discardPile, card];
      
      // Check for win
      if (newHand.length === 0) {
        return {
          ...prev,
          [handKey]: newHand,
          discardPile: newDiscardPile,
          status: 'game_over',
          winner: turn,
        };
      }

      if (isEight) {
        if (turn === 'player') {
          return {
            ...prev,
            [handKey]: newHand,
            discardPile: newDiscardPile,
            status: 'choosing_suit',
          };
        } else {
          // AI picks the suit it has the most of
          const suitCounts: Record<string, number> = {};
          newHand.forEach(c => {
            suitCounts[c.suit] = (suitCounts[c.suit] || 0) + 1;
          });
          let bestSuit = SUITS[0];
          let maxCount = -1;
          SUITS.forEach(s => {
            if ((suitCounts[s] || 0) > maxCount) {
              maxCount = suitCounts[s] || 0;
              bestSuit = s;
            }
          });

          return {
            ...prev,
            [handKey]: newHand,
            discardPile: newDiscardPile,
            wildSuit: bestSuit,
            currentTurn: 'player',
          };
        }
      }

      return {
        ...prev,
        [handKey]: newHand,
        discardPile: newDiscardPile,
        wildSuit: null,
        currentTurn: turn === 'player' ? 'ai' : 'player',
      };
    });
  };

  const handleDrawCard = (turn: 'player' | 'ai') => {
    if (state.deck.length === 0 || !topCard) return;

    setState(prev => {
      const newDeck = [...prev.deck];
      const drawnCard = newDeck.pop()!;
      const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
      
      const canPlayDrawn = isPlayable(drawnCard, topCard, prev.wildSuit);
      
      return {
        ...prev,
        deck: newDeck,
        [handKey]: [...prev[handKey], drawnCard],
        currentTurn: turn === 'player' ? (canPlayDrawn ? 'player' : 'ai') : 'ai'
      };
    });
  };

  const handleSuitSelect = (suit: Suit) => {
    setState(prev => ({
      ...prev,
      wildSuit: suit,
      status: 'playing',
      currentTurn: 'ai',
    }));
  };

  const getSuitSymbol = (suit: Suit) => {
    switch (suit) {
      case Suit.HEARTS: return '♥';
      case Suit.DIAMONDS: return '♦';
      case Suit.CLUBS: return '♣';
      case Suit.SPADES: return '♠';
    }
  };

  const canPlayerMove = topCard ? state.playerHand.some(c => isPlayable(c, topCard, state.wildSuit)) : false;

  return (
    <div className="h-screen w-screen felt-bg flex flex-col overflow-hidden font-sans">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between bg-black/20 backdrop-blur-md border-b border-white/5 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="text-white font-serif italic text-2xl font-bold">8</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">豆豆疯狂 8 点</h1>
            <p className="text-xs text-blue-400 font-medium uppercase tracking-wider">Crazy Eights Deluxe</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button 
            onClick={initGame}
            className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400"
          >
            <RefreshCw size={20} />
          </button>
          <div className="h-8 w-px bg-white/10 mx-2" />
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", state.currentTurn === 'player' ? "bg-green-500" : "bg-yellow-500")} />
            <span className="text-sm font-medium text-gray-300">
              {state.currentTurn === 'player' ? '你的回合' : 'AI 思考中...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 relative flex flex-col items-center justify-between py-8 px-4">
        {state.status === 'waiting' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/5 p-12 rounded-3xl border border-white/10 backdrop-blur-xl"
            >
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-600/40 mx-auto mb-8 rotate-12">
                <span className="text-white font-serif italic text-6xl font-bold">8</span>
              </div>
              <h2 className="text-4xl font-bold mb-4 font-serif italic">准备好开始了吗？</h2>
              <p className="text-gray-400 mb-8 max-w-md">
                《豆豆疯狂 8 点》是一款经典的纸牌游戏。数字 8 是万能牌，可以改变当前花色。最先出完牌的人获胜！
              </p>
              <button 
                onClick={initGame}
                className="px-12 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-xl transition-all shadow-xl shadow-blue-600/30"
              >
                开始游戏
              </button>
            </motion.div>
          </div>
        ) : topCard ? (
          <>
            {/* AI Hand */}
            <div className="w-full flex justify-center">
              <div className="relative h-36 flex items-center justify-center">
                <AnimatePresence>
                  {state.aiHand.map((card, idx) => (
                    <div 
                      key={card.id} 
                      className="absolute transition-all duration-300"
                      style={{ 
                        left: `${(idx - (state.aiHand.length - 1) / 2) * 30}px`,
                        transform: `rotate(${(idx - (state.aiHand.length - 1) / 2) * 2}deg)`,
                        zIndex: idx
                      }}
                    >
                      <Card card={card} isFaceUp={false} />
                    </div>
                  ))}
                </AnimatePresence>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/40 px-3 py-1 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Opponent</span>
                  <span className="text-sm font-mono text-blue-400 font-bold">{state.aiHand.length}</span>
                </div>
              </div>
            </div>

            {/* Center Table */}
            <div className="flex items-center gap-12 sm:gap-24">
              {/* Draw Pile */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div 
                  onClick={() => state.currentTurn === 'player' && !canPlayerMove && handleDrawCard('player')}
                  className={cn(
                    "relative cursor-pointer transition-transform active:scale-95",
                    state.currentTurn === 'player' && !canPlayerMove ? "hover:-translate-y-2" : "opacity-50 cursor-not-allowed"
                  )}
                >
                  {state.deck.length > 0 ? (
                    <>
                      <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-blue-900 rounded-lg border-2 border-blue-700 translate-x-2 translate-y-2" />
                      <div className="absolute top-1 left-1 w-20 h-28 sm:w-24 sm:h-36 bg-blue-800 rounded-lg border-2 border-blue-600 translate-x-1 translate-y-1" />
                      <Card card={state.deck[0]} isFaceUp={false} />
                    </>
                  ) : (
                    <div className="w-20 h-28 sm:w-24 sm:h-36 rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center">
                      <span className="text-white/10 text-xs font-bold uppercase tracking-tighter">Empty</span>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-500">
                  <Layers size={14} />
                  <span className="text-xs font-mono font-bold">{state.deck.length}</span>
                </div>
              </div>

              {/* Discard Pile */}
              <div className="relative">
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={topCard.id}
                    initial={{ scale: 1.5, opacity: 0, rotate: 20 }}
                    animate={{ scale: 1, opacity: 1, rotate: (Math.random() - 0.5) * 10 }}
                    className="relative"
                  >
                    <Card card={topCard} />
                  </motion.div>
                </AnimatePresence>
                
                {state.wildSuit && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-2 whitespace-nowrap"
                  >
                    <span className="text-xl">{getSuitSymbol(state.wildSuit)}</span>
                    <span className="text-xs uppercase tracking-wider">指定花色</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Player Hand */}
            <div className="w-full flex justify-center">
              <div className="relative h-44 flex items-center justify-center">
                <AnimatePresence>
                  {state.playerHand.map((card, idx) => {
                    const playable = state.currentTurn === 'player' && isPlayable(card, topCard, state.wildSuit);
                    return (
                      <div 
                        key={card.id} 
                        className="absolute transition-all duration-300"
                        style={{ 
                          left: `${(idx - (state.playerHand.length - 1) / 2) * 45}px`,
                          transform: `rotate(${(idx - (state.playerHand.length - 1) / 2) * 3}deg)`,
                          zIndex: idx
                        }}
                      >
                        <Card 
                          card={card} 
                          isPlayable={playable}
                          onClick={() => handlePlayCard(card, 'player')}
                          index={idx}
                        />
                      </div>
                    );
                  })}
                </AnimatePresence>
                
                {!canPlayerMove && state.currentTurn === 'player' && state.deck.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-16 left-1/2 -translate-x-1/2 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 text-blue-200 px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                  >
                    <Info size={16} />
                    无牌可出，请从牌堆摸牌
                  </motion.div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {state.status === 'choosing_suit' && (
          <SuitPicker onSelect={handleSuitSelect} />
        )}
        {state.status === 'game_over' && state.winner && (
          <GameOver winner={state.winner} onRestart={initGame} />
        )}
      </AnimatePresence>

      {/* Mobile Hint */}
      <div className="sm:hidden fixed bottom-4 right-4 text-white/20">
        <span className="text-[10px] uppercase tracking-widest font-bold">Crazy 8s v1.0</span>
      </div>
    </div>
  );
}
