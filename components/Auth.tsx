
import React, { useState } from 'react';
import { Compass, Mail, Lock, User, ArrowRight, Github, CheckCircle2, Sparkles, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserType, Branch } from '../types';
import { BRANCHES } from '../constants';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: Branch.CSE,
    year: 3
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      setSignupSuccess(true);
      setTimeout(() => {
        setSignupSuccess(false);
        setMode('login');
      }, 2500);
      return;
    }
    const user: UserType = {
      name: formData.name || 'Engineer One',
      email: formData.email,
      role: 'student',
      branch: formData.branch,
      year: formData.year,
      completedSkills: [],
      completedProjects: [],
      contributions: 0,
      streak: 1,
      totalTime: 45
    };
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md glass-dark rounded-[3rem] shadow-2xl overflow-hidden relative z-10"
      >
        <AnimatePresence>
          {signupSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-indigo-600 flex flex-col items-center justify-center text-white p-8 text-center"
            >
              <CheckCircle2 size={64} className="mb-6 animate-bounce" />
              <h2 className="text-3xl font-black tracking-tight">Signal Locked!</h2>
              <p className="mt-3 text-indigo-100 font-medium">Your coordinates are registered. Recalibrating for login...</p>
              <div className="mt-10 h-1.5 w-32 bg-white/20 rounded-full overflow-hidden">
                <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ duration: 1.5, repeat: Infinity }} className="h-full bg-white w-1/2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-10 pt-12 pb-6 text-center">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-indigo-500/20"
          >
            <Compass size={32} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-white tracking-tight">Career GPS</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">Navigate Your Future v2.0</p>
        </div>

        <div className="p-10 pt-4">
          <div className="flex bg-slate-800/50 p-1.5 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Calibration
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Registration
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {mode === 'signup' ? (
                <motion.div 
                  key="signup-fields"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Identity</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                      <input 
                        type="text" required placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/30 border border-white/5 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none text-white transition-all"
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Branch</label>
                      <select 
                        className="w-full px-4 py-4 bg-slate-800/30 border border-white/5 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/20 outline-none text-white transition-all appearance-none"
                        value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value as Branch})}
                      >
                        {BRANCHES.map(b => <option key={b} value={b} className="bg-slate-900">{b.split(' ')[0]}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Year</label>
                      <select 
                        className="w-full px-4 py-4 bg-slate-800/30 border border-white/5 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/20 outline-none text-white transition-all appearance-none"
                        value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})}
                      >
                        {[1,2,3,4].map(y => <option key={y} value={y} className="bg-slate-900">{y}st Year</option>)}
                      </select>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Access Channel</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="email" required placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/30 border border-white/5 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none text-white transition-all"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-400 transition-colors" size={18} />
                <input 
                  type="password" required placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-800/30 border border-white/5 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none text-white transition-all"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 mt-6"
            >
              {mode === 'login' ? 'Initialize Interface' : 'Launch Profile'} <ArrowRight size={18} />
            </motion.button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 text-center">
            <button className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
              <Sparkles size={14} /> Neural Connect: GitHub
            </button>
          </div>
        </div>
      </motion.div>
      <p className="mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-widest text-center max-w-xs leading-relaxed">
        System active. Connection encrypted. <br/>All professional coordinates strictly protected.
      </p>
    </div>
  );
};

export default Auth;
