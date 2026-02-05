
import React, { useState, useCallback, useEffect } from 'react';
import Layout from './components/Layout';
import Auth from './components/Auth';
import ResumeUploader from './components/ResumeUploader';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import MyRoute from './components/MyRoute';
import SkillMission from './components/missions/SkillMission';
import ProjectMission from './components/missions/ProjectMission';
import OSMission from './components/missions/OSMission';
import ShareModal from './components/ShareModal';
import { AnalysisResult, StudentProfile, User, AppView, ActionItem } from './types';
import { CAREER_ROLES, CAREER_SKILL_MAPS } from './constants';
import { analyzeCareerPath } from './services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeProfile, setActiveProfile] = useState<StudentProfile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [view, setView] = useState<AppView>('dashboard');
  const [activeAction, setActiveAction] = useState<ActionItem | null>(null);
  const [showStreakToast, setShowStreakToast] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('career_gps_user');
    const savedAnalysis = localStorage.getItem('career_gps_analysis');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const today = new Date().toDateString();
      if (parsedUser.lastActiveDate !== today) {
        parsedUser.lastActiveDate = today;
      }
      setUser(parsedUser);
    }
    if (savedAnalysis) {
      const parsedAnalysis = JSON.parse(savedAnalysis);
      setAnalysis(parsedAnalysis);
    }
    setIsAuthLoading(false);
  }, []);

  const handleLogin = (newUser: User) => {
    const today = new Date().toDateString();
    const enrichedUser: User = {
      ...newUser,
      completedSkills: newUser.completedSkills || [],
      completedProjects: newUser.completedProjects || [],
      contributions: newUser.contributions || 0,
      streak: newUser.streak || 1,
      totalTime: newUser.totalTime || 0,
      lastActiveDate: today
    };
    setUser(enrichedUser);
    localStorage.setItem('career_gps_user', JSON.stringify(enrichedUser));
  };

  const handleLogout = () => {
    setUser(null);
    setAnalysis(null);
    setActiveProfile(null);
    localStorage.removeItem('career_gps_user');
    localStorage.removeItem('career_gps_analysis');
    setView('dashboard');
  };

  const handleStartAnalysis = useCallback(async (profile: StudentProfile) => {
    setIsAnalyzing(true);
    setActiveProfile(profile);
    const targetRole = CAREER_ROLES.find(r => r.id === profile.targetRole)!;
    try {
      const resumeText = profile.resumeText || "Candidate interested in development.";
      const result = await analyzeCareerPath(resumeText, targetRole, profile.skills);
      setAnalysis(result);
      localStorage.setItem('career_gps_analysis', JSON.stringify(result));
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * PROGRESSION ENGINE
   */
  const handleUpdateAnalysis = (updatedAnalysis: AnalysisResult) => {
    if (activeAction?.type === 'skill' && activeProfile) {
      const skillMap = CAREER_SKILL_MAPS[activeProfile.targetRole] || CAREER_SKILL_MAPS["web-dev"];
      const currentIndex = skillMap.findIndex(s => s.title === activeAction.title);
      
      const nextSkillIndex = currentIndex + 1;
      if (nextSkillIndex < skillMap.length) {
        const nextSkillAction = skillMap[nextSkillIndex];
        updatedAnalysis.nextActions = updatedAnalysis.nextActions.map(action => 
          action.type === 'skill' ? nextSkillAction : action
        );
      } else {
        updatedAnalysis.nextActions = updatedAnalysis.nextActions.filter(action => action.type !== 'skill');
      }
    }

    updatedAnalysis.roadmap = updatedAnalysis.roadmap.map(step => {
      const hasCompletedRequired = step.skills.every(skill => updatedAnalysis.matchedSkills.includes(skill));
      if (hasCompletedRequired) return { ...step, status: 'completed' };
      const hasStarted = step.skills.some(skill => updatedAnalysis.matchedSkills.includes(skill));
      if (hasStarted) return { ...step, status: 'in-progress' };
      return step;
    });

    setAnalysis({ ...updatedAnalysis });
    localStorage.setItem('career_gps_analysis', JSON.stringify(updatedAnalysis));
    
    if (user) {
      const newUser = { 
        ...user,
        completedSkills: updatedAnalysis.matchedSkills,
      };
      const completedSteps = updatedAnalysis.roadmap.filter(s => s.status === 'completed').length;
      if (completedSteps > user.completedProjects.length) {
        newUser.completedProjects = [...user.completedProjects, `Milestone ${completedSteps}`];
      }
      setUser(newUser);
      localStorage.setItem('career_gps_user', JSON.stringify(newUser));
    }
  };

  const handleMissionComplete = (updatedAnalysis: AnalysisResult) => {
    handleUpdateAnalysis(updatedAnalysis);
    setView('dashboard');
    setActiveAction(null);
  };

  const handleStreakEarned = () => {
    if (user) {
      const newUser = { ...user, streak: (user.streak || 0) + 1 };
      setUser(newUser);
      localStorage.setItem('career_gps_user', JSON.stringify(newUser));
      setShowStreakToast(true);
      setTimeout(() => setShowStreakToast(false), 5000);
    }
  };

  const navigateToMission = (action: ActionItem) => {
    setActiveAction(action);
    if (action.type === 'skill') setView('mission-skill');
    else if (action.type === 'project') setView('mission-project');
    else if (action.type === 'opportunity') setView('mission-os');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="text-indigo-500 animate-pulse font-bold text-xl uppercase tracking-[0.2em]">GPS Calibrating...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderContent = () => {
    if (!analysis) {
      return (
        <ResumeUploader onAnalyze={handleStartAnalysis} isAnalyzing={isAnalyzing} initialName={user.name} />
      );
    }

    const currentRole = CAREER_ROLES.find(r => r.id === (activeProfile?.targetRole || 'web-dev'))!;

    switch (view) {
      case 'profile': return <Profile user={user} analysis={analysis} onOpenShare={() => setIsShareModalOpen(true)} />;
      case 'route': return <MyRoute user={user} analysis={analysis} targetRole={currentRole} />;
      case 'mission-skill': return activeAction ? <SkillMission item={activeAction} analysis={analysis} onBack={() => setView('dashboard')} onComplete={handleMissionComplete} /> : null;
      case 'mission-project': return activeAction ? <ProjectMission item={activeAction} analysis={analysis} onBack={() => setView('dashboard')} onComplete={handleMissionComplete} /> : null;
      case 'mission-os': return activeAction ? <OSMission item={activeAction} analysis={analysis} onBack={() => setView('dashboard')} onComplete={handleMissionComplete} /> : null;
      default: return (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation Center</h2>
              <p className="text-slate-900 font-bold">Route: {user.name}'s Journey</p>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black rounded-xl transition-all uppercase tracking-wider">Reset Path</button>
          </div>
          <Dashboard 
            analysis={analysis} 
            targetRole={currentRole} 
            onUpdateAnalysis={handleUpdateAnalysis} 
            onNavigateMission={navigateToMission} 
            onOpenShare={() => setIsShareModalOpen(true)}
          />
        </div>
      );
    }
  };

  return (
    <Layout user={user} onLogout={handleLogout} activeView={view} onViewChange={setView} onStreakEarned={handleStreakEarned}>
      {renderContent()}
      
      <AnimatePresence>
        {showStreakToast && (
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="fixed bottom-10 right-10 bg-rose-600 text-white p-6 rounded-[2rem] shadow-2xl z-[200] flex items-center gap-4 border-4 border-rose-500">
            <div className="text-3xl animate-bounce">🔥</div>
            <div>
              <h4 className="font-black uppercase tracking-tighter text-lg">Streak Level Up!</h4>
              <p className="text-xs font-bold text-rose-100">You've reached your 20-min focus goal.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {analysis && (
        <ShareModal 
          isOpen={isShareModalOpen} 
          onClose={() => setIsShareModalOpen(false)} 
          user={user} 
          analysis={analysis} 
          targetRole={CAREER_ROLES.find(r => r.id === (activeProfile?.targetRole || 'web-dev'))!} 
        />
      )}
    </Layout>
  );
};

export default App;
