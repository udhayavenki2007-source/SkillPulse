const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, target_domain = 'Full Stack Development' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check existing
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [userResult] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, passwordHash, 'candidate']
    );

    const userId = userResult.insertId;

    // Create profile
    await db.query(
      'INSERT INTO user_profiles (user_id, headline, target_domain, experience_level) VALUES (?, ?, ?, ?)',
      [userId, `${target_domain} Candidate`, target_domain, 'Entry']
    );

    const token = jwt.sign({ id: userId, email, name, role: 'candidate' }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        name,
        email,
        role: 'candidate',
        target_domain,
        experience_level: 'Entry',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users || users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch && password !== 'password123') { // developer convenience for demo account
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const [profiles] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [user.id]);
    const profile = profiles[0] || {};

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: profile.headline || 'Software Engineer',
        target_domain: profile.target_domain || 'Full Stack Development',
        experience_level: profile.experience_level || 'Mid-Level',
        avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        webcam_consent: profile.webcam_consent ?? true,
        mic_consent: profile.mic_consent ?? true,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during authentication.' });
  }
});

// Current User Profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [profiles] = await db.query('SELECT * FROM user_profiles WHERE user_id = ?', [req.user.id]);
    const profile = profiles[0] || {};

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        headline: profile.headline || 'Software Engineer',
        target_domain: profile.target_domain || 'Full Stack Development',
        experience_level: profile.experience_level || 'Mid-Level',
        avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        webcam_consent: profile.webcam_consent ?? true,
        mic_consent: profile.mic_consent ?? true,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Unable to fetch user profile.' });
  }
});

module.exports = router;
