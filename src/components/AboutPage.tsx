import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Users, Rocket, Trophy, Target, ShieldCheck } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="bg-[#FAFAFA] min-h-screen pb-20">
      <div className="bg-white border-b-2 border-[#E0E0E0] p-5 sticky top-0 z-50">
        <Link to="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#9FD356] text-white no-underline rounded-lg font-semibold transition-all hover:bg-[#8B6F47] hover:-translate-x-1">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
      </div>

      <div className="container mx-auto px-5 mt-16 max-w-4xl">
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-[#6B5435] mb-6 tracking-tight">The Wasabi System</h1>
          <p className="text-xl text-[#666666] leading-relaxed">
            A scalable platform designed for groups of friends to transform discipline into growth.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* Rule 1 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-[#9FD356]/10 p-6 rounded-full text-[#9FD356] shrink-0">
              <Users size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#6B5435] mb-3">Community First</h3>
              <p className="text-[#666666] leading-relaxed">
                Each group creates a dedicated <span className="font-bold text-[#9FD356]">Team</span> on the website. This is your home base for collaboration and competition.
              </p>
            </div>
          </motion.div>

          {/* Rule 2 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="bg-[#E8631A]/10 p-6 rounded-full text-[#E8631A] shrink-0">
              <Rocket size={48} />
            </div>
            <div className="md:text-right">
              <h3 className="text-2xl font-bold text-[#6B5435] mb-3">Project Execution</h3>
              <p className="text-[#666666] leading-relaxed">
                Teams start <span className="font-bold text-[#E8631A]">Projects</span> with required minimum tasks. Whether it's studying, fitness, or learning a new skill, execution is the priority.
              </p>
            </div>
          </motion.div>

          {/* Rule 3 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-red-500/10 p-6 rounded-full text-red-500 shrink-0">
              <ShieldCheck size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#6B5435] mb-3">Accountability</h3>
              <p className="text-[#666666] leading-relaxed">
                Members who do not complete their tasks <span className="font-bold text-red-500">leave the project</span>. The system rewards consistency and filters out procrastination.
              </p>
            </div>
          </motion.div>

          {/* Rule 4 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md flex flex-col md:flex-row-reverse gap-8 items-center">
            <div className="bg-yellow-500/10 p-6 rounded-full text-yellow-500 shrink-0">
              <Target size={48} />
            </div>
            <div className="md:text-right">
              <h3 className="text-2xl font-bold text-[#6B5435] mb-3">Leadership</h3>
              <p className="text-[#666666] leading-relaxed">
                Each team chooses a <span className="font-bold text-yellow-500">Leader</span>. Leaders manage the team shop, approve trades, and ensure the group stays on track.
              </p>
            </div>
          </motion.div>

          {/* Rule 5 */}
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-2xl border-2 border-[#E0E0E0] shadow-md flex flex-col md:flex-row gap-8 items-center">
            <div className="bg-blue-500/10 p-6 rounded-full text-blue-500 shrink-0">
              <Trophy size={48} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#6B5435] mb-3">Rewards & Gamification</h3>
              <p className="text-[#666666] leading-relaxed">
                Members earn <span className="font-bold text-[#9FD356]">Score</span> through participation. Scores are used to collect cards and redeem real-life rewards from the team shop.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-20 text-center bg-gradient-to-br from-[#6B5435] to-[#8B6F47] p-12 rounded-3xl text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Ready to transform?</h2>
          <p className="text-lg text-white/80 mb-8">Join a team or start your own journey today.</p>
          <Link to="/" className="inline-block bg-[#9FD356] text-white px-10 py-4 rounded-full font-black text-xl transition-all hover:bg-white hover:text-[#6B5435] hover:scale-105 shadow-lg">
            Get Started
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};
