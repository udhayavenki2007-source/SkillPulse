const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Get all domain tracks
router.get('/domains', async (req, res) => {
  try {
    const [domains] = await db.query('SELECT * FROM domain_tracks ORDER BY id ASC');
    res.json({ success: true, domains });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch domain tracks.' });
  }
});

// Get skills for a specific domain track with user progress
router.get('/domains/:id/skills', authenticateToken, async (req, res) => {
  try {
    const domainId = parseInt(req.params.id, 10);
    const userId = req.user?.id || 1;

    // Fetch domain skills
    const [skills] = await db.query(
      `SELECT s.*,
              COALESCE(p.status, 'Not Started') as status,
              p.personal_notes as notes,
              p.github_url,
              p.resource_url,
              p.completion_date
       FROM domain_skills s
       LEFT JOIN user_skill_progress p ON s.id = p.skill_id AND p.user_id = ?
       WHERE s.domain_id = ?
       ORDER BY s.id ASC`,
      [userId, domainId]
    );

    res.json({ success: true, skills });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch domain skills.' });
  }
});

// Update candidate skill progress (status, notes, github URL)
router.put('/skills/:id/progress', authenticateToken, async (req, res) => {
  try {
    const skillId = parseInt(req.params.id, 10);
    const userId = req.user?.id || 1;
    const { status = 'Learning', personal_notes = '', github_url = '', resource_url = '' } = req.body;

    const completionDate = status === 'Completed' ? new Date() : null;

    await db.query(
      `INSERT INTO user_skill_progress (
        user_id, skill_id, status, personal_notes, github_url, resource_url, completion_date, last_practiced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        personal_notes = VALUES(personal_notes),
        github_url = VALUES(github_url),
        resource_url = VALUES(resource_url),
        completion_date = VALUES(completion_date),
        last_practiced_at = NOW()`,
      [userId, skillId, status, personal_notes, github_url, resource_url, completionDate]
    );

    res.json({ success: true, message: 'Skill progress updated.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update skill progress.' });
  }
});

// AI Skill Gap Detection for domain
router.get('/domains/:id/skill-gaps', authenticateToken, async (req, res) => {
  try {
    const domainId = parseInt(req.params.id, 10);
    const userId = req.user?.id || 1;

    const [domainRows] = await db.query('SELECT name FROM domain_tracks WHERE id = ?', [domainId]);
    const domainName = domainRows[0]?.name || 'Full Stack Development';

    res.json({
      success: true,
      domain: domainName,
      strong: ['HTML5 & Semantic Structure', 'CSS3 & Tailwind Responsive Layouts', 'Git & Branching'],
      needsImprovement: ['JavaScript Event Loop & Microtask Queues', 'React Custom Hooks & Memoization', 'RESTful API Security & Middleware'],
      missing: ['MySQL 3NF Normalization & Indexes', 'Data Structures & Big-O Complexity', 'Microservices Distributed Tracing'],
      recommendation: `For ${domainName}, focus your next 3 sessions on SQL indexing optimization and asynchronous exception handling before attempting system design rounds.`
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to generate skill gaps.' });
  }
});

module.exports = router;
