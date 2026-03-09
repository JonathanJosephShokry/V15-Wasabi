import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { WasabiData, Team, Member, CraftingRecipe } from '../types';
import { ArrowRight, Trophy as TrophyIcon, Medal, Clock, Plus, Zap, ExternalLink } from 'lucide-react';
import { getActiveSportEvent, getLastFinishedSportEvent, getActiveCraftingRecipes, calculateDaysRemaining, getCurrentCardPackSeason } from '../utils';

interface HomeProps {
  data: WasabiData;
}

export const Home: React.FC<HomeProps> = ({ data }) => {
  const now = new Date("2026-03-03T13:53:28-08:00");
  const activeSport = getActiveSportEvent(data, now);
  const lastSport = getLastFinishedSportEvent(data, now);
  const currentSeason = getCurrentCardPackSeason(data, now);

  const calcTeamCollectionCount = (teamId: string) => {
    const members = data.members.filter(m => m.teamId === teamId);
    const uniqueIds = new Set();
    members.forEach(m => {
      m.collection.forEach(entry => {
        uniqueIds.add(entry.characterId);
      });
    });
    return uniqueIds.size;
  };

  const sportLeaderboard = [...data.members]
    .filter(m => (m.sportEventScore || 0) > 0)
    .sort((a, b) => (b.sportEventScore || 0) - (a.sportEventScore || 0))
    .slice(0, 10);

  // Merged events+seasons: filter events to only those whose pack is in current season
  const visibleEvents = currentSeason
    ? data.packs.filter(pack => {
        const eventPackIds = new Set(
          pack.outcomes
            .map((o: any) => data.characters.find((c: any) => c.id === o.characterId)?.packageId)
            .filter(Boolean)
        );
        return [...eventPackIds].some(pid => currentSeason.packsVisible.includes(pid as string));
      })
    : data.packs;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#6B5435] via-[#8B6F47] to-[#9FD356] min-h-[60vh] flex items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,rgba(159,211,86,0.25)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="container mx-auto px-5">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-6xl md:text-8xl font-bold text-white mb-5 tracking-widest drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
          >
            Wasabi
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="text-xl md:text-2xl text-white/90 font-light tracking-wide"
          >
            Transform discipline into growth. Build skills that last.
          </motion.p>
        </div>
      </section>

      {/* 1. About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-[#6B5435] text-center mb-10">About Wasabi</h2>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-[#666666] mb-10">
              Wasabi is a system designed to transform mindsets and behaviors through structured accountability and measurable progress.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Discipline', 'Long-term Thinking', 'Skill Building', 'Execution Over Comfort', 'High Delayer Mindset', 'Producer Mindset'].map(area => (
                <span key={area} className="bg-[#9FD356] text-white px-6 py-3 rounded-full font-semibold transition-all hover:bg-[#8B6F47] hover:-translate-y-0.5">
                  {area}
                </span>
              ))}
            </div>
            <div className="mt-10">
              <Link to="/about" className="text-[#9FD356] font-bold hover:underline">Learn more about the Wasabi System →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Teams Section */}
      <section className="py-20 bg-[#FAFAFA]">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-[#6B5435] text-center mb-10">Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.teams.map((team: any, i: number) => {
              const members = data.members.filter((m: any) => m.teamId === team.id);
              const collectionCount = calcTeamCollectionCount(team.id);
              return (
                <Link key={team.id} to={`/team/${team.id}`} className="block group">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border-2 border-[#E0E0E0] rounded-[22px] p-8 cursor-pointer transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-[#C8E6A0] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9FD356] to-[#8B6F47] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="text-2xl font-extrabold text-[#6B5435] tracking-tight">{team.name}</div>
                      <ArrowRight className="text-[#9FD356] transition-transform group-hover:translate-x-1.5" />
                    </div>
                    <div className="flex items-center gap-1.5 mb-6 flex-wrap">
                      {members.slice(0, 5).map((m: any) => (
                        <img key={m.id} src={`/icons/${m.icon}`} alt={m.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md transition-all hover:scale-110 hover:-translate-y-0.5 hover:z-10 bg-[#C8E6A0]" title={m.name} />
                      ))}
                      {members.length > 5 && (
                        <div className="w-12 h-12 rounded-full bg-[#8B6F47] text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-md">+{members.length - 5}</div>
                      )}
                    </div>
                    <div className="flex items-center pt-5 border-t-2 border-[#E0E0E0]">
                      <div className="flex-1 text-center flex flex-col gap-1">
                        <span className="text-2xl font-extrabold text-[#6B5435]">{members.length}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#666666]">Members</span>
                      </div>
                      <div className="w-px h-10 bg-[#E0E0E0]"></div>
                      <div className="flex-1 text-center flex flex-col gap-1">
                        <span className="text-2xl font-extrabold text-[#6B5435]">{collectionCount}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#666666]">Collection</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Wasabi Sports Section */}
      <section className="py-20 bg-[#FAFAFA] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_60%,rgba(159,211,86,0.12)_0%,transparent_50%),radial-gradient(ellipse_at_80%_30%,rgba(185,242,255,0.08)_0%,transparent_50%)] pointer-events-none"></div>
        <div className="container mx-auto px-5">
          <div className="text-center mb-12 relative">
            <div className="text-6xl mb-4 drop-shadow-[0_0_16px_rgba(159,211,86,0.4)]">🃏</div>
            <h2 className="text-5xl font-black text-white mb-4 tracking-widest drop-shadow-[0_0_24px_rgba(159,211,86,0.3)]">Wasabi Cards</h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">Collect powerful cards, combine duplicates to upgrade degrees, and climb the leaderboard.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto relative">
            <Link to="/cards?view=packs" className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl text-white/80 transition-all hover:border-[#9FD356]/60 hover:text-[#9FD356] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(159,211,86,0.2)] group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9FD356]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-3xl shrink-0">🎴</span>
              <span className="flex-1 font-bold text-lg">Card Packs</span>
              <ArrowRight className="opacity-40 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
            </Link>
            <Link to="/cards?view=all" className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl text-white/80 transition-all hover:border-[#9FD356]/60 hover:text-[#9FD356] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(159,211,86,0.2)] group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#9FD356]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-3xl shrink-0">📚</span>
              <span className="flex-1 font-bold text-lg">All Cards</span>
              <ArrowRight className="opacity-40 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
            </Link>
            <Link to="/cards?view=leaderboard" className="flex items-center gap-4 p-6 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl text-white/80 transition-all hover:border-[#D4AF37]/70 hover:text-[#D4AF37] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(212,175,55,0.25)] group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-3xl shrink-0">🏆</span>
              <span className="flex-1 font-bold text-lg">Global Leaderboard</span>
              <ArrowRight className="opacity-40 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Wasabi Sports Section */}
      <section className="py-20 bg-[#FAFAFA] relative overflow-hidden">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-5xl font-black text-[#6B5435] mb-4 tracking-tight">Wasabi Sports</h2>
            <p className="text-[#666666] text-lg max-w-xl mx-auto">Compete globally across all teams. One active sport per season.</p>
          </div>

          {activeSport ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#6B5435] to-[#8B6F47] p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden mb-10">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrophyIcon size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-block bg-[#9FD356] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">Active Event</div>
                    <h3 className="text-4xl font-black mb-4">{activeSport.name}</h3>
                    <p className="text-white/80 text-lg mb-8 max-w-lg">{activeSport.description}</p>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex flex-col">
                        <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Ends On</span>
                        <span className="text-xl font-bold">{new Date(activeSport.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Scoring Type</span>
                        <span className="text-xl font-bold capitalize">{activeSport.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#E0E0E0] rounded-3xl p-8">
                  <h4 className="text-2xl font-bold text-[#6B5435] mb-8 flex items-center gap-3">
                    <TrophyIcon className="text-[#9FD356]" /> Global Leaderboard (Top 10)
                  </h4>
                  <div className="space-y-3">
                    {sportLeaderboard.length > 0 ? (
                      sportLeaderboard.map((m: any, i: number) => (
                        <Link key={m.id} to={`/member/${m.id}`} className="flex items-center gap-4 p-4 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-2xl transition-all hover:border-[#9FD356] hover:translate-x-1 group">
                          <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${
                            i === 0 ? 'bg-yellow-500 text-white' :
                            i === 1 ? 'bg-gray-400 text-white' :
                            i === 2 ? 'bg-orange-400 text-white' : 'bg-[#E0E0E0] text-[#666666]'
                          }`}>
                            {i + 1}
                          </div>
                          <img src={`/icons/${m.icon}`} alt={m.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                          <div className="flex-1 font-bold text-[#6B5435] group-hover:text-[#9FD356]">{m.name}</div>
                          <div className="text-right">
                            <div className="text-xl font-black text-[#6B5435]">{m.sportEventScore}</div>
                            <div className="text-[10px] font-bold text-[#666666] uppercase tracking-widest">{activeSport.type === 'distance' ? 'km' : 'pts'}</div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-10 text-[#666666] italic">No scores submitted yet for this event.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {lastSport && (
                  <div className="bg-white border-2 border-[#E0E0E0] rounded-3xl p-8 shadow-sm">
                    <h4 className="text-xl font-bold text-[#6B5435] mb-6 flex items-center gap-2">
                      <Medal className="text-yellow-500" /> Last Event Champions
                    </h4>
                    <div className="text-xs text-[#666666] mb-4 font-bold uppercase tracking-widest">{lastSport.name}</div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <span className="text-2xl">🥇</span>
                        <div className="flex-1 font-bold text-[#6B5435]">...</div>
                        <div className="text-xs font-black text-yellow-600">#1</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <span className="text-2xl">🥈</span>
                        <div className="flex-1 font-bold text-[#6B5435]">...</div>
                        <div className="text-xs font-black text-gray-500">#2</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                        <span className="text-2xl">🥉</span>
                        <div className="flex-1 font-bold text-[#6B5435]">...</div>
                        <div className="text-xs font-black text-orange-600">#3</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#9FD356]/10 border-2 border-[#9FD356]/30 rounded-3xl p-8">
                  <h4 className="text-lg font-bold text-[#6B5435] mb-4">How to participate?</h4>
                  <ul className="space-y-3 text-sm text-[#666666] leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-[#9FD356] font-black">1.</span>
                      <span>Track your activity using any fitness app.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#9FD356] font-black">2.</span>
                      <span>Submit proof to your Team Leader.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#9FD356] font-black">3.</span>
                      <span>Leader updates your global sport score.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-[#E0E0E0] rounded-3xl p-20 text-center">
              <div className="text-4xl mb-4">⌛</div>
              <h3 className="text-2xl font-bold text-[#6B5435] mb-2">No Active Sport Event</h3>
              <p className="text-[#666666]">Check back soon for the next challenge!</p>
            </div>
          )}
        </div>
      </section>

      {/* 7. Wasabi Sports Section */}
      <section className="py-20 bg-[#FAFAFA] relative overflow-hidden">
        <div className="container mx-auto px-5">
          <div className="text-center mb-16">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-5xl font-black text-[#6B5435] mb-4 tracking-tight">Wasabi Sports</h2>
            <p className="text-[#666666] text-lg max-w-xl mx-auto">Compete globally across all teams. One active sport per season.</p>
          </div>

          {activeSport ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="bg-gradient-to-br from-[#6B5435] to-[#8B6F47] p-10 rounded-3xl text-white shadow-2xl relative overflow-hidden mb-10">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrophyIcon size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="inline-block bg-[#9FD356] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">Active Event</div>
                    <h3 className="text-4xl font-black mb-4">{activeSport.name}</h3>
                    <p className="text-white/80 text-lg mb-8 max-w-lg">{activeSport.description}</p>
                    <div className="flex flex-wrap gap-6">
                      <div className="flex flex-col">
                        <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Ends On</span>
                        <span className="text-xl font-bold">{new Date(activeSport.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">Scoring Type</span>
                        <span className="text-xl font-bold capitalize">{activeSport.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border-2 border-[#E0E0E0] rounded-3xl p-8">
                  <h4 className="text-2xl font-bold text-[#6B5435] mb-8 flex items-center gap-3">
                    <TrophyIcon className="text-[#9FD356]" /> Global Leaderboard (Top 10)
                  </h4>
                  <div className="space-y-3">
                    {sportLeaderboard.length > 0 ? (
                      sportLeaderboard.map((m: any, i: number) => (
                        <Link key={m.id} to={`/member/${m.id}`} className="flex items-center gap-4 p-4 bg-[#FAFAFA] border-2 border-[#E0E0E0] rounded-2xl transition-all hover:border-[#9FD356] hover:translate-x-1 group">
                          <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${
                            i === 0 ? 'bg-yellow-500 text-white' :
                            i === 1 ? 'bg-gray-400 text-white' :
                            i === 2 ? 'bg-orange-400 text-white' : 'bg-[#E0E0E0] text-[#666666]'
                          }`}>
                            {i + 1}
                          </div>
                          <img src={`/icons/${m.icon}`} alt={m.name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                          <div className="flex-1 font-bold text-[#6B5435] group-hover:text-[#9FD356]">{m.name}</div>
                          <div className="text-right">
                            <div className="text-xl font-black text-[#6B5435]">{m.sportEventScore}</div>
                            <div className="text-[10px] font-bold text-[#666666] uppercase tracking-widest">{activeSport.type === 'distance' ? 'km' : 'pts'}</div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-10 text-[#666666] italic">No scores submitted yet for this event.</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                {lastSport && (
                  <div className="bg-white border-2 border-[#E0E0E0] rounded-3xl p-8 shadow-sm">
                    <h4 className="text-xl font-bold text-[#6B5435] mb-6 flex items-center gap-2">
                      <Medal className="text-yellow-500" /> Last Event Champions
                    </h4>
                    <div className="text-xs text-[#666666] mb-4 font-bold uppercase tracking-widest">{lastSport.name}</div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <span className="text-2xl">🥇</span>
                        <div className="flex-1 font-bold text-[#6B5435]">...</div>
                        <div className="text-xs font-black text-yellow-600">#1</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                        <span className="text-2xl">🥈</span>
                        <div className="flex-1 font-bold text-[#6B5435]">...</div>
                        <div className="text-xs font-black text-gray-500">#2</div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl">
                        <span className="text-2xl">🥉</span>
                        <div className="flex-1 font-bold text-[#6B5435]">...</div>
                        <div className="text-xs font-black text-orange-600">#3</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-[#9FD356]/10 border-2 border-[#9FD356]/30 rounded-3xl p-8">
                  <h4 className="text-lg font-bold text-[#6B5435] mb-4">How to participate?</h4>
                  <ul className="space-y-3 text-sm text-[#666666] leading-relaxed">
                    <li className="flex gap-2">
                      <span className="text-[#9FD356] font-black">1.</span>
                      <span>Track your activity using any fitness app.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#9FD356] font-black">2.</span>
                      <span>Submit proof to your Team Leader.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#9FD356] font-black">3.</span>
                      <span>Leader updates your global sport score.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-[#E0E0E0] rounded-3xl p-20 text-center">
              <div className="text-4xl mb-4">⌛</div>
              <h3 className="text-2xl font-bold text-[#6B5435] mb-2">No Active Sport Event</h3>
              <p className="text-[#666666]">Check back soon for the next challenge!</p>
            </div>
          )}
        </div>
      </section>

      {/* 8. Wasabi Training Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-[#6B5435] text-center mb-10">Wasabi Training</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.trainings.slice(0, 2).map((t: any, i: number) => (
              <div key={i} className="bg-white border-2 border-[#E0E0E0] rounded-2xl p-8 text-center transition-all hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E8631A] to-[#9FD356] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FDDDC7] to-[#E8631A]/15 flex items-center justify-center mx-auto mb-5 text-3xl border-2 border-[#E8631A]/25 transition-all group-hover:border-[#E8631A]">
                  {t.name.toLowerCase().includes('python') ? '🐍' : t.name.toLowerCase().includes('chess') ? '♟️' : t.name.toLowerCase().includes('language') ? '📖' : t.name.toLowerCase().includes('drums') ? '🥁' : t.name.toLowerCase().includes('singing') ? '🎤' : '⚡'}
                </div>
                <div className="text-xl font-bold text-[#6B5435] mb-2">{t.name}</div>
                {t.providedBy && (
                  <div className="text-[10px] text-[#666666]/60 font-semibold uppercase tracking-wider mb-2">
                    {t.name.toLowerCase().includes('singing') || t.name.toLowerCase().includes('drums') || t.name.toLowerCase().includes('language') ? 'Course provided by ' : 'Powered by '}{t.providedBy}
                  </div>
                )}
                <p className="text-sm text-[#666666] mb-6 leading-relaxed">{t.description}</p>
                <div className="flex flex-col gap-3 items-center">
                  <div className="flex flex-wrap justify-center gap-3">
                    {t.spice_price > 0 && (
                      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#E8631A]/10 text-[#E8631A] border-2 border-[#E8631A]/25 rounded-full font-bold text-sm">
                        <img src="/icons/spice-icon.png" alt="Spice" className="w-4 h-4" />
                        <span>{t.spice_price} Spice</span>
                      </div>
                    )}
                    {t.wabi_price && t.wabi_price > 0 && (
                      <div className="flex items-center gap-1.5 px-4 py-1.5 bg-[#9FD356]/10 text-[#9FD356] border-2 border-[#9FD356]/25 rounded-full font-bold text-sm">
                        <img src="/icons/wabi-icon.png" alt="Wabi" className="w-4 h-4" />
                        <span>{t.wabi_price} Wabi</span>
                      </div>
                    )}
                  </div>
                  {t.pdf_link && (
                    <a
                      href={t.pdf_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center gap-2 bg-[#6B5435] text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all hover:bg-[#8B6F47] hover:shadow-lg active:scale-95"
                    >
                      <ExternalLink size={16} />
                      Open Training PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
            {/* Show More Button */}
            <Link to="/training" className="bg-[#FAFAFA] border-2 border-dashed border-[#E0E0E0] rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all hover:border-[#9FD356] hover:bg-[#9FD356]/5 group">
              <div className="w-16 h-16 rounded-full bg-[#E0E0E0] flex items-center justify-center mb-4 group-hover:bg-[#9FD356] group-hover:text-white transition-all">
                <Plus size={32} />
              </div>
              <div className="text-xl font-bold text-[#6B5435]">Show More</div>
              <p className="text-sm text-[#666666] mt-2">View all available training courses</p>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Spice Deals Section */}
      <section className="py-20 bg-gradient-to-br from-[#FAFAFA] to-[#FDDDC7] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(232,99,26,0.08)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="container mx-auto px-5">
          <h2 className="text-4xl font-bold text-[#6B5435] text-center mb-10">Spice Deals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {data.spiceDeals.map((deal: any, i: number) => (
              <div key={i} className={`bg-white border-2 rounded-[22px] p-10 text-center transition-all hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden ${deal.highlight ? 'border-[#E8631A] bg-gradient-to-br from-white via-white to-[#FDDDC7] shadow-[0_6px_24px_rgba(232,99,26,0.18)]' : 'border-[#E0E0E0]'}`}>
                {deal.highlight && (
                  <div className="absolute top-3.5 -right-5.5 bg-[#E8631A] text-white text-[10px] font-extrabold uppercase tracking-widest px-8 py-1.5 rotate-[35deg] shadow-[0_2px_8px_rgba(232,99,26,0.4)]">Best Value</div>
                )}
                <div className="flex items-center justify-center gap-2.5 text-5xl font-extrabold text-[#E8631A] mb-2 transition-all hover:scale-105">
                  <img src="/icons/spice-icon.png" alt="Spice" className="w-12 h-12" />
                  <span>{deal.spice}</span>
                </div>
                <div className="text-base text-[#666666] font-semibold mb-5 tracking-wide">Spice</div>
                <div className={`inline-block px-7 py-3 rounded-full text-xl font-extrabold tracking-wide transition-all shadow-md ${deal.highlight ? 'bg-gradient-to-br from-[#E8631A] to-[#c0430e] text-white shadow-[0_4px_16px_rgba(232,99,26,0.4)]' : 'bg-[#E8631A] text-white hover:bg-[#6B5435] hover:shadow-lg'}`}>
                  {deal.egp} EGP
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};
