
import React, { useState } from 'react';
import { ArrowLeft, Rocket, Github, CheckCircle2, ExternalLink, Code2, Heart, Award, Sparkles, Loader2, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionItem, AnalysisResult } from '../../types';
import { OPEN_SOURCE_REPOS } from '../../constants';

interface OSMissionProps {
  item: ActionItem;
  analysis: AnalysisResult;
  onBack: () => void;
  onComplete: (updated: AnalysisResult) => void;
}

const OSMission: React.FC<OSMissionProps> = ({ item, analysis, onBack, onComplete }) => {
  const [contributedRepoUrl, setContributedRepoUrl] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeMission = () => {
    if (!contributedRepoUrl.includes('github.com')) {
      setError("Please paste a valid GitHub contribution/PR link.");
      return;
    }
    setError(null);
    setIsFinishing(true);
    setTimeout(() => {
      const updated = { ...analysis };
      updated.score = Math.min(100, updated.score + 10);
      onComplete(updated);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12 flex flex-col">
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-12 font-bold text-xs uppercase tracking-widest">
        <ArrowLeft size={16} /> Dashboard
      </button>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-8 space-y-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Code2 size={12} /> Community Mission
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Open Source Contribution</h1>
            <p className="text-slate-500 mt-4 text-lg leading-relaxed max-w-2xl">
              Build your professional reputation. We've curated a list of repositories that align with your current path.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OPEN_SOURCE_REPOS.map((repo, i) => (
              <motion.div 
                key={i} whileHover={{ y: -5 }}
                onClick={() => setSelectedRepo(repo.name)}
                className={`p-8 rounded-[2.5rem] shadow-sm border flex flex-col group transition-all cursor-pointer ${selectedRepo === repo.name ? 'border-indigo-600 bg-indigo-50/30' : 'bg-white border-slate-100'}`}
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors"><Github size={24} className="text-slate-900" /></div>
                   {selectedRepo === repo.name && <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Selected</div>}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{repo.name}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{repo.description}</p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {repo.tags.map(t => <span key={t} className="text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-1 rounded-lg">{t}</span>)}
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); window.open(repo.link, '_blank'); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                >
                  Open Repo on GitHub <ExternalLink size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="lg:col-span-4">
           <div className="sticky top-12 space-y-8">
              <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
                <h4 className="text-xl font-black mb-4 flex items-center gap-3"><Sparkles size={20} className="text-amber-400" /> Mission Proof</h4>
                
                <div className="mt-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contribution URL</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                      <input 
                        type="text" 
                        value={contributedRepoUrl} 
                        onChange={e => setContributedRepoUrl(e.target.value)}
                        placeholder="Link to your PR or contribution"
                        className="w-full pl-10 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                      <AlertTriangle size={14} /> {error}
                    </div>
                  )}

                  <button 
                    disabled={!contributedRepoUrl || isFinishing}
                    onClick={completeMission}
                    className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    {isFinishing ? <Loader2 className="animate-spin" /> : 'Finalize Contribution'}
                  </button>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center font-black">1</div>
                      <span>Select a repository</span>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center font-black">2</div>
                      <span>Make a meaningful PR</span>
                   </div>
                   <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center font-black">3</div>
                      <span>Paste PR link and finalize</span>
                   </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
                 <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Heart className="text-emerald-500" /></div>
                 <h5 className="font-bold text-slate-900">Karma Reputation</h5>
                 <p className="text-xs text-slate-400 mt-2">OS contributions significantly boost your profile's industry credibility score.</p>
              </div>
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OSMission;
