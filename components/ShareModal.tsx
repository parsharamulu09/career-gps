
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon, Copy, Link as LinkIcon, Check, Download, Share2, Sparkles, ArrowLeft, Loader2, MessageCircle, Linkedin } from 'lucide-react';
import { User, AnalysisResult, CareerRole } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  analysis: AnalysisResult;
  targetRole: CareerRole;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, user, analysis, targetRole }) => {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);

  const shareText = `🚀 My Career Progress with Career GPS\n\n🎯 Role: ${targetRole.title}\n📊 Skill Fit: ${analysis.score}%\n🔥 Streak: ${user.streak} days\n🛠 Projects Completed: ${user.completedProjects.length}\n\nStart your journey 🚀`;
  const appUrl = "https://career-gps.app"; // Mock public URL
  const publicShareUrl = `${appUrl}/share/${user.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToWhatsApp = () => {
    const encodedText = encodeURIComponent(shareText + "\n\n" + publicShareUrl);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const shareToLinkedIn = () => {
    const encodedUrl = encodeURIComponent(publicShareUrl);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank');
  };

  const generateImage = () => {
    setGenerating(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setGenerating(false);
      return;
    }

    // Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0F172A'); 
    bgGrad.addColorStop(1, '#1E293B'); 
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Decorative Circle
    ctx.beginPath();
    ctx.arc(1100, 100, 300, 0, Math.PI * 2);
    const circleGrad = ctx.createRadialGradient(1100, 100, 50, 1100, 100, 300);
    circleGrad.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    circleGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = circleGrad;
    ctx.fill();

    // Text Setup
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('CAREER GPS PROGRESS', 80, 100);

    ctx.font = 'bold 80px sans-serif';
    ctx.fillText(user.name, 80, 200);
    
    ctx.font = '30px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`TARGET: ${targetRole.title.toUpperCase()}`, 80, 250);

    ctx.fillStyle = '#6366F1';
    ctx.font = 'bold 120px sans-serif';
    ctx.fillText(`${analysis.score}%`, 80, 420);
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('SKILL FIT MATCH', 250, 420);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(`SKILLS: ${user.completedSkills.length}`, 80, 520);
    ctx.fillText(`PROJECTS: ${user.completedProjects.length}`, 350, 520);
    ctx.fillText(`STREAK: ${user.streak} DAYS 🔥`, 700, 520);

    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText('VERIFIED AT CAREER-GPS.APP', 80, 580);

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `CareerGPS_Stats_${user.name.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
    setGenerating(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden relative z-[210] flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-100">
              <button onClick={onClose} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-[10px] uppercase tracking-widest">
                <ArrowLeft size={16} /> Back
              </button>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Share Career Stats</h2>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              {/* Preview Card */}
              <div className="bg-slate-900 p-8 rounded-[2rem] text-white mb-8 relative overflow-hidden border-4 border-slate-800 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <h3 className="text-xl font-black">{user.name}</h3>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">{targetRole.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-indigo-400">{analysis.score}%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Readiness</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 relative z-10">
                  <div className="text-center">
                    <div className="text-lg font-black">{user.completedSkills.length}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black">{user.completedProjects.length}</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-black">{user.streak}d</div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Streak</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={shareToWhatsApp}
                    className="flex items-center justify-center gap-3 p-5 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-emerald-100 transition-all border border-emerald-100"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                  <button 
                    onClick={shareToLinkedIn}
                    className="flex items-center justify-center gap-3 p-5 bg-blue-50 text-blue-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-blue-100 transition-all border border-blue-100"
                  >
                    <Linkedin size={18} /> LinkedIn
                  </button>
                </div>

                <button
                  onClick={generateImage}
                  disabled={generating}
                  className="w-full flex items-center justify-between p-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] hover:bg-indigo-700 transition-all group shadow-lg shadow-indigo-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg"><ImageIcon size={18} /></div>
                    <span>Download Stats Image</span>
                  </div>
                  {generating ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />}
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCopyText}
                    className="flex items-center justify-center gap-3 p-5 bg-slate-50 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-slate-100 transition-all border border-slate-200"
                  >
                    {copied ? <><Check size={16} className="text-emerald-500" /> Copied</> : <><Copy size={16} /> Copy Text</>}
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-3 p-5 bg-slate-50 text-slate-700 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] hover:bg-slate-100 transition-all border border-slate-200"
                  >
                    {copied ? <><Check size={16} className="text-emerald-500" /> Copied</> : <><LinkIcon size={16} /> Copy Link</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-4">
              <button 
                onClick={onClose}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
              >
                Close
              </button>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
                <Sparkles size={12} className="text-indigo-500" /> Career GPS: Navigation Layer Active
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
