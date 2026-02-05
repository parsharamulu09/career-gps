
import { CareerRole, Branch, ActionItem } from './types';

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'web-dev',
    title: 'Full Stack Web Developer',
    description: 'Build modern web applications using React, Node.js, and Databases.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git', 'REST APIs']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Transform raw data into meaningful insights using statistical tools.',
    requiredSkills: ['Python', 'SQL', 'Tableau', 'Pandas', 'Excel', 'Statistics', 'PowerBI']
  },
  {
    id: 'ai-ml',
    title: 'AI/ML Engineer',
    description: 'Design and implement machine learning models and AI systems.',
    requiredSkills: ['Python', 'PyTorch', 'Linear Algebra', 'Scikit-learn', 'NLP', 'Computer Vision', 'Deep Learning']
  },
  {
    id: 'devops',
    title: 'DevOps Engineer',
    description: 'Bridge the gap between development and operations with automation.',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Shell Scripting']
  }
];

export const BRANCHES = Object.values(Branch);

/**
 * PREDEFINED CAREER SKILL MAPS
 * This drives the "Progression Engine". When a skill is completed, 
 * the next one in the array for the target role is recommended.
 */
export const CAREER_SKILL_MAPS: Record<string, ActionItem[]> = {
  "web-dev": [
    { 
      type: 'skill', 
      title: "Master TypeScript with React", 
      description: "Learn type-safe development for enterprise apps.", 
      outcome: "Ability to build scalable frontend apps.",
      details: "Focus on Generics and Hooks."
    },
    { 
      type: 'skill', 
      title: "Node.js & Express Backend Development", 
      description: "Learn server-side development, APIs, middleware, and backend architecture.", 
      outcome: "Build robust and secure backend services.",
      details: "Master Express.js and JWT Auth."
    },
    { 
      type: 'skill', 
      title: "Database Design with PostgreSQL", 
      description: "Master relational data modeling, indexing, and complex SQL queries.", 
      outcome: "Handle complex data persistent layers for scale.",
      details: "Learn normalization and Joins."
    },
    { 
      type: 'skill', 
      title: "RESTful API Design & Security", 
      description: "Advanced concepts in building secure, documented, and scalable APIs.", 
      outcome: "Industry-standard API architecture.",
      details: "OAuth2 and Swagger integration."
    }
  ],
  "data-analyst": [
    { type: 'skill', title: "Python for Data Science", description: "Master NumPy and Pandas for data manipulation.", outcome: "Clean and process raw data effectively." },
    { type: 'skill', title: "SQL Mastery for Analytics", description: "Advanced queries, aggregations, and window functions.", outcome: "Extract insights from relational databases." },
    { type: 'skill', title: "Data Visualization with Tableau", description: "Create interactive dashboards and storyboards.", outcome: "Communicate data insights to stakeholders." }
  ],
  "ai-ml": [
    { type: 'skill', title: "Linear Algebra & Calculus for ML", description: "The mathematical foundations of machine learning.", outcome: "Understand how models work under the hood." },
    { type: 'skill', title: "Machine Learning with Scikit-learn", description: "Supervised and unsupervised learning algorithms.", outcome: "Build and evaluate predictive models." },
    { type: 'skill', title: "Deep Learning with PyTorch", description: "Neural networks, CNNs, and RNNs.", outcome: "Implement cutting-edge AI architectures." }
  ],
  "devops": [
    { type: 'skill', title: "Linux Systems Administration", description: "Master the command line and server management.", outcome: "Manage cloud infrastructure effectively." },
    { type: 'skill', title: "Docker & Containerization", description: "Package applications for consistent deployment.", outcome: "Build portable development environments." },
    { type: 'skill', title: "CI/CD Pipeline Automation", description: "Automate testing and deployment with GitHub Actions.", outcome: "High-velocity delivery cycles." }
  ]
};

