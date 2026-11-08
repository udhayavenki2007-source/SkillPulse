const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'interviewiq_super_secret_jwt_key_2026_change_in_production';

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // Default to user id 1 for quick testing if requested
    req.user = { id: 1, name: 'Alex Mercer', email: 'alex.mercer@example.com', role: 'candidate' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const [rows] = await db.query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [decoded.id]);
    if (rows && rows.length > 0) {
      req.user = rows[0];
    } else {
      req.user = { id: decoded.id, name: decoded.name || 'Candidate', email: decoded.email, role: 'candidate' };
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }
}

module.exports = {
  authenticateToken,
  JWT_SECRET,
};
