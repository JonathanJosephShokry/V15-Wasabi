import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { WasabiData, Team, Member, Project } from '../types';
import { ArrowLeft, Info } from 'lucide-react';
import { calculateLevel, calculateExpProgress } from '../utils';

interface TeamPageProps {
  data: WasabiData;
}

export const TeamPage: React.FC<TeamPageProps> = ({ data }) => {
  const { teamId } = useParams<{ teamId: string }>();
  const team = data.teams.find(t => t.id === teamId);

  if (!team) return <div className="p-20 text-center">Team not found</div>;

  const members = data.members.filter(m => m.teamId === teamId);
  const projects = data.projects.filter(p => p.teamId === teamId);
  const activeProjects = projects.filter(p => p.active);
  const inactiveProjects = projects.filter(p => !p.active);
  const tssItems = data.tss.filter(t => t.teamId === teamId);

  const calcTeamCollectionCount = () => {
    const uniqueIds = new Set();
    members.forEach(m => {
      m.collection.forEach(entry => {
        uniqueIds.add(entry.characterId);
      });
    });
    return uniqueIds.size;
  };

  const isMemberRestricted = (member: Member) => {
    if (!member.restricted) return false;
    if (!member.restrictedUntil) return member.restricted;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const until = new Date(member.restrictedUntil + 'T00:00:00');
    return today <= until;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#FAFAFA] min-h-screen pb-20">
      <div className="bg-white border-b-2 border-[#E0E0E0] p-5">
        <Link to="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#9FD356] text-white no-underline rounded-lg font-semibold transition-all hover:bg-[#8B6F47] hover:-translate-x-1">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      {/* Team Hero */}
      <section className="bg-gradient-to-br from-[#6B5435] via-[#8B6F47] to-[#9FD356] py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(159,211,86,0.2)_0%,transparent_60%)] pointer-events-none"></div>
        <div className="container mx-auto px-5">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-widest drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)] mb-8">{team.name}</h1>
          <div className="inline-flex items-center bg-white/15 backdrop-blur-md rounded-[22px] py-4 px-10 border border-white/25">
            <div className="px-7 text-center">
              <div className="text-3xl font-extrabold text-white leading-none">{members.length}</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/70 mt-1">Members</div>
            </div>
            <div className="w-px h-10 bg-white/30"></div>
            <div className="px-7 text-center">
              <div className="text-3xl font-extrabold text-white leading-none">{calcTeamCollectionCount()}</div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/70 mt-1">Collection</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-5">
        {/* Trading Rules Info Box (Update 7) */}
        <div className="mt-10 bg-white border-2 border-[#9FD356]/30 rounded-xl p-6 flex items-start gap-4 shadow-sm">
          <div className="bg-[#9FD356]/10 p-2 rounded-full text-[#9FD356]">
            <Info size={24} />
          </div>
          <div>
            <h3 className="font-bold text-[#6B5435] mb-1">Trading Rules</h3>
            <p className="text-[#666666] text-sm leading-relaxed">
              Trading currency and cards is allowed only with the acceptance of the Team Leader.
            </p>
          </div>
        </div>

        {/* Active Projects Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-[#6B5435] mb-2 flex items-center gap-3">
            <span className="text-2xl">🚀</span> Active Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {activeProjects.map((project, i) => (
              <Link key={project.id} to={`/project/${project.id}`} className="block group">
                <div className="bg-white p-6 rounded-xl border-2 border-[#E0E0E0] transition-all hover:-translate-y-1 hover:shadow-xl hover:border-[#C8E6A0]">
                  <div className="text-2xl font-bold text-[#6B5435] mb-2">{project.name}</div>
                  <p className="text-sm text-[#666666] mb-5 line-clamp-2 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.members.map(name => {
                      const m = data.members.find(x => x.name === name);
                      if (!m) return null;
                      const restricted = isMemberRestricted(m);
                      const isPM = project.projectManagerId === m.id;
                      return (
                        <div key={m.id} className="relative">
                          <img 
                            src={`/icons/${m.icon}`} 
                            alt={name} 
                            className={`w-11 h-11 rounded-full object-cover border-2 transition-all hover:scale-110 ${
                              isPM ? 'border-[#E8631A] ring-2 ring-[#E8631A]/20' : restricted ? 'grayscale opacity-75 border-red-400' : 'border-[#9FD356]'
                            }`}
                            title={name + (isPM ? ' (Project Manager)' : restricted ? ' (Restricted)' : '')}
                          />
                          {isPM && (
                            <div className="absolute -top-1 -right-1 bg-[#E8631A] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-sm">PM</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Inactive Projects Section (Update 3) */}
        {inactiveProjects.length > 0 && (
          <section className="mt-16 max-w-2xl">
            <h2 className="text-2xl font-bold text-[#6B5435]/60 mb-2 flex items-center gap-3">
              <span className="text-xl">📁</span> Inactive Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {inactiveProjects.map((project) => (
                <div key={project.id} className="bg-white/60 p-5 rounded-xl border-2 border-[#E0E0E0] opacity-70 transition-all hover:opacity-100">
                  <div className="text-lg font-bold text-[#6B5435] mb-1">{project.name}</div>
                  <p className="text-xs text-[#666666] line-clamp-1 italic">Project is currently disabled</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Members Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-[#6B5435] mb-2 flex items-center gap-3">
            <span className="text-2xl">👥</span> Members
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {members.sort((a, b) => {
              if (a.role === 'leader' && b.role !== 'leader') return -1;
              if (a.role !== 'leader' && b.role === 'leader') return 1;
              return a.name.localeCompare(b.name);
            }).map((member, i) => {
              const level = calculateLevel(member.exp);
              const expProg = calculateExpProgress(member.exp);
              const restricted = isMemberRestricted(member);
              const isLeader = member.role === 'leader';
              return (
                <Link key={member.id} to={`/member/${member.id}`} className="block">
                  <div className={`bg-white p-7 rounded-xl text-center border-2 transition-all hover:-translate-y-1.5 hover:shadow-xl relative group ${
                    isLeader ? 'border-[#F59E0B]/55 bg-gradient-to-br from-[#F59E0B]/5 to-transparent shadow-md' : 'border-[#E0E0E0]'
                  } ${restricted ? 'border-red-400/40 bg-gradient-to-br from-red-50 to-transparent' : ''}`}>
                    <div className="relative inline-block mb-4">
                      <img src={`/icons/${member.icon}`} alt={member.name} className={`w-24 h-24 rounded-full object-cover border-4 transition-all group-hover:scale-105 ${
                        isLeader ? 'border-[#F59E0B]' : 'border-[#9FD356]'
                      } ${restricted ? 'grayscale opacity-75' : ''}`} />
                      {restricted && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
                    </div>
                    <div className="text-lg font-bold text-[#6B5435] mb-1.5 flex items-center justify-center gap-2">
                      {member.name}
                      {restricted && <span className="text-sm" title="Restricted">⚠️</span>}
                    </div>
                    {isLeader && <span className="inline-block bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] text-[#1a1a1a] font-extrabold px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider mb-2 shadow-sm">Leader</span>}
                    <div className="text-sm text-[#666666] mb-3.5">Level {level}</div>
                    <div className="bg-[#E0E0E0] rounded-full h-2 mb-4 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${expProg}%` }} transition={{ duration: 1.2 }} className="h-full bg-gradient-to-r from-[#9FD356] to-[#8B6F47]"></motion.div>
                    </div>
                    <div className="flex justify-center gap-3.5">
                      <div className="flex items-center gap-1 text-sm font-bold text-[#9FD356] bg-[#9FD356]/10 px-2.5 py-1 rounded-full">
                        <img src="/icons/wabi-icon.png" alt="Wabi" className="w-4 h-4" />
                        <span>{member.wabi}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-bold text-[#E8631A] bg-[#E8631A]/10 px-2.5 py-1 rounded-full">
                        <img src="/icons/spice-icon.png" alt="Spice" className="w-4 h-4" />
                        <span>{member.spice}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Team Shop Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-[#6B5435] mb-2 flex items-center gap-3">
            <span className="text-2xl">🛍</span> Team Shop
          </h2>
          <p className="text-[#666666] text-sm mb-8">Exclusive items for this team — purchased with Wabi</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {tssItems.map((item, i) => (
              <div key={item.id} className="bg-white border-2 border-[#E0E0E0] rounded-xl overflow-hidden transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-[#C8E6A0] group">
                <div className="h-44 bg-gradient-to-br from-[#C8E6A0] to-[#9FD356] overflow-hidden flex items-center justify-center relative">
                  <img src={`/icons/${item.image}`} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <div className="text-lg font-bold text-[#6B5435] mb-2">{item.name}</div>
                  <p className="text-xs text-[#666666] mb-5 leading-relaxed line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-xl font-extrabold text-[#9FD356]">
                      <img src="/icons/wabi-icon.png" alt="Wabi" className="w-5 h-5" />
                      <span>{item.wabiCost}</span>
                    </div>
                    <button 
                      onClick={() => alert(`🛍 You selected: ${item.name}\nCost: ${item.wabiCost} Wabi\n\nContact your team leader to complete the purchase.`)}
                      className="bg-[#9FD356] text-white px-5 py-2 rounded-full text-sm font-bold transition-all hover:bg-[#6B5435] hover:-translate-y-0.5 shadow-md"
                    >
                      Purchase
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};
