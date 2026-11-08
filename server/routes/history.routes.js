const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Get all interview history for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id || 1;
    const [history] = await db.query(
      `SELECT h.*, s.job_role_name, s.interview_type, s.personality, s.difficulty
       FROM interview_history h
       JOIN interview_sessions s ON h.session_id = s.id
       WHERE h.user_id = ? AND h.archived = FALSE
       ORDER BY h.completed_at DESC`,
      [userId]
    );

    res.json({ success: true, history: history || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve interview history.' });
  }
});

// Delete / Archive history entry
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const historyId = parseInt(req.params.id, 10);
    const userId = req.user?.id || 1;

    await db.query(
      `UPDATE interview_history SET archived = TRUE WHERE id = ? AND user_id = ?`,
      [historyId, userId]
    );

    res.json({ success: true, message: 'Session history removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete history record.' });
  }
});

module.exports = router;
