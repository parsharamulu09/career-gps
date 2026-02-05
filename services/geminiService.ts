
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, CareerRole } from "../types";

// Fix: Strictly follow initialization guidelines - use process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_ANALYSIS: AnalysisResult = {
  score: 65,
  explanation: "Your profile shows strong foundational knowledge in programming but lacks specific implementation experience in modern frameworks required for this role.",
  matchedSkills: ["Python", "Java", "Basic React"],
  missingSkills: ["TypeScript", "Node.js", "PostgreSQL", "Tailwind CSS"],
  roadmap: [
    { title: "Fundamentals", status: "completed", skills: ["JavaScript", "HTML/CSS", "Git"] },
    { title: "Core Skills", status: "in-progress", skills: ["React", "TypeScript", "Node.js"] },
    { title: "Projects", status: "missing", skills: ["Full-Stack App", "Database Design"] },
    { title: "Industry Ready", status: "missing", skills: ["Testing", "CI/CD", "Performance"] }
  ],
  nextActions: [
    { type: 'skill', title: "Master TypeScript with React", description: "Learn type-safe development for enterprise apps.", details: "Focus on Generics and Hooks.", outcome: "Ability to build scalable frontend apps." },
    { type: 'project', title: "Full-Stack Inventory Manager", description: "Build a real-world CRUD application.", details: "Use React + Node + PostgreSQL.", outcome: "Portfolio piece showing database integration." },
    { type: 'opportunity', title: "Contribute to Supabase", description: "Open source contribution mission.", details: "Find beginner issues in the Supabase repo.", outcome: "Verified industry-level contribution." }
  ]
};

export const analyzeCareerPath = async (
  resumeText: string, 
  targetRole: CareerRole,
  studentSkills: string[]
): Promise<AnalysisResult> => {
  // Fix: Removed redundant API_KEY check as it's handled externally and is a hard requirement
  try {
    const prompt = `
      Analyze this student profile for the role: "${targetRole.title}".
      Student Declared Skills: ${studentSkills.join(', ')}
      Resume: ${resumeText}
      Target Core Skills: ${targetRole.requiredSkills.join(', ')}

      Calculate Readiness Score (0-100).
      Generate a 4-level Roadmap and exactly 3 Next Actions (1 Skill, 1 Project, 1 Opportunity).
      Respond STRICTLY in JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            explanation: { type: Type.STRING },
            matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            roadmap: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  status: { type: Type.STRING, enum: ['completed', 'in-progress', 'missing'] },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['title', 'status', 'skills']
              }
            },
            nextActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, enum: ['skill', 'project', 'opportunity'] },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  details: { type: Type.STRING },
                  outcome: { type: Type.STRING }
                },
                required: ['type', 'title', 'description', 'details', 'outcome']
              }
            }
          },
          required: ['score', 'explanation', 'matchedSkills', 'missingSkills', 'roadmap', 'nextActions']
        }
      }
    });

    // Fix: Using response.text property (not method) to get response content
    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.warn("Gemini Error, using fallback:", err);
    return FALLBACK_ANALYSIS;
  }
};

export const getModuleContent = async (skillTitle: string, level: string) => {
  // Fix: Removed redundant API_KEY check
  const prompt = `Generate learning notes for "${skillTitle}" at a ${level} level. Format as Markdown.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  // Fix: Accessing response.text as a property
  return response.text;
};

export const askMentor = async (question: string, context: string) => {
  // Fix: Removed redundant API_KEY check
  const prompt = `AI Mentor Answer for: ${context}. Question: ${question}`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  // Fix: Accessing response.text as a property
  return response.text;
};

export const parseResume = async (file: File): Promise<string> => {
  return "Simulated content: Java, Python, React. Engineering student.";
};