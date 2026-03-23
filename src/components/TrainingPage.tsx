import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { WasabiData } from '../types';
import { ArrowLeft, GraduationCap, ExternalLink, UserPlus } from 'lucide-react';

interface TrainingPageProps {
  data: WasabiData;
}

export const TrainingPage: React.FC<TrainingPageProps> = ({ data }) => {
  const [enrollTarget, setEnrollTarget] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#FDFCFB] pb-20"
    >
      {/* Custom Alert Modal */}
      {enrollTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-[#9FD356] text-center"
          >
            <div className="w-20 h-20 bg-[#9FD356]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus size={40} className="text-[#9FD356]" />
            </div>
            <h3 className="text-2xl font-black text-[#6B5435] mb-2">Join the Training!</h3>
            <p className="text-[#6B5435]/70 mb-8 font-medium text-sm">
              To enroll in <span className="text-[#9FD356] font-bold">{enrollTarget}</span>, please contact your <span className="text-[#E8631A] font-bold">Team Leader</span> directly.
            </p>
            <button 
              onClick={() => setEnrollTarget(null)}
              className="w-full py-4 bg-[#9FD356] text-[#6B5435] font-black rounded-2xl border-b-4 border-[#7CB342] hover:translate-y-0.5 transition-all shadow-lg"
            >
              Got it!
            </button>
          </motion.div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-[#E8E1D9] p-5 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-[#9FD356] text-white rounded-lg font-bold transition-all hover:bg-[#8B6F47] hover:-translate-x-1">
            <ArrowLeft size={20} />
            Back to Home
          </Link>
          <h1 className="text-xl font-black text-[#6B5435] flex items-center gap-2">
            <GraduationCap size={24} className="text-[#9FD356]" />
            Wasabi Training Center
          </h1>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 bg-[#F5F1ED] border-b border-[#E8E1D9]">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-4xl font-black text-[#6B5435] mb-4">Level Up Your Skills</h2>
          <p className="text-[#8B6F47] max-w-2xl mx-auto text-lg">
            Invest your Wabi and Spice to gain permanent experience and unlock new opportunities within the Wasabi System.
          </p>
        </div>
      </section>

      {/* Training Grid */}
      <div className="container mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.trainings.map((training, i) => (
            <motion.div
              key={training.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border-2 border-[#E8E1D9] rounded-2xl p-8 flex flex-col h-full transition-all hover:border-[#9FD356] hover:shadow-xl group"
            >
              <div className="w-16 h-16 bg-[#9FD356]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap size={32} className="text-[#9FD356]" />
              </div>
              
              <h3 className="text-2xl font-black text-[#6B5435] mb-3">{training.name}</h3>
              <p className="text-[#8B6F47] text-sm leading-relaxed mb-8 flex-1">
                {training.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F5F1ED] rounded-xl border border-[#E8E1D9]">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-[#8B6F47] uppercase tracking-widest">Cost</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[#9FD356] font-black">{training.wabi_price} Wabi</span>
                      <span className="text-[#E8631A] font-black">{training.spice_price} Spice</span>
                    </div>
                  </div>
                  <a 
                    href={training.pdf_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white border border-[#E8E1D9] rounded-lg flex items-center justify-center text-[#6B5435] hover:bg-[#9FD356] hover:text-white hover:border-[#9FD356] transition-all"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>

                <button 
                  onClick={() => setEnrollTarget(training.name)}
                  className="w-full py-4 bg-[#9FD356] text-white rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-[#9FD356]/20 transition-all hover:bg-[#8B6F47] hover:-translate-y-1 active:scale-95"
                >
                  Enroll Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
