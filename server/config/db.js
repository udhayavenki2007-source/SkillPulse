const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let pool = null;
let isConnectedToMySQL = false;

// In-memory fallback mock storage when MySQL is offline or initializing
const memoryStore = {
  users: [
    {
      id: 1,
      name: 'Alex Mercer',
      email: 'alex.mercer@example.com',
      password_hash: '$2a$10$wN/xQ1K9Rz.N0MkJpT1ccebK2u3.J1uU0jK9e0hE3Q7mJ8m3j6Wae', // password123
      role: 'candidate',
      is_active: 1,
      created_at: new Date(),
    }
  ],
  user_profiles: [
    {
      id: 1,
      user_id: 1,
      headline: 'Full Stack & Cloud Engineer in Training',
      target_domain: 'Full Stack Development',
      experience_level: 'Mid-Level',
      bio: 'Enthusiastic full-stack engineer with hands-on practice in React, Node, and MySQL.',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      webcam_consent: 1,
      mic_consent: 1,
    }
  ],
  job_roles: [
    { id: 1, title: 'Full Stack Developer', category: 'Engineering', description: 'End-to-end web apps' },
    { id: 2, title: 'Java Developer', category: 'Backend', description: 'Java Spring Boot' },
    { id: 3, title: 'Frontend Developer', category: 'Frontend', description: 'React interfaces' },
    { id: 4, title: 'Backend Developer', category: 'Backend', description: 'REST APIs & SQL' }
  ],
  domain_tracks: [
    { id: 1, name: 'Full Stack Development', slug: 'full-stack-dev', icon: 'Layers' },
    { id: 2, name: 'Java Backend Development', slug: 'java-backend-dev', icon: 'Server' },
    { id: 3, name: 'Frontend Development', slug: 'frontend-dev', icon: 'Layout' },
    { id: 4, name: 'Python Development', slug: 'python-dev', icon: 'Code' },
    { id: 5, name: 'Data Analytics', slug: 'data-analytics', icon: 'BarChart3' },
    { id: 6, name: 'Data Science', slug: 'data-science', icon: 'Brain' },
    { id: 7, name: 'AI / ML Engineering', slug: 'aiml-engineering', icon: 'Cpu' },
    { id: 8, name: 'Cloud Computing', slug: 'cloud-computing', icon: 'Cloud' },
    { id: 9, name: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield' }
  ],
  domain_skills: [
    { id: 1, domain_id: 1, skill_name: 'HTML5 & Semantic Markup', category: 'Frontend', importance: 'Essential' },
    { id: 2, domain_id: 1, skill_name: 'CSS3 & Responsive Design', category: 'Frontend', importance: 'Essential' },
    { id: 3, domain_id: 1, skill_name: 'JavaScript ES6+', category: 'Frontend', importance: 'Essential' },
    { id: 4, domain_id: 1, skill_name: 'React.js & Hooks', category: 'Frontend', importance: 'Essential' },
    { id: 5, domain_id: 1, skill_name: 'Node.js & Event Loop', category: 'Backend', importance: 'Essential' },
    { id: 6, domain_id: 1, skill_name: 'Express.js Framework', category: 'Backend', importance: 'Essential' },
    { id: 7, domain_id: 1, skill_name: 'SQL & Relational Modeling', category: 'Database', importance: 'Essential' },
    { id: 8, domain_id: 1, skill_name: 'Git & GitHub Workflows', category: 'Tools', importance: 'Essential' },
    { id: 9, domain_id: 1, skill_name: 'Data Structures & Algorithms', category: 'Core Skills', importance: 'Essential' }
  ],
  user_skill_progress: [
    { id: 1, user_id: 1, skill_id: 1, status: 'Completed', notes: 'Mastered semantic tags' },
    { id: 2, user_id: 1, skill_id: 2, status: 'Completed', notes: 'Tailwind styling' },
    { id: 3, user_id: 1, skill_id: 3, status: 'Practicing', notes: 'Async/Await & Promises' },
    { id: 4, user_id: 1, skill_id: 4, status: 'Practicing', notes: 'Hooks & Context' },
    { id: 5, user_id: 1, skill_id: 5, status: 'Learning', notes: 'Event loop understanding' },
    { id: 6, user_id: 1, skill_id: 6, status: 'Learning', notes: 'Express middleware' },
    { id: 7, user_id: 1, skill_id: 7, status: 'Learning', notes: 'Schema design & queries' },
    { id: 8, user_id: 1, skill_id: 8, status: 'Completed', notes: 'PR workflows' }
  ],
  interview_sessions: [],
  interview_questions: [],
  candidate_answers: [],
  speech_metrics: [],
  ai_evaluations: [],
  performance_reports: [],
  interview_history: [],
  resumes: []
};

async function initializeDatabase() {
  try {
    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'interviewiq_db';

    // First connect without database to create if not exists
    const rootConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      connectTimeout: 3000,
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // Now initialize connection pool
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      connectTimeout: 5000,
    });

    // Test connection
    const testConn = await pool.getConnection();
    console.log(`[Database] Successfully connected to MySQL (${database}) on ${host}:${port}`);
    testConn.release();
    isConnectedToMySQL = true;

    // Run schema scripts
    await runSchemaScripts();
  } catch (err) {
    console.warn(`[Database Warning] MySQL connection unavailable (${err.message}). Activating In-Memory Fallback Adapter.`);
    console.warn(`[Database Guide] To connect to local MySQL Server, ensure MySQL service is running and configure credentials in server/.env.`);
    isConnectedToMySQL = false;
  }
}

