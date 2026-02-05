
import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, BookOpen, Rocket, Target, CheckCircle2, ChevronRight, Loader2, MessageSquare, Send, PlayCircle, FileText, ArrowLeft, Lock, Youtube, Globe, Info, Github, Terminal, Cpu, Code2, AlertTriangle, PartyPopper, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionItem, AnalysisResult } from '../types';
import { getModuleContent, askMentor } from '../services/geminiService';
// Fix: Removed non-existent exports OFFICIAL_DOCS_DATA and VIDEO_RESOURCES as they are not defined in constants.tsx
import { OPEN_SOURCE_REPOS, PROJECT_TEMPLATES } from '../constants';

interface DetailModalProps {
  item: ActionItem;
  analysis: AnalysisResult;
  onClose: () => void;
  onComplete: (updatedAnalysis: AnalysisResult) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ item, analysis, onClose, onComplete }) => {
  const [isFinishing, setIsFinishing] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeModule, setActiveModule] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [moduleNotes, setModuleNotes] = useState<string | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [resourceOverlay, setResourceOverlay] = useState<'videos' | 'docs' | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const modules = [
    { title: `Basics of ${item.title}`, level: 'Beginner' },
    { title: `Intermediate ${item.title} Concepts`, level: 'Intermediate' },
    { title: `Advanced Implementation & Optimization`, level: 'Advanced' }
  ];

  const handleFinishMission = () => {
    if (item.type !== 'skill' && !githubUrl.includes('github.com')) {
      setError("Provide a valid GitHub repository URL");
      return;
    }
    setIsFinishing(true);
    setTimeout(() => {
      setShowSuccess(true);
      setTimeout(() => {
        const updated = { ...analysis };
        if (item.type === 'skill') {
          updated.matchedSkills = [...updated.matchedSkills, item.title];
          updated.missingSkills = updated.missingSkills.filter(s => s !== item.title);
          updated.score = Math.min(100, updated.score + 5);
        } else {
          updated.score = Math.min(100, updated.score + 10);
        }
        onComplete(updated);
      }, 2000);
    }, 1500);
  };

  const enterModule = async (index: number) => {
    setActiveModule(index);
    setLoadingNotes(true);
    setChatMessages([{ role: 'ai', text: `Welcome to the ${modules[index].level} module. Ask me anything about ${modules[index].title}!` }]);
    try {
      const notes = await getModuleContent(item.title, modules[index].level);
      setModuleNotes(notes);
    } catch (e) {
      setModuleNotes("Notes couldn't be loaded.");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    setIsTyping(true);
    try {
      const resp = await askMentor(msg, item.title);
      setChatMessages(prev => [...prev, { role: 'ai', text: resp }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] text-center shadow-2xl max-w-md w-full"
        >
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8"
          >
            <PartyPopper size={48} />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900">Level Cleared!</h2>
          <p className="text-slate-500 mt-4 leading-relaxed">Your proof of work has been verified. Career GPS is recalibrating your score.</p>
          <div className="mt-10 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8 }}
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500" 
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative border border-white/20"
      >
        <button onClick={onClose} className="absolute right-8 top-8 z-[110] p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
          <X size={24} />
        </button>

        {item.type === 'skill' ? (
          <>
            {/* Skill Sidebar */}
            <div className="w-full lg:w-80 bg-slate-50 border-r border-slate-100 flex flex-col p-8 overflow-y-auto">
              <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-indigo-600 rounded-xl text-white">
                  <Rocket size={20} />
                </div>
                <h3 className="font-black text-slate-800 tracking-tight">Skill Mission</h3>
              </div>

              <div className="space-y-4 flex-1">
                {modules.map((m, i) => {
                  const isLocked = i > 0 && !completedModules.includes(i - 1);
                  const isCompleted = completedModules.includes(i);
                  return (
                    <motion.button
                      key={i}
                      whileHover={!isLocked ? { x: 5 } : {}}
                      onClick={() => !isLocked && enterModule(i)}
                      className={`w-full p-5 rounded-2xl text-left border-2 flex items-center gap-4 transition-all relative overflow-hidden ${
                        activeModule === i ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' :
                        isCompleted ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
                        isLocked ? 'opacity-40 border-slate-200 cursor-not-allowed' : 'bg-white border-slate-100 hover:border-indigo-200'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                        isCompleted ? 'bg-emerald-500 text-white' : 
                        activeModule === i ? 'bg-white text-indigo-600' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={16} /> : isLocked ? <Lock size={14} /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black truncate">{m.title}</div>
                        <div className={`text-[9px] font-black uppercase tracking-widest ${activeModule === i ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {m.level}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-200">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={completedModules.length < modules.length || isFinishing}
                  onClick={handleFinishMission}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-30 shadow-xl shadow-indigo-100 transition-all"
                >
                  {isFinishing ? <Loader2 className="animate-spin" /> : 'Finalize Mission'}
                </motion.button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
              <AnimatePresence mode="wait">
                {activeModule === null ? (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                  >
                    <motion.div 
                      animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                      className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8"
                    >
                      <Sparkles size={48} className="text-indigo-600 opacity-20" />
                    </motion.div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Mission Selection Required</h4>
                    <p className="max-w-xs text-slate-400 text-sm leading-relaxed">Select a navigational node from the sidebar to begin your training sequence.</p>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    className="flex-1 flex flex-col lg:flex-row h-full"
                  >
                    <div className="flex-1 p-10 overflow-y-auto border-r border-slate-100">
                      <div className="flex items-center gap-4 mb-10">
                        <button onClick={() => setResourceOverlay('videos')} className="flex-1 p-5 bg-rose-50 border border-rose-100 rounded-3xl flex items-center gap-4 hover:shadow-lg hover:shadow-rose-100 transition-all">
                          <div className="p-2.5 bg-rose-600 rounded-xl text-white"><Youtube size={20} /></div>
                          <div className="text-left">
                            <div className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Video Deep Dive</div>
                            <div className="text-xs font-bold text-slate-600">Expert Tutorials</div>
                          </div>
                        </button>
                        <button onClick={() => setResourceOverlay('docs')} className="flex-1 p-5 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center gap-4 hover:shadow-lg hover:shadow-indigo-100 transition-all">
                          <div className="p-2.5 bg-indigo-600 rounded-xl text-white"><Globe size={20} /></div>
                          <div className="text-left">
                            <div className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">Official Specs</div>
                            <div className="text-xs font-bold text-slate-600">Documentation</div>
                          </div>
                        </button>
                      </div>

                      {loadingNotes ? (
                        <div className="space-y-6">
                          <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse" />
                          <div className="h-24 bg-slate-50 rounded-3xl animate-pulse" />
                          <div className="h-4 bg-slate-100 rounded-full w-1/2 animate-pulse" />
                        </div>
                      ) : (
                        <div className="prose prose-indigo max-w-none">
                          <div className="text-slate-600 leading-relaxed whitespace-pre-wrap font-medium">
                            {moduleNotes}
                          </div>
                          
                          <motion.div 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                            className="mt-12 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-6"
                          >
                            <div className="text-center sm:text-left">
                              <h6 className="font-black text-emerald-900 text-lg tracking-tight">Knowledge Checkpoint</h6>
                              <p className="text-xs text-emerald-600 font-medium">Have you mastered the concepts in this module?</p>
                            </div>
                            <button 
                              onClick={() => setCompletedModules([...completedModules, activeModule!])}
                              className="px-8 py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200"
                            >
                              Verified Done
                            </button>
                          </motion.div>
                        </div>
                      )}
                    </div>

                    {/* Chat Sidebar */}
                    <div className="w-full lg:w-96 bg-slate-50 flex flex-col p-6 h-full">
                      <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center gap-3 mb-6">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-200" />
                        <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Mentor Calibration: Online</span>
                      </div>
                      <div className="flex-1 overflow-y-auto space-y-4 mb-6 px-2 custom-scrollbar">
                        {chatMessages.map((m, i) => (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed font-medium shadow-sm ${
                              m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-100 text-slate-700'
                            }`}>
                              {m.text}
                            </div>
                          </motion.div>
                        ))}
                        {isTyping && (
                          <div className="flex gap-1.5 p-2 items-center">
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-300 rounded-full" />
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>
                      <div className="relative group">
                        <input 
                          type="text" 
                          value={chatInput} 
                          onChange={e => setChatInput(e.target.value)} 
                          onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Ask AI Mentor..." 
                          className="w-full pl-6 pr-14 py-4 bg-white border border-slate-200 rounded-2xl text-xs outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                        />
                        <button 
                          onClick={handleSendMessage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
                        >
                          <Send size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          /* Project / Opportunity Detail */
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="p-12 bg-slate-900 text-white relative">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-[100px] pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest mb-6">
                  <Target size={12} className="text-indigo-400" /> Active Mission Briefing
                </div>
                <h2 className="text-4xl font-black tracking-tight mb-4">{item.title}</h2>
                <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-10">
                <section>
                  <h4 className="flex items-center gap-3 font-black text-slate-900 text-xl mb-8 uppercase tracking-tight">
                    <Terminal size={24} className="text-indigo-600" /> Technical Context
                  </h4>
                  <div className="bg-slate-50 border border-slate-100 p-10 rounded-[2.5rem] shadow-sm space-y-8">
                    {PROJECT_TEMPLATES[item.title] ? (
                      <>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Architecture Stack</span>
                          <div className="flex flex-wrap gap-2.5">
                            {PROJECT_TEMPLATES[item.title].stack.map(s => (
                              <span key={s} className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-mono font-bold text-indigo-600 shadow-sm">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Core Objectives</span>
                          <ul className="space-y-4">
                            {PROJECT_TEMPLATES[item.title].features.map(f => (
                              <li key={f} className="text-sm text-slate-700 flex items-start gap-4 group">
                                <div className="w-6 h-6 bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-lg shadow-indigo-100 transition-transform group-hover:scale-110">
                                  <CheckCircle2 size={14} />
                                </div> 
                                <span className="font-medium">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-6">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium italic border-l-4 border-indigo-200 pl-6 py-2 bg-indigo-50/30 rounded-r-xl">
                          "{item.details || "Contribute to verified open-source pipelines to validate your industry-readiness."}"
                        </p>
                        <div className="space-y-4">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Available Repositories</span>
                          <div className="grid grid-cols-1 gap-4">
                            {OPEN_SOURCE_REPOS.slice(0, 3).map((repo, i) => (
                              <motion.a 
                                whileHover={{ scale: 1.02, backgroundColor: '#fff' }}
                                key={i} href={repo.link} target="_blank" className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm flex justify-between items-center group"
                              >
                                <div>
                                  <h6 className="font-black text-sm text-slate-900 group-hover:text-indigo-600">{repo.name}</h6>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{repo.tags.join(' • ')}</p>
                                </div>
                                <ExternalLink size={16} className="text-slate-200 group-hover:text-indigo-400" />
                              </motion.a>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <div className="flex flex-col">
                <motion.div 
                  initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                  className="bg-slate-900 rounded-[3rem] p-12 text-white flex-1 flex flex-col justify-center border-[8px] border-slate-800 shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-[80px]" />
                  
                  <div className="text-center space-y-8 relative z-10">
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }}
                      className="w-24 h-24 bg-indigo-600/30 rounded-[2.5rem] flex items-center justify-center mx-auto border border-white/10 shadow-2xl"
                    >
                      <Github size={48} className="text-indigo-400" />
                    </motion.div>
                    
                    <div>
                      <h3 className="text-3xl font-black tracking-tight">Proof of Work</h3>
                      <p className="text-slate-500 text-sm mt-3 font-medium">Connect your GitHub repository to trigger the GPS calibration sequence.</p>
                    </div>

                    <div className="space-y-6 pt-6">
                      <div className="relative">
                        <input 
                          type="text" value={githubUrl} onChange={e => {setGithubUrl(e.target.value); setError(null);}}
                          placeholder="https://github.com/yourname/repo" 
                          className="w-full bg-slate-800/50 border-2 border-slate-700/50 rounded-2xl py-5 px-6 text-sm outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-indigo-50 placeholder:text-slate-600 font-mono"
                        />
                      </div>
                      
                      <AnimatePresence>
                        {error && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="flex items-center gap-3 text-rose-400 text-[10px] font-black uppercase tracking-widest bg-rose-500/10 p-4 rounded-xl border border-rose-500/20"
                          >
                            <AlertTriangle size={14} /> {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.button 
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleFinishMission}
                        disabled={isFinishing || !githubUrl}
                        className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                      >
                        {isFinishing ? <Loader2 className="animate-spin" /> : 'Finalize Calibration'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                <p className="text-[9px] text-slate-400 text-center mt-8 uppercase tracking-[0.3em] font-black">
                  Navigation Engine: Autonomous Verification Layer Active
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DetailModal;