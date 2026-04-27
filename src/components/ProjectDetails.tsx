import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { WasabiData, Project, Member } from '../types';
import { ArrowLeft, Clock, Users } from 'lucide-react';
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

  const renderCurrency = (amount: number) => {
    const isSpice = project.currency === 'spice';
    return (
      <div className={`flex items-center gap-1.5 text-lg font-black ${isSpice ? 'text-[#E8631A]' : 'text-[#9FD356]'}`}>
        <img 
          src={isSpice ? "/icons/spice-icon.png" : "/icons/wabi-icon.png"} 
          alt={isSpice ? "Spice" : "Wabi"} 
          className="w-5 h-5" 
        />
        <span>{amount}</span>
      </div>
    );
  };

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
          <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-[#6B5435]">{project.name}</h1>
            <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 w-fit mx-auto md:mx-0 ${
              project.difficulty === 'Easy' ? 'bg-green-50 border-green-200 text-green-600' :
              project.difficulty === 'Medium' ? 'bg-blue-50 border-blue-200 text-blue-600' :
              project.difficulty === 'Hard' ? 'bg-orange-50 border-orange-200 text-orange-600' :
              'bg-red-50 border-red-200 text-red-600 animate-pulse'
            }`}>
              {project.difficulty} Difficulty
            </div>
          </div>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto leading-relaxed mb-8">{project.description}</p>
          
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
                {project.members.map(memberId => {
                  const m = data.members.find(x => x.id === memberId);
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
                  {renderCurrency(project.baseSalary)}
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
                    {renderCurrency(bonus.salary)}
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