async function runSchemaScripts() {
  if (!pool || !isConnectedToMySQL) return;
  try {
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf8');
      const statements = sqlContent.split(';').map(s => s.trim()).filter(s => s.length > 5);
      for (const stmt of statements) {
        try {
          await pool.query(stmt);
        } catch (e) {
          // Ignore individual table already exists errors
        }
      }
      console.log('[Database] MySQL tables verified.');
    }

    // Run seed data if empty
    const [roles] = await pool.query('SELECT COUNT(*) as count FROM job_roles');
    if (roles[0].count === 0) {
      const seedPath = path.join(__dirname, '../../database/seed.sql');
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        const seedStmts = seedSql.split(';').map(s => s.trim()).filter(s => s.length > 5);
        for (const s of seedStmts) {
          try {
            await pool.query(s);
          } catch (e) {}
        }
        console.log('[Database] Seed data populated in MySQL.');
      }
    }
  } catch (err) {
    console.warn('[Database] Schema execution note:', err.message);
  }
}

// Unified query runner with fallback
async function query(sql, params = []) {
  if (isConnectedToMySQL && pool) {
    try {
      const [rows, fields] = await pool.query(sql, params);
      return [rows, fields];
    } catch (err) {
      console.error('[MySQL Error]', err.message);
      throw err;
    }
  }

  // Fallback simulator for essential CRUD queries
  const cleanSql = sql.trim().toLowerCase();

  if (cleanSql.startsWith('select')) {
    if (cleanSql.includes('from users where email =')) {
      const email = params[0];
      const match = memoryStore.users.filter(u => u.email === email);
      return [match, []];
    }
    if (cleanSql.includes('from users where id =')) {
      const id = params[0];
      const match = memoryStore.users.filter(u => u.id === id);
      return [match, []];
    }
    if (cleanSql.includes('from user_profiles where user_id =')) {
      const uid = params[0];
      const match = memoryStore.user_profiles.filter(p => p.user_id === uid);
      return [match, []];
    }
    if (cleanSql.includes('from job_roles')) {
      return [memoryStore.job_roles, []];
    }
    if (cleanSql.includes('from domain_tracks')) {
      return [memoryStore.domain_tracks, []];
    }
    if (cleanSql.includes('from domain_skills where domain_id =')) {
      const did = params[0];
      const match = memoryStore.domain_skills.filter(s => s.domain_id === did);
      return [match, []];
    }
    if (cleanSql.includes('from user_skill_progress where user_id =')) {
      const uid = params[0];
      const match = memoryStore.user_skill_progress.filter(p => p.user_id === uid);
      return [match, []];
    }
    if (cleanSql.includes('from interview_sessions where id =')) {
      const sid = params[0];
      const match = memoryStore.interview_sessions.filter(s => s.id === sid);
      return [match, []];
    }
    if (cleanSql.includes('from performance_reports where session_id =')) {
      const sid = params[0];
      const match = memoryStore.performance_reports.filter(r => r.session_id === sid);
      return [match, []];
    }
    if (cleanSql.includes('from interview_history where user_id =')) {
      const uid = params[0];
      const match = memoryStore.interview_history.filter(h => h.user_id === uid && !h.archived);
      return [match, []];
    }
    return [[], []];
  }

  if (cleanSql.startsWith('insert into users')) {
    const newUser = {
      id: memoryStore.users.length + 1,
      name: params[0],
      email: params[1],
      password_hash: params[2],
      role: 'candidate',
      created_at: new Date(),
    };
    memoryStore.users.push(newUser);
    return [{ insertId: newUser.id }, []];
  }

  if (cleanSql.startsWith('insert into user_profiles')) {
    const profile = {
      id: memoryStore.user_profiles.length + 1,
      user_id: params[0],
      headline: params[1] || 'Candidate',
      target_domain: params[2] || 'Full Stack Development',
      experience_level: 'Entry',
      created_at: new Date()
    };
    memoryStore.user_profiles.push(profile);
    return [{ insertId: profile.id }, []];
  }

  if (cleanSql.startsWith('insert into interview_sessions')) {
    const newSession = {
      id: memoryStore.interview_sessions.length + 1,
      user_id: params[0],
      job_role_name: params[1],
      interview_type: params[2],
      personality: params[3],
      difficulty: params[4],
      total_questions: params[5],
      current_question_index: 0,
      duration_minutes: params[6],
      status: 'in_progress',
      created_at: new Date()
    };
    memoryStore.interview_sessions.push(newSession);
    return [{ insertId: newSession.id }, []];
  }

  if (cleanSql.startsWith('insert into candidate_answers')) {
    const newAnswer = {
      id: memoryStore.candidate_answers.length + 1,
      session_id: params[0],
      question_id: params[1],
      user_id: params[2],
      transcribed_text: params[3],
      duration_seconds: params[4] || 20,
      submitted_at: new Date()
    };
    memoryStore.candidate_answers.push(newAnswer);
    return [{ insertId: newAnswer.id }, []];
  }

  return [{ affectedRows: 1, insertId: Date.now() }, []];
}

// Auto-run connection attempt
initializeDatabase();

module.exports = {
  query,
  isConnected: () => isConnectedToMySQL,
  getMemoryStore: () => memoryStore,
};
