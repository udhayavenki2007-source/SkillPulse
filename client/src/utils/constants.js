export const JOB_ROLES = [
  'Java Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Python Developer',
  'Data Analyst',
  'Data Scientist',
  'Software Engineer',
  'UI/UX Designer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Custom Job Role'
];

export const INTERVIEW_TYPES = [
  {
    id: 'Technical Interview',
    name: 'Technical Interview',
    desc: 'Deep dive into architecture, algorithms, coding logic, and system mechanics.',
    badge: 'Core Technical'
  },
  {
    id: 'HR Interview',
    name: 'HR Interview',
    desc: 'Company culture fit, career motivations, teamwork and interpersonal dynamics.',
    badge: 'Culture & Fit'
  },
  {
    id: 'Coding Interview',
    name: 'Coding Interview',
    desc: 'Live problem solving, algorithmic complexity analysis and edge cases.',
    badge: 'Hands-on Code'
  },
  {
    id: 'Behavioral Interview',
    name: 'Behavioral Interview',
    desc: 'STAR method questions focusing on conflict resolution, leadership and delivery.',
    badge: 'Situational'
  },
  {
    id: 'Project-Based Interview',
    name: 'Project-Based Interview',
    desc: 'Detailed defense of projects on your resume: architecture, bottlenecks, and tradeoffs.',
    badge: 'Resume Deep Dive'
  },
  {
    id: 'Managerial Interview',
    name: 'Managerial Interview',
    desc: 'Prioritization, resource allocation, technical leadership, and team mentoring.',
    badge: 'Leadership'
  },
  {
    id: 'Company-Specific Interview',
    name: 'Company-Specific Interview',
    desc: 'Simulated rounds matching Big Tech and Fortune 500 hiring rubrics.',
    badge: 'Targeted'
  },
  {
    id: 'Mixed Interview',
    name: 'Mixed Interview',
    desc: 'Balanced combination of technical depth, project inquiry, and behavioral evaluation.',
    badge: 'Comprehensive'
  }
];

export const PERSONALITIES = [
  {
    id: 'Friendly Interviewer',
    name: 'Friendly Interviewer',
    tagline: 'Polite, supportive and encouraging',
    desc: 'Fosters a low-stress environment. Rephrases questions gently to help beginners shine.',
    avatar: '😊',
    toneStyle: 'supportive',
    voicePitch: 1.1,
    voiceRate: 0.95
  },
  {
    id: 'Professional Interviewer',
    name: 'Professional Interviewer',
    tagline: 'Formal corporate style, balanced questioning',
    desc: 'Maintains neutral composure, structured pace, and objective standard questions.',
    avatar: '👔',
    toneStyle: 'formal',
    voicePitch: 1.0,
    voiceRate: 1.0
  },
  {
    id: 'Strict Interviewer',
    name: 'Strict Interviewer',
    tagline: 'Direct, rigorous and challenging',
    desc: 'Holds high expectations, questions vagueness, and tests candidate confidence under pressure.',
    avatar: '🧐',
    toneStyle: 'direct',
    voicePitch: 0.9,
    voiceRate: 1.05
  },
  {
    id: 'Technical Expert',
    name: 'Technical Expert',
    tagline: 'Deep architecture, asks follow-up edge cases',
    desc: 'Digs into low-level execution, internals, design trade-offs, and failure recovery.',
    avatar: '⚡',
    toneStyle: 'technical',
    voicePitch: 0.95,
    voiceRate: 1.0
  },
  {
    id: 'HR Interviewer',
    name: 'HR Interviewer',
    tagline: 'Behavioral, communication and situational',
    desc: 'Assesses emotional intelligence, clarity of communication, team collaboration, and alignment.',
    avatar: '🤝',
    toneStyle: 'behavioral',
    voicePitch: 1.05,
    voiceRate: 0.98
  }
];

export const DOMAIN_TRACKS = [
  { id: 1, name: 'Full Stack Development', slug: 'full-stack-dev', icon: 'Layers', desc: 'End-to-end web apps from frontend to backend and DB' },
  { id: 2, name: 'Java Backend Development', slug: 'java-backend-dev', icon: 'Server', desc: 'Enterprise microservices, Spring Boot, concurrency' },
  { id: 3, name: 'Frontend Development', slug: 'frontend-dev', icon: 'Layout', desc: 'Modern user interfaces, React, accessibility, state' },
  { id: 4, name: 'Python Development', slug: 'python-dev', icon: 'Code', desc: 'Modern Python APIs, async processing, automation' },
  { id: 5, name: 'Data Analytics', slug: 'data-analytics', icon: 'BarChart3', desc: 'SQL modeling, dashboards, business intelligence' },
  { id: 6, name: 'Data Science', slug: 'data-science', icon: 'Brain', desc: 'Statistical ML, predictive modeling, data pipelines' },
  { id: 7, name: 'AI / ML Engineering', slug: 'aiml-engineering', icon: 'Cpu', desc: 'Deep learning, LLMs, neural networks, vector databases' },
  { id: 8, name: 'Cloud Computing', slug: 'cloud-computing', icon: 'Cloud', desc: 'AWS/GCP infrastructure, Terraform, container orchestration' },
  { id: 9, name: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield', desc: 'Network defense, penetration testing, secure app coding' }
];
