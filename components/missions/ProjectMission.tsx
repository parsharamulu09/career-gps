
import React, { useState } from 'react';
import { ArrowLeft, Rocket, Github, CheckCircle2, AlertTriangle, Loader2, Terminal, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionItem, AnalysisResult } from '../../types';
import { PROJECT_TEMPLATES } from '../../constants';

interface ProjectMissionProps {
  item: ActionItem;
  analysis: AnalysisResult;
  onBack: () => void;
  onComplete: (updated: AnalysisResult) => void;
}

const ProjectMission: React.FC<ProjectMissionProps> = ({ item, analysis, onBack, onComplete }) => {
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const template = PROJECT_TEMPLATES[item.title] || { stack: ["React", "Node.js"], features: ["Core logic", "User interface"] };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUrl.includes('github.com')) {
      setError("Please provide a valid GitHub repository URL.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Automatic completion after showing success
      setTimeout(() => {
        const updated = { ...analysis };
        updated.score = Math.min(100, updated.score + 15);
        onComplete(updated);
      }, 2500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 md:p-12">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-12 font-bold text-xs uppercase tracking-widest">
        <ArrowLeft size={16} /> Dashboard
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Briefing Card */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <Rocket size={12} /> Milestone: Project Mission
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{item.title}</h1>
              <p className="text-slate-500 mt-4 text-lg leading-relaxed">{item.description}</p>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
                <Terminal size={20} className="text-slate-400" /> Mission Spec
              </h3>
              <div className="space-y-8">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Target Tech Stack</span>
                  <div className="flex flex-wrap gap-2.5">
                    {template.stack.map(s => <span key={s} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono font-bold text-indigo-600">{s}</span>)}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Functional Requirements</span>
                  <ul className="space-y-4">
                    {template.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-slate-700 font-medium group">
                        <CheckCircle2 size={18} className="text-emerald-500 shrink-0 mt-0.5" /> 
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Verification Panel */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col">
            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden flex-1 flex flex-col justify-center border-[8px] border-slate-800">
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
              
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                    <motion.div 
                      initial={{ rotate: -45, scale: 0.5 }}
                      animate={{ rotate: 0, scale: 1 }}
                      className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                    >
                      <CheckCircle2 size={48} className="text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black mb-4 uppercase tracking-tight">✅ Project Created</h2>
                    <h3 className="text-xl font-bold text-emerald-400">🎉 Project Completed</h3>
                    <p className="text-slate-400 font-medium mt-6">Recalibrating route... Success!</p>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-center mb-10">
                      <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Github size={40} className="text-indigo-400" />
                      </div>
                      <h3 className="text-2xl font-black">Verify Proof of Work</h3>
                      <p className="text-slate-400 text-sm mt-3 font-medium">Submit your public repository link for automated GPS verification.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Repository Link</label>
                        <input 
                          type="text" 
                          value={githubUrl} 
                          onChange={e => setGithubUrl(e.target.value)} 
                          placeholder="https://github.com/username/project" 
                          className="w-full bg-slate-800/50 border border-slate-700 rounded-3xl py-6 px-8 text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono placeholder:text-slate-600" 
                        />
                      </div>
                      {error && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 p-4 rounded-2xl border border-rose-500/20">
                          <AlertTriangle size={14} /> {error}
                        </motion.div>
                      )}
                      <button 
                        disabled={isSubmitting || !githubUrl} 
                        className="w-full bg-indigo-600 text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 group"
                      >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Finalize Mission <CheckCircle2 size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMission;
