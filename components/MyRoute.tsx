
import React, { useState } from 'react';
import { AnalysisResult, CareerRole, User } from '../types';
import { MapPin, Navigation, CheckCircle2, Circle, AlertCircle, ArrowRight, Download, Check, Compass, Loader2, Flag, Mountain, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';

interface MyRouteProps {
  analysis: AnalysisResult | null;
  targetRole: CareerRole | null;
  user: User;
}

const MyRoute: React.FC<MyRouteProps> = ({ analysis, targetRole, user }) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!analysis || !targetRole) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400 bg-white rounded-[3rem] border border-dashed border-slate-200">
        <Navigation size={64} className="mb-6 opacity-10 animate-pulse" />
        <h3 className="text-xl font-bold text-slate-900">GPS Signal Lost</h3>
        <p className="text-sm mt-2">Resume calibration required to calculate your route.</p>
      </div>
    );
  }

  const handleDownloadStrategy = () => {
    setDownloading(true);
    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = 20;

      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229);
      doc.text("CAREER GPS STRATEGY REPORT", margin, y);
      y += 15;

      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text(`Target Destination: ${targetRole.title}`, margin, y);
      y += 10;
      doc.text(`Candidate: ${user.name}`, margin, y);
      y += 10;
      doc.text(`Current Fit Score: ${analysis.score}%`, margin, y);
      y += 20;

      doc.setFontSize(16);
      doc.text("Route Milestones", margin, y);
      y += 10;
      doc.setFontSize(11);
      analysis.roadmap.forEach((step, i) => {
        doc.text(`${i+1}. ${step.title} (${step.status.toUpperCase()})`, margin + 5, y);
        y += 7;
        doc.setTextColor(100, 116, 139);
        doc.text(`   Focus: ${step.skills.join(', ')}`, margin + 5, y);
        y += 10;
        doc.setTextColor(15, 23, 42);
      });

      y += 10;
      doc.setFontSize(16);
      doc.text("Career GPS Advice", margin, y);
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      const adviceText = `Based on your current speed, you are on track to be industry-ready by the end of your ${user.year || 3}rd year. Focus on project implementation and open-source contributions to boost your score past 80%. Your next priority should be mastering ${analysis.missingSkills[0] || 'advanced architecture'}.`;
      const wrappedAdvice = doc.splitTextToSize(adviceText, 170);
      doc.text(wrappedAdvice, margin, y);

      doc.save(`Career_GPS_${user.name.replace(' ', '_')}_Strategy.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Calibration error during PDF generation. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-slate-900 p-10 md:p-14 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                <Mountain size={12} /> Expedition Map
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight">{targetRole.title}</h2>
              <p className="text-slate-400 text-lg font-medium italic">Current Navigation Path Active</p>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadStrategy}
              disabled={downloading}
              className={`px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl transition-all ${
                downloadSuccess ? 'bg-emerald-600' : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {downloading ? <Loader2 className="animate-spin" /> : downloadSuccess ? <><Check size={18} /> Downloaded</> : <><Download size={18} /> Get Strategy PDF</>}
            </motion.button>
          </div>
          
          {/* Visual Roadmap Path */}
          <div className="relative h-48 flex items-center justify-center">
            <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-white/10 -translate-y-1/2 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${(analysis.roadmap.filter(s => s.status === 'completed').length / (analysis.roadmap.length)) * 100}%` }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400"
               />
            </div>
            <div className="flex justify-between w-full relative z-10 px-4">
              {analysis.roadmap.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center gap-5"
                >
                  <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center border-4 shadow-2xl transition-all ${
                    step.status === 'completed' ? 'bg-emerald-600 border-emerald-900/50 text-white' : 
                    step.status === 'in-progress' ? 'bg-indigo-600 border-indigo-900/50 text-white animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 size={28} /> : step.status === 'in-progress' ? <Navigation size={24} className="animate-bounce" /> : <Flag size={24} />}
                  </div>
                  <div className="text-center w-36">
                    <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${step.status === 'missing' ? 'text-slate-600' : 'text-indigo-400'}`}>Node {i + 1}</div>
                    <div className={`text-xs font-bold mt-1.5 ${step.status === 'missing' ? 'text-slate-500' : 'text-white'} leading-tight`}>{step.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100"
        >
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
            <div className="p-2.5 bg-indigo-50 rounded-2xl text-indigo-600"><AlertCircle size={24} /></div>
            Course Correction
          </h3>
          <div className="space-y-6">
            {analysis.roadmap.filter(s => s.status !== 'completed').map((step, i) => (
              <div key={i} className="flex gap-6 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 group hover:border-indigo-300 transition-all">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-200 text-slate-400 group-hover:text-indigo-500 transition-colors">
                  <Navigation size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{step.title}</h4>
                  <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">Focus on: {step.skills.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-200 relative overflow-hidden"
        >
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
            <div className="p-2.5 bg-white/10 rounded-2xl text-white"><Compass size={24} /></div>
            Career GPS Advice
          </h3>
          <div className="p-8 bg-white/10 rounded-[2rem] border border-white/20 backdrop-blur-sm relative z-10">
            <p className="text-lg leading-relaxed italic font-medium">
              "Based on your current speed, you are on track to be industry-ready by the end of your {user.year || 3}rd year. Focus on project implementation and open-source contributions to boost your score past 80%."
            </p>
            <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center font-black">AI</div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-indigo-200">System Recommendation</div>
                <div className="text-xs font-bold flex items-center gap-1.5"><Info size={12} /> Optimal Route Calibrated</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MyRoute;
