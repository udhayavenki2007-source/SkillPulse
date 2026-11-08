-- ===================================================
-- INTERVIEWIQ AI - DATABASE SCHEMA
-- Normalized MySQL 8.0 Schema (17 Tables)
-- ===================================================

CREATE DATABASE IF NOT EXISTS interviewiq_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE interviewiq_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('candidate', 'admin') DEFAULT 'candidate',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  headline VARCHAR(255),
  target_domain VARCHAR(100),
  experience_level ENUM('Entry', 'Mid-Level', 'Senior', 'Lead') DEFAULT 'Mid-Level',
  bio TEXT,
  phone VARCHAR(30),
  location VARCHAR(120),
  avatar_url VARCHAR(255),
  github_url VARCHAR(255),
  linkedin_url VARCHAR(255),
  webcam_consent BOOLEAN DEFAULT FALSE,
  mic_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Job Roles Table
CREATE TABLE IF NOT EXISTS job_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL UNIQUE,
  category VARCHAR(80) NOT NULL,
  description TEXT,
  required_skills JSON,
  is_custom BOOLEAN DEFAULT FALSE,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_role_category (category)
) ENGINE=InnoDB;

-- 4. Resumes Table
CREATE TABLE IF NOT EXISTS resumes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  raw_text MEDIUMTEXT,
  parsed_skills JSON,
  parsed_education JSON,
  parsed_experience JSON,
  parsed_projects JSON,
  parsed_certifications JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_resumes (user_id)
) ENGINE=InnoDB;

-- 5. Interview Sessions Table
CREATE TABLE IF NOT EXISTS interview_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  job_role_id INT NULL,
  job_role_name VARCHAR(120) NOT NULL,
  interview_type ENUM(
    'Technical Interview',
    'HR Interview',
    'Coding Interview',
    'Behavioral Interview',
    'Project-Based Interview',
    'Managerial Interview',
    'Company-Specific Interview',
    'Mixed Interview'
  ) NOT NULL DEFAULT 'Technical Interview',
  personality ENUM(
    'Friendly Interviewer',
    'Professional Interviewer',
    'Strict Interviewer',
    'Technical Expert',
    'HR Interviewer'
  ) NOT NULL DEFAULT 'Professional Interviewer',
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Intermediate',
  total_questions INT NOT NULL DEFAULT 5,
  current_question_index INT NOT NULL DEFAULT 0,
  duration_minutes INT NOT NULL DEFAULT 15,
  resume_id INT NULL,
  preparation_topic VARCHAR(255),
  status ENUM('pending', 'in_progress', 'completed', 'abandoned') DEFAULT 'pending',
  allow_video BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_role_id) REFERENCES job_roles(id) ON DELETE SET NULL,
  FOREIGN KEY (resume_id) REFERENCES resumes(id) ON DELETE SET NULL,
  INDEX idx_session_user (user_id, status)
) ENGINE=InnoDB;

-- 6. Interview Questions Table
CREATE TABLE IF NOT EXISTS interview_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  question_number INT NOT NULL,
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL DEFAULT 'Beginner',
  question_text TEXT NOT NULL,
  expected_concepts JSON,
  context_topic VARCHAR(150),
  is_resume_derived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
  INDEX idx_session_qnum (session_id, question_number)
) ENGINE=InnoDB;

-- 7. Candidate Answers Table
CREATE TABLE IF NOT EXISTS candidate_answers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL,
  question_id INT NOT NULL,
  user_id INT NOT NULL,
  transcribed_text MEDIUMTEXT,
  audio_url VARCHAR(500),
  duration_seconds INT DEFAULT 0,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES interview_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Speech Metrics Table
