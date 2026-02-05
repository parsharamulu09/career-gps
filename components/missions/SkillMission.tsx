
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Rocket, CheckCircle2, Lock, Youtube, Globe, Send, Loader2, Sparkles, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActionItem, AnalysisResult } from '../../types';
import { askMentor } from '../../services/geminiService';
import { SKILL_KNOWLEDGE_BASE, SkillModule } from '../../constants';

interface SkillMissionProps {
  item: ActionItem;
  analysis: AnalysisResult;
  onBack: () => void;
  onComplete: (updated: AnalysisResult) => void;
}

const SkillMission: React.FC<SkillMissionProps> = ({ item, analysis, onBack, onComplete }) => {
  const [activeModuleIndex, setActiveModuleIndex] = useState<number | null>(null);
  const [completedModules, setCompletedModules] = useState<number[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [aiOffline, setAiOffline] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Strictly use static knowledge base for core learning content
  const skillKey = item.title in SKILL_KNOWLEDGE_BASE ? item.title : "TypeScript";
  const moduleData: SkillModule[] = SKILL_KNOWLEDGE_BASE[skillKey];

  const handleToggleModule = (index: number) => {
    const isLocked = index > 0 && !completedModules.includes(index - 1);
    if (isLocked) return;
    
    if (activeModuleIndex === index) {
      setActiveModuleIndex(null);
    } else {
      setActiveModuleIndex(index);
      if (chatMessages.length === 0) {
        setChatMessages([{ role: 'ai', text: `Hi! I'm your Career GPS Mentor. I'm here to help you navigate ${item.title}. Ask me any technical doubts!` }]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    
    if (aiOffline) return;

    setIsTyping(true);
    try {
      const resp = await askMentor(msg, `${item.title} Mission Context`);
      setChatMessages(prev => [...prev, { role: 'ai', text: resp }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "AI Mentor is temporarily offline. Please continue using the learning resources provided above." }]);
      setAiOffline(true);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCompleteMission = () => {
    setIsFinishing(true);
    setTimeout(() => {
      const updated = { ...analysis };
      updated.matchedSkills = [...new Set([...updated.matchedSkills, item.title])];
      updated.missingSkills = updated.missingSkills.filter(s => s !== item.title);
      updated.score = Math.min(100, updated.score + 10);
      onComplete(updated);
    }, 2000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const allModulesDone = completedModules.length === moduleData.length;

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Sidebar: Navigation Roadmap */}
      <div className="w-full lg:w-[450px] bg-slate-50 border-r border-slate-100 flex flex-col p-8 overflow-y-auto h-screen sticky top-0">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
          <ArrowLeft size={16} /> Dashboard
        </button>

        <div className="flex items-center gap-3 mb-10">
          <div className="p-2.5 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
            <Rocket size={20} />
          </div>
          <h3 className="font-black text-slate-900 tracking-tight">Mission: {item.title}</h3>
        </div>

        <div className="space-y-4 flex-1">
          {moduleData.map((m, i) => {
            const isLocked = i > 0 && !completedModules.includes(i - 1);
            const isCompleted = completedModules.includes(i);
            const isOpen = activeModuleIndex === i;
            
            // Pick only the first video and doc for strict UI consistency
            const firstVideo = m.videos[0];
            const firstDoc = m.docs[0];

            return (
              <div 
                key={i} 
                className={`rounded-[2rem] border-2 transition-all overflow-hidden ${
                  isOpen ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100' : 
                  isCompleted ? 'border-emerald-100 bg-emerald-50' : 
                  isLocked ? 'opacity-40 border-slate-100 grayscale' : 'border-slate-100 bg-white'
                }`}
              >
                <button 
                  onClick={() => handleToggleModule(i)} 
                  className="w-full p-6 text-left flex items-center gap-4 group"
                  disabled={isLocked}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black shrink-0 transition-colors ${
                    isCompleted ? 'bg-emerald-500 text-white' : 
                    isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={20} /> : isLocked ? <Lock size={16} /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-black text-slate-900 truncate">{m.title}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{m.level}</div>
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-500" />}
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-6 pb-6 overflow-hidden">
                      <div className="pt-4 border-t border-slate-100 space-y-6">
                        {/* Description Section */}
                        <div className="text-xs text-slate-600 leading-relaxed font-medium">
                          {m.notes}
                        </div>
                        
                        {/* Action Elements: VIDEO, OFFICIAL DOCS, MARK STEP DONE */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            {/* 1. VIDEO BUTTON */}
                            {firstVideo && (
                              <button 
                                onClick={() => window.open(firstVideo.url, '_blank')} 
                                className="flex items-center justify-center gap-2 py-3.5 bg-rose-50 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                              >
                                <Youtube size={14} /> VIDEO
                              </button>
                            )}
                            {/* 2. OFFICIAL DOCS BUTTON */}
                            {firstDoc && (
                              <button 
                                onClick={() => window.open(firstDoc.url, '_blank')} 
                                className="flex items-center justify-center gap-2 py-3.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                              >
                                <Globe size={14} /> OFFICIAL DOCS
                              </button>
                            )}
                          </div>

                          {/* 3. MARK STEP DONE BUTTON */}
                          {!isCompleted && (
                            <button 
                              onClick={() => setCompletedModules(prev => Array.from(new Set([...prev, i])))} 
                              className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                            >
                              MARK STEP DONE
                            </button>
                          )}
                          {isCompleted && (
                            <div className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-emerald-100">
                              <CheckCircle2 size={14} /> STEP COMPLETED
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200">
          <AnimatePresence mode="wait">
            {allModulesDone ? (
              <motion.button 
                key="complete-btn"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleCompleteMission}
                disabled={isFinishing}
                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl shadow-indigo-200 transition-all"
              >
                {isFinishing ? <Loader2 className="animate-spin" /> : 'CLAIM MISSION BADGE'}
              </motion.button>
            ) : (
              <div key="progress-placeholder" className="p-6 bg-slate-100 rounded-3xl text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Complete Roadmap to Finalize</p>
                <div className="mt-3 h-1 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedModules.length / moduleData.length) * 100}%` }}
                    className="h-full bg-indigo-500" 
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main View: AI Mentor */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeModuleIndex === null ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-md">
                <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                   <Sparkles size={48} className="text-indigo-400/40" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mission Control</h2>
                <p className="text-slate-500 mt-4 leading-relaxed">Select a navigational node from your route to begin calibrating your skills. Use the resources provided in each card to move through the levels.</p>
              </motion.div>
            ) : (
              <div className="w-full max-w-4xl h-full flex flex-col pt-10">
                {/* Chat Display */}
                <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-8 custom-scrollbar">
                  {chatMessages.map((m, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm ${
                        m.role === 'user' ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border border-slate-100 text-slate-700'
                      }`}>
                        {m.text}
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <Loader2 size={14} className="animate-spin text-slate-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Mentor is calibrating response...</div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="mt-auto space-y-4">
                  {aiOffline && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3 text-amber-700 mx-auto max-w-2xl"
                    >
                      <AlertCircle size={18} />
                      <p className="text-xs font-bold uppercase tracking-wide">AI Mentor is temporarily offline. Please use the learning resources above.</p>
                    </motion.div>
                  )}
                  
                  <div className={`relative max-w-2xl mx-auto w-full group ${aiOffline ? 'opacity-30 pointer-events-none' : ''}`}>
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={e => setChatInput(e.target.value)} 
                      onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask Mentor a technical doubt..." 
                      className="w-full pl-8 pr-16 py-6 bg-white border border-slate-200 rounded-[2.5rem] text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-2xl shadow-slate-200/50"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-indigo-600 text-white rounded-3xl hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SkillMission;