export const OPEN_SOURCE_REPOS = [
  {
    name: "React Hook Form",
    description: "Performant, flexible and extensible forms with easy-to-use validation.",
    link: "https://github.com/react-hook-form/react-hook-form",
    tags: ["React", "TypeScript", "Beginner Friendly"]
  },
  {
    name: "Supabase",
    description: "The open source Firebase alternative. Great for learning PostgreSQL and Auth.",
    link: "https://github.com/supabase/supabase",
    tags: ["PostgreSQL", "Go", "TypeScript"]
  },
  {
    name: "FreeCodeCamp",
    description: "The massive open source codebase and curriculum. Excellent for first-time contributors.",
    link: "https://github.com/freeCodeCamp/freeCodeCamp",
    tags: ["JavaScript", "Education", "Node.js"]
  },
  {
    name: "Tailwind UI",
    description: "Explore headless UI components and learn advanced CSS architecture.",
    link: "https://github.com/tailwindlabs/headlessui",
    tags: ["React", "CSS", "UI/UX"]
  }
];

export const PROJECT_TEMPLATES: Record<string, { stack: string[], features: string[] }> = {
  "Full-Stack Inventory Manager": {
    stack: ["React", "Node.js", "PostgreSQL", "Tailwind"],
    features: ["CRUD Operations", "Dashboard Visualization", "JWT Authentication", "CSV Export"]
  },
  "AI Resume Parser": {
    stack: ["Python", "Flask", "Gemini API", "React"],
    features: ["File Upload", "Skill Extraction", "PDF Generation", "Match Scoring"]
  }
};

export interface SkillModule {
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  notes: string;
  videos: { title: string; url: string }[];
  docs: { title: string; url: string }[];
}

