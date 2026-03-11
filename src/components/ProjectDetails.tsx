import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { WasabiData, Project, Member } from '../types';
import { ArrowLeft, Clock, Users, Trophy, ListChecks } from 'lucide-react';
import { getProjectAge, getProjectTheme } from '../utils';

interface ProjectDetailsProps {
  data: WasabiData;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ data }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = data.projects.find(p => p.id === projectId);

  if (!project) return <div className="p-20 text-center">Project not found</div>;

  const age = getProjectAge(project.startDate);
  const { theme, visual } = getProjectTheme(project.startDate);
  const pm = data.members.find(m => m.id === project.projectManagerId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-[#FAFAFA] min-h-screen pb-20">
      <div className="bg-white border-b-2 border-[#E0E0E0] p-5">
        <Link to={`/team/${project.teamId}`} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#9FD356] text-white no-underline rounded-lg font-semibold transition-all hover:bg-[#8B6F47] hover:-translate-x-1">
          <ArrowLeft size={20} />
          Back to Team
        </Link>
      </div>

      <div className="container mx-auto px-5 mt-10">
        {/* Header Section */}
        <div className="bg-white p-10 rounded-2xl border-2 border-[#E0E0E0] text-center shadow-md mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#6B5435] mb-4">{project.name}</h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed">{project.description}</p>
          
          {/* Project Age Section */}
          <div className={`mt-8 inline-flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all shadow-sm min-w-[220px] ${
            theme === "Child" ? "bg-pink-50 border-pink-200 text-pink-600" :
            theme === "Growing" ? "bg-emerald-50 border-emerald-200 text-emerald-600" :
            theme === "Teen" ? "bg-violet-50 border-violet-200 text-violet-600" :
            theme === "Mature" ? "bg-blue-50 border-blue-200 text-blue-600" :
            "bg-orange-50 border-orange-200 text-orange-700"
          }`}>
            <div className="text-xs font-black uppercase tracking-widest opacity-70 flex items-center gap-1.5">
              <Clock size={14} /> Project Age
            </div>
            <div className="text-4xl font-black">{age}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl">
                {visual === "🐛" ? "🐛" : 
                 visual === "🦎" ? "🦎" : 
                 visual === "🐊" ? "🐊" : 
                 visual === "🦖" ? "🦖" : "🐉"}
              </span>
              <div className="text-[11px] font-bold uppercase tracking-tight">
                {theme} Stage
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Members Section */}
            <section className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md">
              <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <h3 className="text-base sm:text-xl font-bold text-[#6B5435] flex items-center gap-2 min-w-0">
                  <Users size={20} className="shrink-0" />
                  <span className="truncate">Team Members</span>
                </h3>
                <div className="bg-[#FAFAFA] border-2 border-[#E0E0E0] px-3 py-1.5 rounded-full text-sm font-black text-[#6B5435] shrink-0 whitespace-nowrap">
                  {project.members.length} / {project.maxMembers}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {project.members.map(name => {
                  const m = data.members.find(x => x.name === name);
                  if (!m) return null;
                  const isPM = project.projectManagerId === m.id;
                  return (
                    <Link key={m.id} to={`/member/${m.id}`} className="flex flex-col items-center gap-1 group">
                      <div className="relative">
                        <img
                          src={`/icons/${m.icon}`}
                          alt={m.name}
                          className={`w-16 h-16 rounded-full object-cover border-4 transition-all group-hover:scale-110 ${isPM ? 'border-[#E8631A]' : 'border-[#9FD356]'}`}
                        />
                        {isPM && (
                          <div className="absolute -top-1 -right-1 bg-[#E8631A] text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-white shadow-sm">PM</div>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#6B5435] group-hover:text-[#9FD356] transition-colors">{m.name}</span>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Prizes Section */}
            {project.prizes && (
              <section className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md">
                <h3 className="text-xl font-bold text-[#6B5435] mb-6 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500" /> Project Prizes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['1st', '2nd', '3rd'].map((place) => {
                    const prize = (project.prizes as any)[place];
                    if (!prize) return null;
                    const char = data.characters.find(c => c.id === prize.characterId);
                    if (!char) return null;
                    const degree = prize.degree || 'iron';
                    const degColors = data.cardConfig.degrees[degree];
                    const imgSrc = char.images[degree] || char.images.iron;
                    
                    return (
                      <div key={place} className="bg-[#FAFAFA] p-4 rounded-xl border-2 border-[#E0E0E0] text-center flex flex-col items-center">
                        <div className={`text-xs font-black mb-2 uppercase tracking-widest ${
                          place === '1st' ? 'text-yellow-600' : 
                          place === '2nd' ? 'text-gray-500' : 'text-orange-600'
                        }`}>
                          {place} Place
                        </div>
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden border-2 mb-2" style={{ borderColor: degColors.border }}>
                          <img src={`/icons/${imgSrc}`} alt={char.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[10px] font-bold text-[#6B5435] truncate w-full">{char.name}</div>
                        <div className="text-[8px] font-black uppercase tracking-widest" style={{ color: degColors.color }}>{degree}</div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Leaderboard Section */}
            {project.lastCycleLeaderboard && project.lastCycleLeaderboard.length > 0 && (
              <section className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md">
                <h3 className="text-base sm:text-xl font-bold text-[#6B5435] mb-6 flex items-center gap-2">
                  <Trophy size={20} className="text-yellow-500 shrink-0" />
                  <span className="leading-tight">Leaderboard (Last Cycle – 10 Days)</span>
                </h3>
                <div className="space-y-3">
                  {project.lastCycleLeaderboard.map((entry: any, i) => {
                    // Find the value key (the one that isn't 'name')
                    const valueKey = Object.keys(entry).find(k => k !== 'name');
                    if (!valueKey) return null;
                    
                    const value = entry[valueKey];
                    const unitLabel = valueKey.charAt(0).toUpperCase() + valueKey.slice(1);
                    
                    const rank = project.lastCycleLeaderboard!.filter((e: any) => e[valueKey] > value).length + 1;
                    
                    return (
                      <div key={i} className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all hover:bg-[#FAFAFA] ${
                        rank === 1 ? 'bg-yellow-50 border-yellow-200' : 
                        rank === 2 ? 'bg-gray-50 border-gray-200' : 
                        rank === 3 ? 'bg-orange-50 border-orange-200' : 'bg-white border-[#E0E0E0]'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 flex items-center justify-center font-black rounded-full ${
                            rank === 1 ? 'bg-yellow-500 text-white' : 
                            rank === 2 ? 'bg-gray-400 text-white' : 
                            rank === 3 ? 'bg-orange-400 text-white' : 'bg-[#E0E0E0] text-[#666666]'
                          }`}>
                            {rank}
                          </div>
                          <div className="font-bold text-[#6B5435]">{entry.name}</div>
                        </div>
                        <div className="text-sm font-black text-[#9FD356] bg-white px-4 py-1.5 rounded-full border border-[#E0E0E0] shadow-sm">
                          {value} {unitLabel}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Waiting List Section */}
            {project.waitingList && project.waitingList.length > 0 && (
              <section className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md">
                <h3 className="text-xl font-bold text-[#6B5435] mb-6 flex items-center gap-2">
                  <ListChecks size={20} /> Waiting List
                </h3>
                <div className="flex flex-wrap gap-3">
                  {project.waitingList.map(memberId => {
                    const m = data.members.find(x => x.id === memberId);
                    if (!m) return null;
                    return (
                      <div key={memberId} className="flex items-center gap-2 bg-[#FAFAFA] border-2 border-[#E0E0E0] px-4 py-2 rounded-full transition-all hover:border-[#9FD356]">
                        <img src={`/icons/${m.icon}`} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-sm font-bold text-[#6B5435]">{m.name}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Requirements Section */}
            <section className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md">
              <h3 className="text-xl font-bold text-[#6B5435] mb-6">Work Requirements</h3>
              <div className="bg-[#FAFAFA] p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#666666]">Minimum Work:</span>
                  <span className="font-bold text-[#6B5435]">{project.minimumWork}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[#666666]">Base Salary:</span>
                  <div className="flex items-center gap-1.5 text-lg font-black text-[#9FD356]">
                    <img src="/icons/wabi-icon.png" alt="Wabi" className="w-5 h-5" />
                    <span>{project.baseSalary}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bonus System Section */}
            <section className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md">
              <h3 className="text-xl font-bold text-[#6B5435] mb-6">Bonus System</h3>
              <div className="space-y-3">
                {project.bonusSystem.map((bonus, i) => (
                  <div key={i} className="bg-[#FAFAFA] p-4 rounded-xl border-l-4 border-[#9FD356] flex justify-between items-center transition-all hover:bg-[#F0F0F0] hover:border-[#E8631A]">
                    <div className="font-bold text-[#2C2C2C]">{bonus.work}</div>
                    <div className="flex items-center gap-1.5 text-lg font-black text-[#9FD356]">
                      <img src="/icons/wabi-icon.png" alt="Wabi" className="w-5 h-5" />
                      <span>{bonus.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Project Rules Section */}
        {project.rules && project.rules.length > 0 && (
          <section className="mt-12 bg-white p-10 rounded-2xl border-2 border-[#E0E0E0] shadow-md">
            <h2 className="text-3xl font-bold text-[#6B5435] mb-8 flex items-center gap-3">
              <span className="text-2xl">📜</span> Project Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.rules.map((rule, i) => (
                <div key={i} className="flex gap-4 p-5 bg-[#FAFAFA] rounded-xl border-l-4 border-[#9FD356] transition-all hover:bg-[#F0F0F0] hover:translate-x-1">
                  <div className="w-8 h-8 shrink-0 bg-[#9FD356] text-white rounded-full flex items-center justify-center font-black text-sm">
                    {i + 1}
                  </div>
                  <p className="text-[#666666] leading-relaxed font-medium">{rule}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  );
};
