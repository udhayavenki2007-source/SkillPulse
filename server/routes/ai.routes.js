const express = require('express');
const router = express.Router();
const {
  generateAdaptiveQuestion,
  evaluateAnswer,
  generateConsolidatedReport
} = require('../services/ai.service');
const { analyzeSpeechDynamics } = require('../services/speech.service');

// Generate questions endpoint
router.post('/generate-questions', async (req, res) => {
  try {
    const question = await generateAdaptiveQuestion(req.body);
    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating questions.' });
  }
});

// Evaluate answer endpoint
router.post('/evaluate-answer', async (req, res) => {
  try {
    const evaluation = await evaluateAnswer(req.body);
    res.json({ success: true, evaluation });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error evaluating answer.' });
  }
});

// Transcribe audio endpoint
router.post('/transcribe', (req, res) => {
  // Transcribe endpoint - returns speech-to-text acknowledgement
  res.json({
    success: true,
    transcript: req.body.transcript || 'Transcribed response from candidate microphone.',
    speechDynamics: analyzeSpeechDynamics(req.body.transcript || '', req.body.duration || 20)
  });
});

// Text to speech endpoint metadata
router.post('/text-to-speech', (req, res) => {
  const { text, personality } = req.body;
  res.json({
    success: true,
    message: 'Using client Web Speech Synthesis with personality rate/pitch modulation.',
    text,
    pitch: personality === 'Friendly Interviewer' ? 1.1 : 0.95,
    rate: personality === 'Strict Interviewer' ? 1.05 : 0.98
  });
});

// Generate report endpoint
router.post('/generate-report', async (req, res) => {
  try {
    const report = await generateConsolidatedReport(req.body);
    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating report.' });
  }
});

module.exports = router;
