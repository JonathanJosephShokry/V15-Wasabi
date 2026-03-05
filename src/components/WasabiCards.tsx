import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { WasabiData, Character, Member, CollectionEntry, CardPack } from '../types';
import { ArrowLeft, X, Trophy, BookOpen, Package } from 'lucide-react';
import { calcHiddenScore, getMemberTotalScore, formatRarity, formatDegree, getCurrentCardPackSeason } from '../utils';

interface WasabiCardsProps {
  data: WasabiData;
}

export const WasabiCards: React.FC<WasabiCardsProps> = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get('view') || 'packs');
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);

  useEffect(() => {
    setSearchParams({ view });
  }, [view, setSearchParams]);

  const now = new Date("2026-03-03T13:53:28-08:00");
  const currentSeason = getCurrentCardPackSeason(data, now);

  // Use the actual packs from data.json
  const visiblePacks = data.packs;

  const renderPacks = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {visiblePacks.map((pack, i) => {
        const chars = pack.outcomes.map(o => data.characters.find(c => c.id === o.characterId)).filter(Boolean) as Character[];
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
              <div className="text-xl font-black text-white">{pack.name}</div>
              <div className="bg-[#9FD356]/20 border border-[#9FD356]/40 text-[#9FD356] px-3.5 py-1 rounded-full text-xs font-bold">Pack Score: {pack.score}</div>
            </div>
            <div className="p-6 space-y-2.5">
              {visible.map(char => (
                <div key={char.id} className="flex items-center gap-3.5 p-3 bg-white/5 border-2 border-transparent rounded-xl transition-all hover:translate-x-1 hover:bg-white/10">
                  <img src={`/icons/${char.images.iron}`} alt={char.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{char.name}</div>
                    <div className="flex gap-1 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border ${
                        char.rarity === 'common' ? 'bg-[#9E9E9E]/15 text-[#9E9E9E] border-[#9E9E9E]/30' :
                        char.rarity === 'rare' ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
                        char.rarity === 'epic' ? 'bg-[#9B59B6]/15 text-[#9B59B6] border-[#9B59B6]/30' :
                        char.rarity === 'legendary' ? 'bg-[#FF9800]/15 text-[#FF9800] border-[#FF9800]/30' : 'bg-[#E91E63]/15 text-[#E91E63] border-[#E91E63]/30'
                      }`}>{char.rarity}</span>
                    </div>
                  </div>
                  <div className="text-xs font-black text-white/35">{calcHiddenScore(char.id, 'iron', data).toLocaleString()}</div>
                </div>
              ))}
              {hidden.length > 0 && (
                <div 
                  onClick={() => setSelectedPackId(pack.packageId)}
                  className="flex items-center gap-4 p-3 bg-[#9FD356]/10 border-2 border-[#9FD356]/35 rounded-xl cursor-pointer transition-all hover:bg-[#9FD356]/20 hover:border-[#9FD356]/70 hover:translate-x-1"
                >
                  <div className="flex items-center flex-shrink-0">
                    {hidden.slice(0, 3).map((char, j) => (
                      <img key={char.id} src={`/icons/${char.images.iron}`} alt={char.name} className={`w-8 h-8 rounded-lg object-cover border-2 border-[#0d1117] transition-transform hover:scale-110 ${j > 0 ? '-ml-2.5' : ''}`} />
                    ))}
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
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
                return (
                  <div key={id} className="flex items-center gap-3.5 p-3 bg-white/5 border-2 border-white/10 rounded-xl transition-all hover:translate-x-1 hover:bg-white/10">
                    <img src={`/icons/${char.images.iron}`} alt={char.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{char.name}</div>
                      <div className="flex gap-1 mt-1">
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border ${
                          char.rarity === 'common' ? 'bg-[#9E9E9E]/15 text-[#9E9E9E] border-[#9E9E9E]/30' :
                          char.rarity === 'rare' ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
                          char.rarity === 'epic' ? 'bg-[#9B59B6]/15 text-[#9B59B6] border-[#9B59B6]/30' :
                          char.rarity === 'legendary' ? 'bg-[#FF9800]/15 text-[#FF9800] border-[#FF9800]/30' : 'bg-[#E91E63]/15 text-[#E91E63] border-[#E91E63]/30'
                        }`}>{char.rarity}</span>
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
          const rank = ranked.filter(e => e.score > entry.score).length + 1;
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
            <div className="text-center">
              <h2 className="text-4xl font-black mb-2">Card Packs</h2>
              <p className="text-white/45">All packs give Iron degree cards. Combine duplicates to upgrade!</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 overflow-x-auto">
              <div className="flex items-center gap-2 flex-wrap justify-center min-w-max">
                {['iron','bronze','silver','pearl','gold','jade','sapphire','ruby','emerald','diamond'].map((deg, i, arr) => (
                  <React.Fragment key={deg}>
                    <span className="px-3.5 py-1.5 rounded-full text-[10px] font-bold border-2" style={{ 
                      color: data.cardConfig.degrees[deg].color, 
                      borderColor: data.cardConfig.degrees[deg].border,
                      backgroundColor: `${data.cardConfig.degrees[deg].color}25`
                    }}>{formatDegree(deg)}</span>
                    {i < arr.length - 1 && <span className="text-white/35 text-[10px] font-bold">×2→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
            {renderPacks()}
          </div>
        )}

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
                {data.characters.filter(c => c.packageId === selectedPackId).map(char => (
                  <div key={char.id} className="flex items-center gap-3.5 p-3 bg-white/5 border-2 border-white/10 rounded-xl transition-all hover:translate-x-1 hover:bg-white/10">
                    <img src={`/icons/${char.images.iron}`} alt={char.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white truncate">{char.name}</div>
                      <div className="flex gap-1 mt-1">
                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-bold uppercase tracking-wider border ${
                          char.rarity === 'common' ? 'bg-[#9E9E9E]/15 text-[#9E9E9E] border-[#9E9E9E]/30' :
                          char.rarity === 'rare' ? 'bg-[#4A90E2]/15 text-[#4A90E2] border-[#4A90E2]/30' :
                          char.rarity === 'epic' ? 'bg-[#9B59B6]/15 text-[#9B59B6] border-[#9B59B6]/30' :
                          char.rarity === 'legendary' ? 'bg-[#FF9800]/15 text-[#FF9800] border-[#FF9800]/30' : 'bg-[#E91E63]/15 text-[#E91E63] border-[#E91E63]/30'
                        }`}>{char.rarity}</span>
                      </div>
                    </div>
                    <div className="text-xs font-black text-white/35">{calcHiddenScore(char.id, 'iron', data).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
