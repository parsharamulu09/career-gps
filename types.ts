
export enum Branch {
  CSE = 'Computer Science',
  ECE = 'Electronics & Communication',
  ME = 'Mechanical',
  CE = 'Civil',
  EE = 'Electrical'
}

export type AppView = 'dashboard' | 'route' | 'profile' | 'mission-skill' | 'mission-project' | 'mission-os';

export interface User {
  name: string;
  email: string;
  role: 'student' | 'admin';
  branch?: Branch;
  year?: number;
  completedSkills: string[];
  completedProjects: string[];
  contributions: number;
  streak: number;
  totalTime: number; // in minutes
  lastActiveDate?: string;
}

export interface Skill {
  name: string;
  category: 'technical' | 'soft' | 'tool';
}

export interface CareerRole {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
}

export interface ActionItem {
  type: 'skill' | 'project' | 'opportunity';
  title: string;
  description: string;
  details?: string;
  resources?: string[];
  outcome?: string;
  link?: string;
}

export interface RoadmapLevel {
  title: string;
  status: 'completed' | 'in-progress' | 'missing';
  skills: string[];
}

export interface AnalysisResult {
  score: number;
  explanation: string;
  matchedSkills: string[];
  missingSkills: string[];
  roadmap: RoadmapLevel[];
  nextActions: ActionItem[];
}

export interface StudentProfile {
  name: string;
  branch: Branch;
  year: number;
  targetRole: string;
  skills: string[];
  resumeText?: string;
}
