import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { WasabiData, Character, Member, CollectionEntry, CardPack } from '../types';
import { ArrowLeft, X, Trophy, BookOpen, Package, Zap, Sparkles, Clock, Plus, Dices, Medal, ChevronLeft, ChevronRight } from 'lucide-react';
import { calcHiddenScore, getMemberTotalScore, formatRarity, formatDegree, getActiveCraftingRecipes, calculateDaysRemaining, getActiveCraftingSet, getActivePackSale, getTimeRemaining } from '../utils';

interface WasabiCardsProps {
  data: WasabiData;
}

const DegreePill: React.FC<{ deg: string; config: any }> = ({ deg, config }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <motion.div
      onClick={() => setIsFlipped(!isFlipped)}
      className="cursor-pointer perspective-1000"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        className="relative preserve-3d w-24 h-8"
      >
        {/* Front */}
        <div 
          className="absolute inset-0 backface-hidden rounded-full text-[10px] font-bold border-2 flex items-center justify-center"
          style={{ 
            color: config.color, 
            borderColor: config.border,
            backgroundColor: `${config.color}25`
          }}
        >
          {formatDegree(deg)}
        </div>
        
        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden rounded-full text-[10px] font-bold border-2 flex items-center justify-center rotate-y-180"
          style={{ 
            color: config.color, 
            borderColor: config.border,
            backgroundColor: `${config.color}40`
          }}
        >
          x{config.multiplier}
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProgressionScroller: React.FC<{ data: WasabiData }> = ({ data }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <AnimatePresence>
        {showLeftArrow && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onClick={() => scroll('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#6B5435] text-white rounded-full shadow-lg border border-white/10 hover:bg-[#9FD356] hover:text-[#6B5435] transition-colors hidden md:flex"
          >
            <ChevronLeft size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Right Arrow */}
      <AnimatePresence>
        {showRightArrow && (
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onClick={() => scroll('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-[#6B5435] text-white rounded-full shadow-lg border border-white/10 hover:bg-[#9FD356] hover:text-[#6B5435] transition-colors hidden md:flex"
          >
            <ChevronRight size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-x-auto no-scrollbar scroll-smooth"
      >
        <div className="flex items-center gap-6 px-4 min-w-max">
          {['iron','bronze','silver','pearl','gold','jade','sapphire','ruby','emerald','diamond'].map((deg, i, arr) => (
            <React.Fragment key={deg}>
              <div className="flex flex-col items-center gap-2">
                <DegreePill deg={deg} config={data.cardConfig.degrees[deg]} />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Step {i + 1}</span>
              </div>
              {i < arr.length - 1 && (
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-0.5 bg-gradient-to-r from-white/10 via-white/30 to-white/10 rounded-full"></div>
                  <span className="text-[8px] font-bold text-white/30">×2</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Mobile Hint */}
      <div className="mt-3 flex justify-center md:hidden">
        <div className="flex gap-1.5">
          {['iron','bronze','silver','pearl','gold','jade','sapphire','ruby','emerald','diamond'].map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                // Approximate current step based on scroll
                Math.floor((scrollRef.current?.scrollLeft || 0) / 120) === i 
                ? 'bg-[#9FD356]' 
                : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const WasabiCards: React.FC<WasabiCardsProps> = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get('view') || 'packs');
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [rollingPack, setRollingPack] = useState<CardPack | null>(null);
  const [rollResult, setRollResult] = useState<{ character: Character; rarity: string } | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showRollResult, setShowRollResult] = useState(false);

  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSearchParams({ view });
  }, [view, setSearchParams]);

  const activePackSale = getActivePackSale(data, now);
  const activeCraftingSet = getActiveCraftingSet(data, now);
  const visiblePacks = activePackSale
    ? data.packs.filter(pack => activePackSale.packs.includes(pack.packageId))
    : [];

  const isCardOwned = (characterId: string) => {
    return data.members.some(m => m.collection.some(entry => entry.characterId === characterId));
  };

  const handleRoll = (pack: CardPack) => {
    setRollingPack(pack);
    setIsRolling(true);
    setShowRollResult(false);
    setRollResult(null);

    // Simulate roll logic based on chances
    const random = Math.random() * 100;
    let cumulative = 0;
    let selectedOutcome = pack.outcomes[0];

    for (const outcome of pack.outcomes) {
      const chance = parseFloat(outcome.chance.replace('%', ''));
      cumulative += chance;
      if (random <= cumulative) {
        selectedOutcome = outcome;
        break;
      }
    }

    const character = data.characters.find(c => c.id === selectedOutcome.characterId);
    if (character) {
      setTimeout(() => {
        setRollResult({ character, rarity: character.rarity });
        setIsRolling(false);
        setShowRollResult(true);
      }, 2000); // Animation duration
    }
  };

  const renderEvents = () => {
    const visibleEventPacks = activePackSale
      ? data.packs.filter(pack => activePackSale.packs.includes(pack.packageId))
      : [];

    const visibleSportEvents = data.sportEvents.filter(e => e.visible);

    return (
      <div className="space-y-20">
        {/* Event Packs */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-black mb-2">Active Event Packs</h2>
            <p className="text-white/45">Limited time packs available during the current sale.</p>
            {activePackSale && (
              <div className="mt-4 flex items-center justify-center gap-2 text-[#E8631A] font-bold">
                <Clock size={18} />
                <span>Packs Sale Ends In: {getTimeRemaining(activePackSale.end_date, now)}</span>
              </div>
            )}
          </div>

          {visibleEventPacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleEventPacks.map((event: any, i: number) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 transition-all hover:border-[#9FD356]/40 hover:shadow-2xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={`/icons/${event.banner}`} alt={event.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <h3 className="text-2xl font-black text-white drop-shadow-lg">{event.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-4 items-center mb-6">
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#9FD356]/10 text-[#9FD356] border border-[#9FD356]/30 rounded-full font-bold text-sm">
                        <img src="/icons/wabi-icon.png" alt="Wabi" className="w-4 h-4" />
                        <span>{event.cost.wabi}</span>
                      </div>
                      <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">or</span>
                      <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E8631A]/10 text-[#E8631A] border border-[#E8631A]/30 rounded-full font-bold text-sm">
                        <img src="/icons/spice-icon.png" alt="Spice" className="w-4 h-4" />
                        <span>{event.cost.spice}</span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Possible Outcomes</div>
                      <div className="grid gap-2">
                        {event.outcomes.map((outcome: any, j: number) => {
                          const char = data.characters.find((c: any) => c.id === outcome.characterId);
                          if (!char) return null;
                          return (
                            <div key={j} className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/5">
                              <div className="flex items-center gap-2">
                                <img 
                                  src={`/icons/${char.images.iron}`} 
                                  alt={char.name} 
                                  className="w-8 h-8 rounded object-cover" 
                                />
                                <span className="text-xs font-bold text-white/80">{char.name}</span>
                              </div>
                              <span className="text-[10px] font-black text-[#9FD356]">{outcome.chance}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleRoll(event)}
                      className="w-full py-4 bg-[#9FD356] text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-[#9FD356]/20 transition-all hover:bg-[#8B6F47] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Dices size={18} />
                      Roll for Card
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-20 text-center">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-white mb-2">No Active Events</h3>
              <p className="text-white/45">Check back soon for the next season's events!</p>
            </div>
          )}
        </div>

        {/* Sport Events */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-black mb-2">Wasabi Sport Events</h2>
            <p className="text-white/45">Compete in physical challenges and win exclusive cards.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
            {visibleSportEvents.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8631A] to-transparent opacity-30"></div>
                
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 bg-[#E8631A]/10 rounded-2xl flex items-center justify-center text-[#E8631A]">
                        <Trophy size={32} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white">{event.name}</h3>
                        <p className="text-white/40 text-xs uppercase tracking-widest">{event.type} Challenge</p>
                      </div>
                    </div>
                    <p className="text-white/60 text-lg mb-8 leading-relaxed">{event.description}</p>
                    
                    {/* Prizes */}
                    {event.prizes && (
                      <div className="space-y-4">
                        <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Event Prizes</div>
                        <div className="grid grid-cols-3 gap-3">
                          {['1st', '2nd', '3rd'].map((place) => {
                            const prize = (event.prizes as any)[place];
                            if (!prize) return null;
                            const char = data.characters.find(c => c.id === prize.characterId);
                            if (!char) return null;
                            const degree = prize.degree || 'iron';
                            const degColors = data.cardConfig.degrees[degree];
                            const imgSrc = char.images[degree] || char.images.iron;
                            return (
                              <div key={place} className="bg-white/5 p-3 rounded-xl border border-white/10 text-center">
                                <div className={`text-[10px] font-black mb-2 uppercase tracking-widest ${
                                  place === '1st' ? 'text-yellow-500' : 
                                  place === '2nd' ? 'text-gray-400' : 'text-orange-500'
                                }`}>
                                  {place}
                                </div>
                                <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-white/10 mb-2">
                                  <img src={`/icons/${imgSrc}`} alt={char.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="text-[8px] font-bold text-white/80 truncate">{char.name}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderCrafting = () => {
    const recipes = getActiveCraftingRecipes(data, now);
    return (
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-black mb-2">Wasabi Crafting</h2>
          <p className="text-white/45">Combine your cards to create legendary masterpieces.</p>
          {activeCraftingSet && (
            <div className="mt-4 flex items-center justify-center gap-2 text-[#9FD356] font-bold">
              <Clock size={18} />
              <span>Crafting Set Ends In: {getTimeRemaining(activeCraftingSet.end_date, now)}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto">
          {recipes.map((recipe, i) => {
            return (
              <motion.div 
                key={recipe.id} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-12 relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9FD356] to-transparent opacity-30"></div>
                
                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#9FD356]/10 rounded-xl flex items-center justify-center text-[#9FD356]">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">Recipe {i + 1}</h3>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                  {/* Inputs */}
                  <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                    {recipe.recipe.inputs.map((input: any, idx: number) => {
                      const char = data.characters.find((c: any) => c.id === input.card_id);
                      const degree = (data.cardConfig.degrees as any)[input.degree];
                      if (!char || !degree) return null;
                      const cardImage = (char as any).images?.[input.degree] ?? char.image;
                      const isIron = input.degree === 'iron';
                      return (
                        <React.Fragment key={idx}>
                          <div
                            className="relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 cursor-pointer hover:scale-110"
                            style={{
                              width: '100px',
                              height: '140px',
                              backgroundColor: degree.border,
                              border: `2px solid ${degree.border}`,
                              boxShadow: `0 0 15px ${degree.glow}40`
                            }}
                          >
                            <div className="absolute inset-[3px] rounded-lg overflow-hidden" style={{ bottom: '30px' }}>
                              <img src={`/icons/${cardImage}`} alt={char.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-7 flex flex-col items-center justify-center px-1" style={{ backgroundColor: degree.border }}>
                              <div className="text-[8px] font-black text-white truncate w-full text-center leading-tight">{char.name}</div>
                              <div className="text-[6px] font-black uppercase tracking-widest" style={{ color: isIron ? '#ddd' : degree.color }}>{input.degree}</div>
                            </div>
                          </div>
                          {idx < recipe.recipe.inputs.length - 1 && (
                            <Plus className="text-white/20 shrink-0" size={24} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#9FD356]/20 flex items-center justify-center text-[#9FD356] animate-pulse">
                      <ArrowLeft className="rotate-180" size={24} />
                    </div>
                  </div>

                  {/* Output */}
                  {(() => {
                    const char = data.characters.find((c: any) => c.id === recipe.recipe.output.card_id);
                    const degree = (data.cardConfig.degrees as any)[recipe.recipe.output.degree];
                    if (!char || !degree) return null;
                    const cardImage = (char as any).images?.[recipe.recipe.output.degree] ?? char.image;
                    const isIron = recipe.recipe.output.degree === 'iron';
                    return (
                      <div
                        className="relative rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(159,211,86,0.2)] transition-all duration-500 cursor-pointer hover:scale-110"
                        style={{
                          width: '140px',
                          height: '196px',
                          backgroundColor: degree.border,
                          border: `3px solid ${degree.border}`,
                          boxShadow: `0 0 30px ${degree.glow}, inset 0 0 20px ${degree.glow}`
                        }}
                      >
                        <div className="absolute inset-[4px] rounded-xl overflow-hidden" style={{ bottom: '36px' }}>
                          <img src={`/icons/${cardImage}`} alt={char.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                          <div className="absolute top-2 right-2">
                            <Sparkles className="text-white fill-white animate-bounce" size={20} />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-9 flex flex-col items-center justify-center px-1" style={{ backgroundColor: degree.border }}>
                          <div className="text-[10px] font-black text-white truncate w-full text-center leading-tight">{char.name}</div>
                          <div className="text-[7px] font-black uppercase tracking-[0.2em]" style={{ color: isIron ? '#ddd' : degree.color }}>{recipe.recipe.output.degree}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPacks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {data.packs
        .filter(pack => {
          // Hide placeholder packs
          if (pack.name === 'NA' || pack.name === '???' || pack.outcomes.length === 0) return false;
          
          // Hide packs with no owned cards (as requested "don't show any of the packs that has the name ??? at all")
          const chars = pack.outcomes.map(o => data.characters.find(c => c.id === o.characterId)).filter(Boolean) as Character[];
          return chars.some(char => isCardOwned(char.id));
        })
        .map((pack, i) => {
          const chars = pack.outcomes.map(o => data.characters.find(c => c.id === o.characterId)).filter(Boolean) as Character[];
          const isAnyCardOwned = true; // Since we filtered, this is always true
          const MAX_VISIBLE = 4;
        const visible = chars.slice(0, MAX_VISIBLE);
        const hidden = chars.slice(MAX_VISIBLE);

        return (
          <motion.div 
            key={pack.packageId} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all hover:border-[#9FD356]/40 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_30px_rgba(159,211,86,0.1)] hover:-translate-y-1 group"
          >
            <div className="bg-gradient-to-br from-[#9FD356]/15 to-[#9FD356]/5 p-6 border-b border-white/10 flex justify-between items-center">
              <div className="text-xl font-black text-white">{isAnyCardOwned ? pack.name : '???'}</div>
              <div className="bg-[#9FD356]/20 border border-[#9FD356]/40 text-[#9FD356] px-3.5 py-1 rounded-full text-xs font-bold">Pack Score: {pack.score}</div>
            </div>
            <div className="p-6 space-y-2.5">
              {visible.map(char => {
                const owned = isCardOwned(char.id);
                return (
                  <div key={char.id} className="flex items-center gap-3.5 p-3 bg-white/5 border-2 border-transparent rounded-xl transition-all hover:translate-x-1 hover:bg-white/10">
                    <img 
                      src={`/icons/${char.images.iron}`} 
                      alt={owned ? char.name : '???'} 
                      className={`w-12 h-12 rounded-lg object-cover ${!owned ? 'grayscale brightness-0' : ''}`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold truncate ${owned ? 'text-white' : 'text-white/20'}`}>{owned ? char.name : '???'}</div>
                      <div className="flex gap-1 mt-1">
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border ${
                          !owned ? 'bg-white/5 text-white/10 border-white/10' :
                          char.rarity === 'common' ? 'bg-[#9E9E9E]/15 text-[#9E9E9E] border-[#9E9E9E]/30' :
                          char.rarity === 'rare' ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
                          char.rarity === 'epic' ? 'bg-[#9B59B6]/15 text-[#9B59B6] border-[#9B59B6]/30' :
                          char.rarity === 'legendary' ? 'bg-[#FF9800]/15 text-[#FF9800] border-[#FF9800]/30' : 'bg-[#E91E63]/15 text-[#E91E63] border-[#E91E63]/30'
                        }`}>{owned ? char.rarity : '???'}</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-white/35">{calcHiddenScore(char.id, 'iron', data).toLocaleString()}</div>
                  </div>
                );
              })}
              {hidden.length > 0 && (
                <div 
                  onClick={() => setSelectedPackId(pack.packageId)}
                  className="flex items-center gap-4 p-3 bg-[#9FD356]/10 border-2 border-[#9FD356]/35 rounded-xl cursor-pointer transition-all hover:bg-[#9FD356]/20 hover:border-[#9FD356]/70 hover:translate-x-1"
                >
                  <div className="flex-1 flex items-center gap-1.5 justify-center">
                    <span className="text-xl font-black text-[#9FD356]">+{hidden.length}</span>
                    <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">More</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderAllCards = () => {
    const cards = data.characters.map(char => ({
      id: char.id,
      score: calcHiddenScore(char.id, 'iron', data)
    })).sort((a, b) => b.score - a.score);

    const tiers: string[][] = [];
    if (cards.length > 0) {
      let currentTier: string[] = [cards[0].id];

      for (let i = 1; i < cards.length; i++) {
        const prevScore = calcHiddenScore(cards[i-1].id, 'iron', data);
        const currScore = calcHiddenScore(cards[i].id, 'iron', data);
        if (prevScore - currScore < 5) {
          currentTier.push(cards[i].id);
        } else {
          tiers.push(currentTier);
          currentTier = [cards[i].id];
        }
      }
      tiers.push(currentTier);
    }

    return (
      <div className="space-y-10">
        {tiers.map((tier, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.08 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tier.map(id => {
                const char = data.characters.find(c => c.id === id);
                if (!char) return null;
                const score = calcHiddenScore(id, 'iron', data);
                const owned = isCardOwned(id);
                return (
                  <div key={id} className={`flex items-center gap-3.5 p-3 border-2 rounded-xl transition-all hover:translate-x-1 ${
                    owned ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/40 border-white/5 opacity-60'
                  }`}>
                    <img 
                      src={`/icons/${char.images.iron}`} 
                      alt={owned ? char.name : '???'} 
                      className={`w-14 h-14 rounded-lg object-cover ${!owned ? 'grayscale brightness-0' : ''}`} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold truncate ${owned ? 'text-white' : 'text-white/20'}`}>{owned ? char.name : '???'}</div>
                      <div className="flex gap-1 mt-1">
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border ${
                          !owned ? 'bg-white/5 text-white/10 border-white/10' :
                          char.rarity === 'common' ? 'bg-[#9E9E9E]/15 text-[#9E9E9E] border-[#9E9E9E]/30' :
                          char.rarity === 'rare' ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
                          char.rarity === 'epic' ? 'bg-[#9B59B6]/15 text-[#9B59B6] border-[#9B59B6]/30' :
                          char.rarity === 'legendary' ? 'bg-[#FF9800]/15 text-[#FF9800] border-[#FF9800]/30' : 'bg-[#E91E63]/15 text-[#E91E63] border-[#E91E63]/30'
                        }`}>{owned ? char.rarity : '???'}</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-white/35">{score.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
            {i < tiers.length - 1 && <div className="h-px bg-[#9FD356]/25 rounded-full"></div>}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderLeaderboard = () => {
    const ranked = data.members.map(member => ({
      member,
      score: getMemberTotalScore(member, data),
      cardCount: (member.collection || []).reduce((s, e) => s + (e.count || 1), 0)
    })).sort((a, b) => b.score - a.score);

    return (
      <div className="max-w-3xl mx-auto space-y-3">
        {ranked.map((entry, i) => {
          const uniqueScoresAbove = new Set(ranked.filter(e => e.score > entry.score).map(e => e.score)).size;
          const rank = uniqueScoresAbove + 1;
          return (
            <Link 
              key={entry.member.id} 
              to={`/member/${entry.member.id}`}
              id={`rank-${entry.member.id}`}
              className="block"
            >
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-5 p-5 bg-white/5 border border-white/10 rounded-2xl transition-all hover:bg-white/10 hover:translate-x-1 ${
                  rank === 1 ? 'bg-gradient-to-r from-[#D4AF37]/18 to-[#FFD700]/10 border-[#D4AF37]/50 shadow-[0_4px_20px_rgba(212,175,55,0.15)]' :
                  rank === 2 ? 'bg-gradient-to-r from-white/10 to-white/5 border-white/40' :
                  rank === 3 ? 'bg-gradient-to-r from-[#CD7F32]/12 to-[#CD7F32]/5 border-[#CD7F32]/40' : ''
                }`}
              >
                <div className={`text-2xl font-black min-w-[48px] text-center ${
                  rank === 1 ? 'text-[#FFD700] drop-shadow-[0_0_12px_rgba(255,215,0,0.5)]' :
                  rank === 2 ? 'text-[#C0C0C0]' :
                  rank === 3 ? 'text-[#CD7F32]' : 'text-white/30 text-lg'
                }`}>
                  {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                </div>
                <img src={`/icons/${entry.member.icon}`} alt={entry.member.name} className="w-12 h-12 rounded-full object-cover border-2 border-white/15" />
                <div className="flex-1">
                  <div className="text-lg font-bold text-white">{entry.member.name}{entry.member.role === 'leader' ? ' ⭐' : ''}</div>
                  <div className="text-xs text-white/40">{entry.cardCount} card{entry.cardCount !== 1 ? 's' : ''}</div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${
                    rank === 1 ? 'text-[#FFD700]' :
                    rank === 2 ? 'text-[#C0C0C0]' :
                    rank === 3 ? 'text-[#CD7F32]' : 'text-[#9FD356]'
                  }`}>{entry.score.toLocaleString()}</div>
                  <div className="text-[10px] text-white/35 uppercase tracking-widest">pts</div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#0d1117] min-h-screen pb-20 text-white">
      <div className="bg-white/5 border-b border-white/10 p-5">
        <Link to="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#9FD356] text-white no-underline rounded-lg font-semibold transition-all hover:bg-[#8B6F47] hover:-translate-x-1">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      {/* Cards Hero */}
      <section className="relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(159,211,86,0.15)_0%,transparent_50%),radial-gradient(ellipse_at_80%_30%,rgba(185,242,255,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_50%_80%,rgba(224,17,95,0.08)_0%,transparent_40%)] pointer-events-none"></div>
        <div className="container mx-auto px-5 relative z-10">
          <div className="text-6xl mb-4 drop-shadow-[0_0_20px_rgba(159,211,86,0.5)]">🃏</div>
          <h1 className="text-6xl font-black text-white tracking-widest mb-3 drop-shadow-[0_0_30px_rgba(159,211,86,0.4)]">Wasabi Cards</h1>
          <p className="text-white/60 text-xl tracking-widest uppercase">Collect, Combine, Conquer</p>
        </div>
      </section>

      {/* Navigation */}
      <div className="bg-[#0d1117] py-6 sticky top-0 z-40 border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-5">
          <div className="flex gap-4 justify-center flex-wrap">
            <button 
              onClick={() => setView('packs')}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all ${
                view === 'packs' ? 'bg-[#9FD356]/20 border-2 border-[#9FD356] text-[#9FD356] shadow-[0_4px_16px_rgba(159,211,86,0.3)]' : 'bg-white/5 border-2 border-white/10 text-white/65 hover:bg-[#9FD356]/12 hover:border-[#9FD356]/50 hover:text-[#9FD356] hover:-translate-y-0.5'
              }`}
            >
              <Package size={20} />
              <span>Card Packs</span>
            </button>
            <button 
              onClick={() => setView('events')}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all ${
                view === 'events' ? 'bg-[#9FD356]/20 border-2 border-[#9FD356] text-[#9FD356] shadow-[0_4px_16px_rgba(159,211,86,0.3)]' : 'bg-white/5 border-2 border-white/10 text-white/65 hover:bg-[#9FD356]/12 hover:border-[#9FD356]/50 hover:text-[#9FD356] hover:-translate-y-0.5'
              }`}
            >
              <Zap size={20} />
              <span>Events</span>
            </button>
            <button 
              onClick={() => setView('crafting')}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all ${
                view === 'crafting' ? 'bg-[#9FD356]/20 border-2 border-[#9FD356] text-[#9FD356] shadow-[0_4px_16px_rgba(159,211,86,0.3)]' : 'bg-white/5 border-2 border-white/10 text-white/65 hover:bg-[#9FD356]/12 hover:border-[#9FD356]/50 hover:text-[#9FD356] hover:-translate-y-0.5'
              }`}
            >
              <Sparkles size={20} />
              <span>Crafting</span>
            </button>
            <button 
              onClick={() => setView('all')}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all ${
                view === 'all' ? 'bg-[#9FD356]/20 border-2 border-[#9FD356] text-[#9FD356] shadow-[0_4px_16px_rgba(159,211,86,0.3)]' : 'bg-white/5 border-2 border-white/10 text-white/65 hover:bg-[#9FD356]/12 hover:border-[#9FD356]/50 hover:text-[#9FD356] hover:-translate-y-0.5'
              }`}
            >
              <BookOpen size={20} />
              <span>All Cards</span>
            </button>
            <button 
              onClick={() => setView('leaderboard')}
              className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full font-bold text-sm transition-all ${
                view === 'leaderboard' ? 'bg-[#9FD356]/20 border-2 border-[#9FD356] text-[#9FD356] shadow-[0_4px_16px_rgba(159,211,86,0.3)]' : 'bg-white/5 border-2 border-white/10 text-white/65 hover:bg-[#9FD356]/12 hover:border-[#9FD356]/50 hover:text-[#9FD356] hover:-translate-y-0.5'
              }`}
            >
              <Trophy size={20} />
              <span>Global Leaderboard</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-5 py-16">
        {view === 'packs' && (
          <div className="space-y-12">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#9FD356]/15 rounded-xl border border-[#9FD356]/30">
                  <Sparkles className="text-[#9FD356]" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Card Progression</h3>
                  <p className="text-white/45 text-sm">Combine two cards of the same degree to upgrade to the next level.</p>
                </div>
              </div>
              <ProgressionScroller data={data} />
            </div>
            {renderPacks()}
          </div>
        )}

        {view === 'events' && renderEvents()}

        {view === 'crafting' && renderCrafting()}

        {view === 'all' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-black mb-2">All Cards</h2>
              <p className="text-white/45">Ranked by hidden score — highest to lowest</p>
            </div>
            {renderAllCards()}
          </div>
        )}

        {view === 'leaderboard' && (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-4xl font-black mb-2">Global Leaderboard</h2>
              <p className="text-white/45">Total hidden score of all owned cards</p>
            </div>
            {renderLeaderboard()}
          </div>
        )}
      </div>

      {/* Pack Modal */}
      <AnimatePresence>
        {selectedPackId && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPackId(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[9999] flex items-center justify-center p-5"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#161b22] border border-white/12 rounded-[22px] w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(159,211,86,0.15)]"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-br from-[#9FD356]/10 to-transparent">
                <h3 className="text-xl font-black text-white">{data.packs.find(p => p.packageId === selectedPackId)?.name} – All Cards</h3>
                <button 
                  onClick={() => setSelectedPackId(null)}
                  className="w-9 h-9 rounded-full bg-white/10 border border-white/15 text-white/70 flex items-center justify-center transition-all hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 hover:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.characters.filter(c => c.packageId === selectedPackId).map(char => {
                  const owned = isCardOwned(char.id);
                  return (
                    <div key={char.id} className={`flex items-center gap-3.5 p-3 border-2 rounded-xl transition-all hover:translate-x-1 ${
                      owned ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/40 border-white/5 opacity-60'
                    }`}>
                      <img 
                        src={`/icons/${char.images.iron}`} 
                        alt={owned ? char.name : '???'} 
                        className={`w-12 h-12 rounded-lg object-cover ${!owned ? 'grayscale brightness-0' : ''}`} 
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-bold truncate ${owned ? 'text-white' : 'text-white/20'}`}>{owned ? char.name : '???'}</div>
                        <div className="flex gap-1 mt-1">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border ${
                            !owned ? 'bg-white/5 text-white/10 border-white/10' :
                            char.rarity === 'common' ? 'bg-[#9E9E9E]/15 text-[#9E9E9E] border-[#9E9E9E]/30' :
                            char.rarity === 'rare' ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
                            char.rarity === 'epic' ? 'bg-[#9B59B6]/15 text-[#9B59B6] border-[#9B59B6]/30' :
                            char.rarity === 'legendary' ? 'bg-[#FF9800]/15 text-[#FF9800] border-[#FF9800]/30' : 'bg-[#E91E63]/15 text-[#E91E63] border-[#E91E63]/30'
                          }`}>{owned ? char.rarity : '???'}</span>
                        </div>
                      </div>
                      <div className="text-xs font-black text-white/35">{calcHiddenScore(char.id, 'iron', data).toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Roll Modal */}
      <AnimatePresence>
        {rollingPack && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[10000] flex items-center justify-center p-5 overflow-hidden"
          >
            <div className="relative w-full max-w-lg aspect-[3/4] flex items-center justify-center">
              {/* Background Effects */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  animate={{ 
                    scale: isRolling ? [1, 1.5, 1.2] : [1, 1.1, 1],
                    rotate: isRolling ? [0, 180, 360] : 0,
                    opacity: isRolling ? [0.2, 0.5, 0.2] : 0.1
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(159,211,86,0.3)_0%,transparent_70%)] rounded-full blur-3xl"
                />
              </div>

              {/* The Card */}
              <motion.div 
                animate={isRolling ? {
                  y: [0, -20, 0],
                  scale: [1, 1.05, 1],
                  rotateY: [0, 360, 720, 1080],
                } : {}}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="relative w-64 h-96 preserve-3d"
              >
                <AnimatePresence mode="wait">
                  {!showRollResult ? (
                    <motion.div 
                      key="back"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, rotateY: 90 }}
                      className="absolute inset-0 rounded-2xl border-4 border-[#9FD356] shadow-[0_0_40px_rgba(159,211,86,0.4)] overflow-hidden bg-[#161b22]"
                    >
                      <img src="/icons/cardBack.png" alt="Card Back" className="w-full h-full object-cover" />
                      {isRolling && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#9FD356]/40 to-transparent animate-pulse"></div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="front"
                      initial={{ opacity: 0, rotateY: -90 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      className="absolute inset-0 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.2)]"
                      style={{
                        backgroundColor: (data.cardConfig.degrees as any).iron.border,
                        border: `4px solid ${(data.cardConfig.degrees as any).iron.border}`,
                        boxShadow: rollResult?.rarity === 'legendary' ? '0 0 60px #FF9800' : 
                                   rollResult?.rarity === 'epic' ? '0 0 60px #9B59B6' :
                                   rollResult?.rarity === 'rare' ? '0 0 60px #4A90E2' : '0 0 40px rgba(255,255,255,0.2)'
                      }}
                    >
                      <div className="absolute inset-1 rounded-xl overflow-hidden" style={{ bottom: '40px' }}>
                        <img src={`/icons/${rollResult?.character.images.iron}`} alt={rollResult?.character.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        
                        {/* Rarity Effect */}
                        {rollResult?.rarity === 'legendary' && (
                          <motion.div 
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,152,0,0.3)_0%,transparent_70%)]"
                          />
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-10 flex flex-col items-center justify-center px-2" style={{ backgroundColor: (data.cardConfig.degrees as any).iron.border }}>
                        <div className="text-xs font-black text-white truncate w-full text-center">{rollResult?.character.name}</div>
                        <div className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: rollResult?.rarity === 'legendary' ? '#FF9800' : rollResult?.rarity === 'epic' ? '#9B59B6' : rollResult?.rarity === 'rare' ? '#4A90E2' : '#9E9E9E' }}>{rollResult?.rarity}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Action Buttons */}
              {showRollResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-24 left-0 right-0 flex flex-col items-center gap-4"
                >
                  <div className="text-center">
                    <h4 className="text-2xl font-black text-white mb-1">You got {rollResult?.character.name}!</h4>
                    <p className="text-white/50 text-sm uppercase tracking-widest">{rollResult?.rarity} Rarity</p>
                  </div>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleRoll(rollingPack)}
                      className="px-8 py-3 bg-[#9FD356] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:bg-[#8B6F47]"
                    >
                      Roll Again
                    </button>
                    <button 
                      onClick={() => {
                        setRollingPack(null);
                        setShowRollResult(false);
                      }}
                      className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all hover:bg-white/20"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
