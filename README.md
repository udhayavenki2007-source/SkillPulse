# INTERVIEWIQ AI
### AI-Powered Adaptive Interview Preparation & Domain Skill Intelligence Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![MySQL 8.0](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)

---

## 1. Executive Project Overview

**InterviewIQ AI** is a production-quality, adaptive interview preparation and domain skill intelligence platform. It simulates real-world corporate, technical, and HR interviews using multimodal speech dynamics, real-time speech-to-text, text-to-speech AI voices with personality-based modulation, and progressive difficulty question generation.

Beyond mock interviews, InterviewIQ AI features an enterprise **Domain & Skill Tracker** that maps career tracks (Full Stack, Java Backend, Cloud, AI/ML, Data Science, etc.), identifies conceptual gaps, and charts actionable roadmaps.

---

## 2. Technology Stack

### Frontend
- **React.js 18** (Modern functional components & custom hooks)
- **Vite** (Next-generation lightning-fast bundler)
- **Tailwind CSS** (Custom high-contrast dark theme)
- **React Router 6** (SPA routing with layouts & nested viewports)
- **Recharts** (Interactive radar charts, area gradients, and bar charts)
- **Lucide React** (Clean, professional SVG iconography)
- **Axios** (JWT-authenticated HTTP client with request interceptors)
- **Web Speech API** (SpeechSynthesis for AI vocal delivery + SpeechRecognition for candidate answers)
- **MediaStream & WebRTC API** (`getUserMedia` with camera & microphone controls)

### Backend
- **Node.js & Express.js** (High-throughput RESTful API architecture)
- **JWT & bcryptjs** (Secure authentication, hashed credential stores, and authorization middleware)
- **MySQL 8.0** (17 normalized relational tables with foreign keys and indexes)
- **Multer & pdf-parse** (Secure resume parsing, entity extraction, and storage)
- **Adaptive AI Engine** (Progressive difficulty engine, heuristic rubrics, and LLM connectors)
- **Speech Dynamics Engine** (Words-per-minute, hesitation pauses, filler words frequency, and delivery scoring)

---

## 3. Design System & Color Tokens

- **Deep Navy Background**: `#0B1020`
- **Dark Blue Surfaces / Cards**: `#111B32`
- **Border & Separator Highlights**: `#1F2E52`
- **Electric Blue (Primary Accent)**: `#3478F6`
- **Cyan (Secondary Accent / Live Indicators)**: `#35D6E8`
- **Ice Silver (Primary Text & Badges)**: `#E6EDF7`
- **Muted Slate Text**: `#94A3B8`
- **Pure White**: `#FFFFFF`

---

## 4. Normalized Database Architecture (`interviewiq_db`)

The database consists of 17 relational tables:

1. `users` — Candidate authentication and credentials.
2. `user_profiles` — Professional bio, target domains, experience levels, and consent flags.
3. `job_roles` — Pre-seeded and custom job specifications.
4. `resumes` — Uploaded documents with parsed skills, experience, and project entities.
5. `interview_sessions` — Active and completed interview configurations.
6. `interview_questions` — Questions generated per session with difficulty levels.
7. `candidate_answers` — Transcripts and audio references per question.
8. `speech_metrics` — Speaking pace (WPM), filler counts, pause durations, and delivery scores.
9. `visual_metrics` — Estimated practice delivery indicators (non-psychological).
10. `ai_evaluations` — Question-level rubric scoring, missing concepts, strengths, and sample answers.
11. `performance_reports` — Consolidated reports with radar scores, common mistakes, and study plans.
12. `domain_tracks` — Career paths (Full Stack, Java, Python, AI/ML, Cloud, etc.).
13. `domain_skills` — Core competencies classified across Frontend, Backend, Database, Tools, and Core Skills.
14. `user_skill_progress` — Candidate checklist with status, personal notes, and GitHub evidence URLs.
15. `learning_roadmaps` — Dynamic roadmaps with percentage completion and AI recommendations.
16. `practice_tasks` — Actionable follow-up exercises derived from interview weaknesses.
17. `interview_history` — Searchable chronological archive for cross-session comparisons.

---

## 5. Setup & Installation Instructions

### Prerequisites
- Node.js v18+ and npm v9+
- MySQL Server 8.0 (optional: in-memory fallback enables instant zero-config testing if MySQL is offline)

### Step 1: Install Dependencies
```bash
# In the project root directory:
npm run install:all
```
*Or manually in each subfolder:*
```bash
cd server && npm install
cd ../client && npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `server/.env`:
```env
PORT=5000
NODE_ENV=development

# MySQL Database Settings
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=interviewiq_db

# Security & JWT
JWT_SECRET=your_secret_key_here

# AI APIs (Optional: Built-in Adaptive Engine active by default)
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### Step 3: Run Database Migrations
If using local MySQL:
```bash
# Execute schema and seed scripts in MySQL:
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```
*(The backend server also automatically verifies and initializes tables on first boot.)*

### Step 4: Launch Development Servers
```bash
# Start backend and frontend simultaneously:
npm run dev

# Or in separate terminal windows:
# Terminal 1 (Backend API):
cd server && npm run dev

# Terminal 2 (Frontend Client):
cd client && npm run dev
```

Visit **http://localhost:5173** in your browser.

---

## 6. End-to-End Workflow

1. **Dashboard**: Live metrics aggregated from database records; performance trends, communication dynamics, radar charts, and onboarding state for new users.
2. **Practice Studio**:
   - **Step 1 (Job Role)**: Choose from 12+ industry roles or define a custom role.
   - **Step 2 (Round Type)**: Technical, HR, Coding, Behavioral, Project-Based, Managerial, Company-Specific, Mixed.
   - **Step 3 (AI Personality)**: Friendly, Professional, Strict, Technical Expert, or HR Interviewer (alters vocal rate, pitch, and conversational style).
   - **Step 4 (Resume Grounding)**: Upload PDF/DOCX to extract projects and generate project defense questions.
   - **Step 5 (Configuration)**: Calibrate baseline difficulty, questions count, and focus topics.
   - **Step 6 (Device Check)**: Test microphone input meter, webcam preview, toggle audio-only mode, and grant explicit consent.
   - **Step 7 (Live Interview Room)**: AI interviewer speaks questions using Text-to-Speech. Candidate speaks their answer with live speech-to-text transcription preview. Adaptive engine automatically calculates the next question difficulty without revealing interim scores.
3. **Comprehensive Report**: Final score out of 100, radar breakdown, speech dynamics, correct vs missing concepts, expert model answer, and one-click PDF printing.
4. **Domain & Skill Tracker**: Interactive skill checklist, GitHub evidence links, AI skill gap detection, and customized study roadmap.
5. **Growth Analytics & History**: Longitudinal multi-session comparisons, consistency streaks, and differential analysis.
