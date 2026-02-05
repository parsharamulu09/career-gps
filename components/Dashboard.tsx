
import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Circle, AlertCircle, ArrowRight, Target, Briefcase, MapPin, ExternalLink, Zap, ChevronRight, Award, Flame, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, CareerRole, ActionItem } from '../types';

interface DashboardProps {
  analysis: AnalysisResult;
  targetRole: CareerRole;
  onUpdateAnalysis: (updated: AnalysisResult) => void;
  onNavigateMission: (action: ActionItem) => void;
  onOpenShare?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ analysis, targetRole, onUpdateAnalysis, onNavigateMission, onOpenShare }) => {
  const radarData = [
    ...analysis.matchedSkills.map(s => ({ subject: s, value: 100 })),
    ...analysis.missingSkills.map(s => ({ subject: s, value: 30 }))
  ].slice(0, 7);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-emerald-500 w-5 h-5" />;
      case 'in-progress': return <Circle className="text-amber-500 w-5 h-5" />;
      default: return <AlertCircle className="text-slate-300 w-5 h-5" />;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case 'skill': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'project': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'opportunity': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      default: return 'bg-slate-500/10';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Hero Section & Radar */}
      <div className="lg:col-span-8 space-y-8">
        <motion.header 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-[0.2em] bg-indigo-50 px-3 py-1.5 rounded-full w-fit">
                  <MapPin size={12} />
                  <span>Active Navigation</span>
                </div>
                {onOpenShare && (
                  <button 
                    onClick={onOpenShare}
                    className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] bg-slate-100 px-3 py-1.5 rounded-full w-fit hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Share2 size={12} />
                    <span>Share Stats</span>
                  </button>
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900">{targetRole.title}</h2>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">{analysis.explanation}</p>
            </div>

            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                <motion.circle 
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * analysis.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  strokeDasharray="283" 
                  className="text-indigo-600"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-black text-slate-900"
                >{analysis.score}%</motion.span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Match</span>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <Target className="text-indigo-600" size={20} /> Skill Fit Radar
            </h3>
            <div className="h-[280px] w-full mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#f1f5f9" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                  <Radar
                    name="Readiness"
                    dataKey="value"
                    stroke="#4f46e5"
                    fill="#4f46e5"
                    fillOpacity={0.15}
                    animationDuration={2000}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Roadmap Steps */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100"
          >
            <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
              <Zap className="text-amber-500" size={20} /> Route Progress
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-50" />
              {analysis.roadmap.map((level, idx) => (
                <div key={level.title} className="relative z-10 flex gap-6">
                  <div className={`mt-1 flex items-center justify-center`}>
                    {getStatusIcon(level.status)}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold tracking-tight ${level.status === 'missing' ? 'text-slate-400' : 'text-slate-900'}`}>
                      {level.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">
                      {level.skills.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Actions Sidebar */}
      <div className="lg:col-span-4 space-y-8">
        <motion.div 
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden border border-slate-800"
        >
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-2">Smart Next Actions</h3>
            <p className="text-slate-400 text-xs mb-8">Execute these tasks to bridge the skill gap.</p>
            
            <div className="space-y-4">
              {analysis.nextActions.map((action, i) => (
                <motion.div 
                  key={i} 
                  whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  onClick={() => onNavigateMission(action)}
                  className="bg-white/5 border border-white/10 p-5 rounded-2xl cursor-pointer group transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getActionColor(action.type)}`}>
                      {action.type}
                    </span>
                    <motion.div 
                      whileHover={{ x: 3 }}
                      className="p-1.5 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight size={14} className="text-white" />
                    </motion.div>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{action.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2">{action.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
        </motion.div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
            <Award size={20} className="text-indigo-600" /> Opportunities
          </h3>
          <div className="space-y-4">
            <OpportunityCard title="Google Summer of Code" match="95%" url="https://summerofcode.withgoogle.com/" />
            <OpportunityCard title="FinTech Hackathon" match="88%" url="https://devpost.com/hackathons" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const OpportunityCard = ({ title, match, url }: { title: string, match: string, url: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-300 transition-all cursor-pointer group"
    onClick={() => window.open(url, '_blank')}
  >
    <div className="flex justify-between items-start mb-1">
      <h4 className="font-bold text-xs text-slate-900">{title}</h4>
      <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{match} Match</span>
    </div>
    <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-3 group-hover:text-indigo-500">
      Apply <ExternalLink size={10} />
    </div>
  </motion.div>
);

export default Dashboard;
