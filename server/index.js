const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/dashboard', require('./routes/dashboard.routes'));
app.use('/api', require('./routes/interview.routes')); // Mounts /jobs and /interviews
app.use('/api/resumes', require('./routes/resume.routes'));
app.use('/api/ai', require('./routes/ai.routes'));
app.use('/api', require('./routes/domain.routes')); // Mounts /domains and /skills
app.use('/api/history', require('./routes/history.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'INTERVIEWIQ AI',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'active',
      adaptiveAI: 'active',
      speechDynamics: 'active',
      database: require('./config/db').isConnected() ? 'MySQL Connected' : 'In-Memory Fallback Active'
    }
  });
});

// Centralized error handling
app.use((err, req, res, next) => {
  console.error('[Server Error Handler]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`  INTERVIEWIQ AI - BACKEND ENGINE RUNNING         `);
  console.log(`  Port: http://localhost:${PORT}                  `);
  console.log(`  API Health: http://localhost:${PORT}/api/health `);
  console.log(`==================================================`);
});
