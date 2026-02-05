
import React from 'react';
import { User, AnalysisResult } from '../types';
import { Award, Briefcase, Code, Flame, Clock, Target, CheckCircle, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ProfileProps {
  user: User;
  analysis: AnalysisResult | null;
  onOpenShare?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, analysis, onOpenShare }) => {
  const radarData = analysis ? [
    ...analysis.matchedSkills.map(s => ({ subject: s, value: 100 })),
    ...analysis.missingSkills.map(s => ({ subject: s, value: 30 }))
  ].slice(0, 7) : [];

  const stats = [
    { label: 'Skills', value: user.completedSkills.length, icon: <Award className="text-amber-500" /> },
    { label: 'Projects', value: user.completedProjects.length, icon: <Briefcase className="text-indigo-500" /> },
    { label: 'GitHub OS', value: user.contributions, icon: <Code className="text-emerald-500" /> },
    { label: 'Streak', value: user.streak, icon: <Flame className="text-rose-500" /> },
  ];

  return (
    <div className="space-y-10">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col md:flex-row gap-10 items-center"
      >
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white text-5xl font-black border-[6px] border-slate-50 shadow-2xl relative"
        >
          {user.name.split(' ').map(n => n[0]).join('')}
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2.5 rounded-2xl border-4 border-white shadow-lg">
            <Zap size={20} className="text-white fill-current" />
          </div>
        </motion.div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest">{user.branch}</span>
            <span className="px-4 py-2 bg-slate-100 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest">{user.year}nd Year</span>
          </div>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
            <div className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-100">
              <Target size={16} /> Readiness: {analysis?.score || 0}%
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200">
              <Clock size={16} /> {user.totalTime} Mins
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <motion.div 
            key={i} 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-indigo-500 transition-colors" />
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-sm">
              {s.icon}
            </div>
            <div className="text-3xl font-black text-slate-900 mb-1">{s.value}</div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm"
        >
          <h3 className="text-2xl font-black mb-8 tracking-tight">Competency Visualization</h3>
          <div className="h-[350px]">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }} />
                  <Radar dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} animationDuration={2500} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                <Target size={48} className="opacity-10" />
                <p className="font-bold">No calibration data found</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
          className="lg:col-span-5 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col"
        >
          <h3 className="text-2xl font-black mb-8 tracking-tight">Achievements</h3>
          <div className="space-y-4 flex-1">
            {user.completedSkills.map((skill, i) => (
              <motion.div 
                key={i} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-5 p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 group hover:border-indigo-200 transition-all"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm text-emerald-500 border border-emerald-100">
                  <CheckCircle size={22} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm">Mastered {skill}</h4>
                  <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Skill Verification Token</p>
                </div>
                <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-400" />
              </motion.div>
            ))}
            
            {(user.completedSkills.length === 0 && user.completedProjects.length === 0) && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
                <Award size={64} className="mb-4" />
                <p className="font-bold">No badges collected</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={onOpenShare}
            className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all"
          >
            Share Career Stats
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
