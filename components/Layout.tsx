
import React, { useState, useEffect } from 'react';
import { Compass, GraduationCap, LayoutDashboard, LogOut, Flame, Clock, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, AppView } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  onStreakEarned?: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, activeView, onViewChange, onStreakEarned, children }) => {
  const [sessionTime, setSessionTime] = useState(0);
  const [isStreakActive, setIsStreakActive] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => {
        const next = prev + 1;
        // 1200 seconds = 20 minutes
        if (next >= 1200 && !isStreakActive) {
          setIsStreakActive(true);
          onStreakEarned?.();
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isStreakActive, onStreakEarned]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      <motion.nav 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-72 bg-slate-900 text-white md:h-screen sticky top-0 z-50 p-6 flex flex-col shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-12">
          <motion.div whileHover={{ rotate: 90 }} className="bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Compass className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Career GPS</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Navigation v2.0</p>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
          <NavItem icon={<GraduationCap size={20} />} label="My Route" active={activeView === 'route'} onClick={() => onViewChange('route')} />
          <NavItem icon={<UserIcon size={20} />} label="Profile" active={activeView === 'profile'} onClick={() => onViewChange('profile')} />
        </div>

        <div className="mt-8 p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <Clock size={12} /> Focus Session
            </div>
            <span className="text-xs font-mono font-bold text-indigo-400">{formatTime(sessionTime)}</span>
          </div>
          
          <AnimatePresence mode="wait">
            {isStreakActive ? (
              <motion.div key="streak" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-2 text-rose-400 justify-center py-1">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  <Flame size={18} fill="currentColor" />
                </motion.div>
                <span className="text-xs font-black uppercase tracking-widest">On Fire!</span>
              </motion.div>
            ) : (
              <div key="progress" className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (sessionTime / 1200) * 100)}%` }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" />
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-800/50 space-y-5">
          <div onClick={() => onViewChange('profile')} className="flex items-center gap-4 cursor-pointer group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm border-2 border-white/10 group-hover:border-indigo-400 transition-all shadow-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate group-hover:text-indigo-400 transition-colors">{user.name}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold truncate">{user.branch}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400 rounded-xl transition-all text-sm font-black uppercase tracking-widest hover:bg-rose-500/10">
            <LogOut size={18} /> Exit Platform
          </button>
        </div>
      </motion.nav>

      <main className="flex-1 max-w-7xl mx-auto w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={activeView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="p-6 md:p-12">
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative ${active ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}>
    {active && <motion.div layoutId="nav-bg" className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20 -z-10" />}
    <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </button>
);

export default Layout;
