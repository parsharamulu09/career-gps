
import React, { useState, useEffect } from 'react';
import { Upload, FileText, X, Loader2, Navigation, UserCircle } from 'lucide-react';
import { Branch, StudentProfile } from '../types';
import { CAREER_ROLES, BRANCHES } from '../constants';

interface ResumeUploaderProps {
  onAnalyze: (profile: StudentProfile) => void;
  isAnalyzing: boolean;
  initialName?: string;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onAnalyze, isAnalyzing, initialName }) => {
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<Partial<StudentProfile>>({
    name: initialName || '',
    branch: Branch.CSE,
    year: 3,
    targetRole: CAREER_ROLES[0].id,
    skills: []
  });

  useEffect(() => {
    if (initialName) {
      setProfile(prev => ({ ...prev, name: initialName }));
    }
  }, [initialName]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profile.name && profile.targetRole && profile.branch) {
      onAnalyze(profile as StudentProfile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl mb-4">
          <Navigation size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">Start Your Journey</h2>
        <p className="text-slate-500 mt-2">Enter your coordinates and upload your resume for a precise route mapping.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
        {/* Profile Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <UserCircle size={16} /> Full Name
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-slate-50/30"
              placeholder="e.g. John Doe"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Engineering Branch</label>
            <select
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={profile.branch}
              onChange={e => setProfile({...profile, branch: e.target.value as Branch})}
            >
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Target Destination */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Select Your Destination (Target Role)</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CAREER_ROLES.map(role => (
              <button
                key={role.id}
                type="button"
                onClick={() => setProfile({...profile, targetRole: role.id})}
                className={`p-4 rounded-xl border text-left transition-all ${
                  profile.targetRole === role.id 
                    ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-sm">{role.title}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{role.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Resume Section */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Your Resume (Current Position)</label>
          {file ? (
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                <FileText className="text-indigo-600" />
                <div>
                  <div className="text-sm font-bold truncate max-w-[200px]">{file.name}</div>
                  <div className="text-[10px] text-slate-400">{(file.size / 1024).toFixed(0)} KB</div>
                </div>
              </div>
              <button type="button" onClick={() => setFile(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>
          ) : (
            <div className="relative group">
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-slate-200 group-hover:border-indigo-400 transition-all rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50">
                <Upload className="text-slate-400 mb-3 group-hover:text-indigo-500 transition-all" size={32} />
                <p className="text-sm font-medium text-slate-600">Click to upload or drag & drop</p>
                <p className="text-xs text-slate-400 mt-1">PDF or DOCX up to 5MB</p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isAnalyzing || !profile.name}
          className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
        >
          {isAnalyzing ? (
            <><Loader2 className="animate-spin" /> Calculating Route...</>
          ) : (
            <>Calibrate GPS & Start Navigate</>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-slate-400">
        Career GPS uses advanced AI to map your current skills to industry standards.
      </p>
    </div>
  );
};

export default ResumeUploader;