export const SKILL_KNOWLEDGE_BASE: Record<string, SkillModule[]> = {
  "TypeScript": [
    {
      title: "Basics of TypeScript with React",
      level: "Beginner",
      notes: "TypeScript is a strongly typed superset of JavaScript. In React, it helps define props, state, and event types to catch errors at compile-time rather than runtime. This fundamental level covers interfaces, types, and the basic configuration required to run TS in a React environment.",
      videos: [{ title: "TypeScript for React Beginners", url: "https://www.youtube.com/watch?v=jrKcJxF0lAU" }],
      docs: [
        { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/" },
        { title: "React + TS Cheatsheet", url: "https://react-typescript-cheatsheet.netlify.app/" }
      ]
    },
    {
      title: "Intermediate TypeScript Patterns",
      level: "Intermediate",
      notes: "Focus on Generics, Union Types, and Type Guards. Learn how to type complex hooks like useReducer and custom context providers. Intermediate patterns allow you to write reusable components that maintain strict type safety across different data structures.",
      videos: [{ title: "Advanced TS Patterns in React", url: "https://www.youtube.com/watch?v=Z5iWr6Srsj8" }],
      docs: [{ title: "Advanced Types", url: "https://www.typescriptlang.org/docs/handbook/2/types-from-types.html" }]
    },
    {
      title: "Advanced Implementation",
      level: "Advanced",
      notes: "Master utility types (Partial, Omit, Pick) and conditional types. Learn to optimize React performance with memoization and strictly typed refs. At this level, you should be able to type external libraries and handle high-level architecture decisions using advanced TS features.",
      videos: [{ title: "Optimizing React with TS", url: "https://www.youtube.com/watch?v=9tZkX2R2QzA" }],
      docs: [{ title: "React Render & Commit", url: "https://react.dev/learn/render-and-commit" }]
    }
  ],
  "Node.js & Express Backend Development": [
    {
      title: "Node.js Runtime & Express.js Setup",
      level: "Beginner",
      notes: "Understand the Node.js event loop and how to set up a basic Express.js server. Learn about routing and handling HTTP requests and responses.",
      videos: [{ title: "Express.js Fast Track", url: "https://www.youtube.com/watch?v=L72fhGm1tfE" }],
      docs: [{ title: "Express Getting Started", url: "https://expressjs.com/en/starter/installing.html" }]
    },
    {
      title: "Middleware & Request Pipeline",
      level: "Intermediate",
      notes: "Learn how to use built-in and third-party middleware for logging, parsing JSON, and handling errors. Master custom middleware creation for logic like authentication checks.",
      videos: [{ title: "Middleware Masterclass", url: "https://www.youtube.com/watch?v=lY6icfhap2o" }],
      docs: [{ title: "Using Middleware", url: "https://expressjs.com/en/guide/using-middleware.html" }]
    },
    {
      title: "Scalable Architecture & Authentication",
      level: "Advanced",
      notes: "Structure your backend for scale using MVC or clean architecture patterns. Implement secure authentication using JWT (JSON Web Tokens).",
      videos: [{ title: "Clean Architecture in Node", url: "https://www.youtube.com/watch?v=CnailTcJV_U" }],
      docs: [{ title: "JWT Introduction", url: "https://jwt.io/introduction/" }]
    }
  ],
  "Database Design with PostgreSQL": [
    {
      title: "Introduction to RDBMS & SQL Basics",
      level: "Beginner",
      notes: "Learn about relational databases and basic SQL commands: SELECT, INSERT, UPDATE, DELETE. Set up a local PostgreSQL instance.",
      videos: [{ title: "SQL for Beginners", url: "https://www.youtube.com/watch?v=HXV3zeQKqGY" }],
      docs: [{ title: "PostgreSQL Tutorial", url: "https://www.postgresqltutorial.com/" }]
    },
    {
      title: "Data Modeling & Relationships",
      level: "Intermediate",
      notes: "Master table relationships: One-to-One, One-to-Many, and Many-to-Many. Learn about Primary Keys and Foreign Keys.",
      videos: [{ title: "Database Normalization", url: "https://www.youtube.com/watch?v=076p_G_hndI" }],
      docs: [{ title: "Database Design Guide", url: "https://www.ntu.edu.sg/home/ehchua/programming/sql/Relational_Database_Design.html" }]
    },
    {
      title: "Indexing, Performance & Transactions",
      level: "Advanced",
      notes: "Optimize your database for speed with indexes. Learn about ACID properties and handling database transactions.",
      videos: [{ title: "Postgres Indexing Deep Dive", url: "https://www.youtube.com/watch?v=ni-T6u6FpXo" }],
      docs: [{ title: "PostgreSQL Indexing", url: "https://www.postgresql.org/docs/current/indexes.html" }]
    }
  ],
  "React": [
    {
      title: "React Fundamentals",
      level: "Beginner",
      notes: "Components, Props, and State are the building blocks. Learn the 'Thinking in React' philosophy and how data flows through a component tree.",
      videos: [{ title: "React Crash Course", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" }],
      docs: [{ title: "React.dev Intro", url: "https://react.dev/learn" }]
    },
    {
      title: "Hooks & State Management",
      level: "Intermediate",
      notes: "useEffect, useContext, and custom hooks. Avoid common pitfalls like infinite render loops and learn how to lift state effectively.",
      videos: [{ title: "React Hooks Explained", url: "https://www.youtube.com/watch?v=LlvBzyy-558" }],
      docs: [{ title: "Built-in React Hooks", url: "https://react.dev/reference/react" }]
    },
    {
      title: "Advanced Design Patterns",
      level: "Advanced",
      notes: "Higher Order Components (HOCs), Render Props, and the Compound Component pattern for building scalable UI libraries.",
      videos: [{ title: "Modern React Patterns", url: "https://www.youtube.com/watch?v=V-G7WZzT7NM" }],
      docs: [{ title: "Scaling React Apps", url: "https://react.dev/learn/scaling-up-with-reducer-and-context" }]
    }
  ]
};

// Aliasing for common action titles to prevent "Content unavailable"
SKILL_KNOWLEDGE_BASE["Master TypeScript with React"] = SKILL_KNOWLEDGE_BASE["TypeScript"];
SKILL_KNOWLEDGE_BASE["React Deep Dive"] = SKILL_KNOWLEDGE_BASE["React"];
