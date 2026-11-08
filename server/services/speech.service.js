/**
 * Speech Dynamics & Objective Delivery Analyzer
 * Analyzes audio transcripts and timing for objective communication indicators.
 */

const COMMON_FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'basically', 'actually', 'sort of', 'kind of', 'i mean'
];

function analyzeSpeechDynamics(transcript = '', durationSeconds = 25) {
  const safeDuration = Math.max(5, durationSeconds);
  const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Words per minute calculation
  const minutes = safeDuration / 60;
  const wpm = Math.round(wordCount / minutes);

  // Filler words detection
  const lowerText = transcript.toLowerCase();
  const detectedFillers = [];
  let fillerCount = 0;

  for (const filler of COMMON_FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      fillerCount += matches.length;
      detectedFillers.push(filler);
    }
  }

  // Pause duration estimation (based on duration relative to word density)
  const expectedSecs = (wordCount / 140) * 60;
  const pauseDurationSecs = Math.max(0, parseFloat((safeDuration - expectedSecs).toFixed(1)));
  const longPausesCount = pauseDurationSecs > 3 ? Math.floor(pauseDurationSecs / 3) : 0;

  // Completion score based on sentence completeness and punctuation or keywords
  const hasSubstance = wordCount >= 15;
  const completionScore = hasSubstance ? Math.min(100, 70 + Math.min(30, wordCount)) : 40;

  // Delivery Score: Ideal pace is 120-150 WPM; low fillers; minimal awkward silences
  let deliveryScore = 85;
  if (wpm < 100 || wpm > 170) deliveryScore -= 12;
  deliveryScore -= Math.min(25, fillerCount * 4);
  deliveryScore += hasSubstance ? 10 : -20;
  deliveryScore = Math.max(40, Math.min(98, deliveryScore));

  return {
    wordCount,
    durationSeconds: safeDuration,
    wpm,
    fillerWordsCount: fillerCount,
    fillerWordsList: detectedFillers,
    pauseDurationSeconds: pauseDurationSecs,
    longPausesCount,
    completionScore,
    estimatedDeliveryScore: deliveryScore,
    label: deliveryScore >= 80 ? 'Steady & Articulate' : deliveryScore >= 65 ? 'Moderate Delivery' : 'Needs Practice'
  };
}

module.exports = {
  analyzeSpeechDynamics,
};
