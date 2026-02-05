// services/geminiService.ts
// ✅ FRONTEND-SAFE MOCK AI SERVICE (HACKATHON READY)

import { AnalysisResult, CareerRole } from "../types";

export const analyzeCareerPath = async (
  resumeText: string,
  targetRole: CareerRole,
  studentSkills: string[]
): Promise<AnalysisResult> => {
  return {
    score: 72,
    explanation:
      "Your profile shows strong fundamentals. Completing real-world full-stack projects and TypeScript mastery will significantly improve your industry readiness.",

    matchedSkills: ["JavaScript", "React", "Python"],
    missingSkills: ["TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],

    roadmap: [
      {
        title: "Fundamentals",
        status: "completed",
        skills: ["HTML", "CSS", "JavaScript", "Git"],
      },
      {
        title: "Core Skills",
        status: "in-progress",
        skills: ["React", "TypeScript", "Node.js"],
      },
      {
        title: "Projects",
        status: "missing",
        skills: ["Full-Stack Inventory Manager", "API Integration"],
      },
      {
        title: "Industry Ready",
        status: "missing",
        skills: ["Testing", "CI/CD", "Deployment"],
      },
    ],

    nextActions: [
      {
        type: "skill",
        title: "Master TypeScript with React",
        description: "Learn type-safe React development.",
        details:
          "Covers generics, hooks, advanced typing, and best practices.",
        outcome: "Ability to build scalable enterprise-grade frontends.",
      },
      {
        type: "project",
        title: "Full-Stack Inventory Manager",
        description: "Build a CRUD app using React and Node.js.",
        details:
          "Upload GitHub repo to complete mission and update Skill Radar.",
        outcome: "Strong portfolio project.",
      },
      {
        type: "opportunity",
        title: "Open Source Contribution",
        description: "Contribute to beginner-friendly GitHub repositories.",
        details:
          "AI suggests repositories based on your skills.",
        outcome: "Verified open-source contribution.",
      },
    ],
  };
};

// 📘 Learning content mock
export const getModuleContent = async (skill: string, level: string) => {
  return `
### ${skill} — ${level}

**Recommended Learning**
- YouTube: https://www.youtube.com/results?search_query=${encodeURIComponent(
    skill + " " + level
  )}
- Docs: https://www.typescriptlang.org/docs/
- Practice: https://www.freecodecamp.org/

✅ Ask AI Mentor anytime for doubts.
`;
};

// 🤖 AI Mentor mock
export const askMentor = async (question: string, context: string) => {
  return `💡 Mentor Tip: To understand "${question}", practice small examples and apply it in your current ${context} mission.`;
};

// 📄 Resume parsing mock
export const parseResume = async (_file: File): Promise<string> => {
  return "Java, Python, React, Git, Engineering Student";
};