CREATE TABLE IF NOT EXISTS speech_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT NOT NULL UNIQUE,
  session_id INT NOT NULL,
  speaking_speed_wpm INT DEFAULT 0,
  filler_words_count INT DEFAULT 0,
  filler_words_list JSON,
  pause_duration_seconds DECIMAL(5,2) DEFAULT 0.0,
  long_pauses_count INT DEFAULT 0,
  response_duration_seconds INT DEFAULT 0,
  answer_completion_score DECIMAL(5,2) DEFAULT 0.0,
  estimated_delivery_score DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (answer_id) REFERENCES candidate_answers(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. Visual Metrics Table
CREATE TABLE IF NOT EXISTS visual_metrics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT NOT NULL UNIQUE,
  session_id INT NOT NULL,
  eye_contact_percentage DECIMAL(5,2) DEFAULT 0.0,
  head_stability_score DECIMAL(5,2) DEFAULT 0.0,
  face_detection_ratio DECIMAL(5,2) DEFAULT 0.0,
  notes VARCHAR(255) DEFAULT 'Estimated delivery indicator, non-psychological',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (answer_id) REFERENCES candidate_answers(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 10. AI Evaluations Table
CREATE TABLE IF NOT EXISTS ai_evaluations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  answer_id INT NOT NULL UNIQUE,
  session_id INT NOT NULL,
  technical_correctness DECIMAL(5,2) DEFAULT 0.0,
  conceptual_understanding DECIMAL(5,2) DEFAULT 0.0,
  answer_relevance DECIMAL(5,2) DEFAULT 0.0,
  explanation_clarity DECIMAL(5,2) DEFAULT 0.0,
  examples_quality DECIMAL(5,2) DEFAULT 0.0,
  problem_solving_approach DECIMAL(5,2) DEFAULT 0.0,
  overall_question_score DECIMAL(5,2) DEFAULT 0.0,
  correct_concepts JSON,
  missing_concepts JSON,
  incorrect_statements JSON,
  strengths TEXT,
  improvement_suggestions TEXT,
  sample_improved_answer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (answer_id) REFERENCES candidate_answers(id) ON DELETE CASCADE,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Performance Reports Table
CREATE TABLE IF NOT EXISTS performance_reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL UNIQUE,
  user_id INT NOT NULL,
  overall_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  technical_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  communication_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  relevance_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  problem_solving_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  structure_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  delivery_score DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  strongest_answers JSON,
  weakest_answers JSON,
  common_mistakes JSON,
  growth_areas JSON,
  strengths JSON,
  recommended_improvements TEXT,
  personalized_study_plan JSON,
  report_pdf_url VARCHAR(500),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_reports (user_id, generated_at)
) ENGINE=InnoDB;

-- 12. Domain Tracks Table
CREATE TABLE IF NOT EXISTS domain_tracks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT 'Code',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 13. Domain Skills Table
CREATE TABLE IF NOT EXISTS domain_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  domain_id INT NOT NULL,
  skill_name VARCHAR(120) NOT NULL,
  category ENUM('Frontend', 'Backend', 'Database', 'Tools', 'Core Skills', 'Projects') NOT NULL,
  importance ENUM('Essential', 'Recommended', 'Advanced') DEFAULT 'Essential',
  description TEXT,
  estimated_hours INT DEFAULT 10,
  learning_resources JSON,
  practice_questions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES domain_tracks(id) ON DELETE CASCADE,
  INDEX idx_domain_cat (domain_id, category)
) ENGINE=InnoDB;

-- 14. User Skill Progress Table
CREATE TABLE IF NOT EXISTS user_skill_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_id INT NOT NULL,
  status ENUM('Not Started', 'Learning', 'Practicing', 'Completed') DEFAULT 'Not Started',
  completion_date DATE NULL,
  personal_notes TEXT,
  github_url VARCHAR(255),
  resource_url VARCHAR(255),
  verified_by_interview BOOLEAN DEFAULT FALSE,
  last_practiced_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_skill (user_id, skill_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES domain_skills(id) ON DELETE CASCADE,
  INDEX idx_user_progress (user_id, status)
) ENGINE=InnoDB;

-- 15. Learning Roadmaps Table
CREATE TABLE IF NOT EXISTS learning_roadmaps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  domain_id INT NOT NULL,
  target_role VARCHAR(120),
  completion_percentage DECIMAL(5,2) DEFAULT 0.0,
  roadmap_stages JSON,
  ai_recommendations JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (domain_id) REFERENCES domain_tracks(id) ON DELETE CASCADE,
  INDEX idx_user_active_roadmap (user_id, is_active)
) ENGINE=InnoDB;

-- 16. Practice Tasks Table
CREATE TABLE IF NOT EXISTS practice_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(80),
  difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
  is_completed BOOLEAN DEFAULT FALSE,
  due_date DATE NULL,
  related_session_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_session_id) REFERENCES interview_sessions(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 17. Interview History Table
CREATE TABLE IF NOT EXISTS interview_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT NOT NULL UNIQUE,
  user_id INT NOT NULL,
  job_role VARCHAR(120) NOT NULL,
  interview_type VARCHAR(80) NOT NULL,
  personality VARCHAR(80) NOT NULL,
  difficulty VARCHAR(50) NOT NULL,
  questions_completed INT NOT NULL DEFAULT 0,
  final_score DECIMAL(5,2) DEFAULT 0.0,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  archived BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_history_user (user_id, completed_at)
) ENGINE=InnoDB;
