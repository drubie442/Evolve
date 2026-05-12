const express = require('express');
const router = express.Router();
const resources = require('../data/resources');

// In-memory log of handoffs (aggregate only, no patient data stored)
const handoffLog = { total: 0, byConcern: {} };

// POST /api/handoff
// Body: { concerns: string[], mobile: string (optional), location: string }
// In a real system this would send an SMS via Twilio etc.
// In this prototype it simulates the send and returns the resource card.
router.post('/', (req, res) => {
  const { concerns = [], mobile, location = 'Unknown' } = req.body;

  if (!Array.isArray(concerns) || concerns.length === 0) {
    return res.status(400).json({ error: 'At least one concern is required.' });
  }

  // Find best matching resources for selected concerns
  const matched = resources
    .filter(r => r.concerns.some(c => concerns.includes(c)))
    .sort((a, b) => (b.crisis ? 1 : 0) - (a.crisis ? 1 : 0))
    .slice(0, 3);

  // Log aggregate data only
  handoffLog.total += 1;
  concerns.forEach(c => {
    handoffLog.byConcern[c] = (handoffLog.byConcern[c] || 0) + 1;
  });

  const smsSent = Boolean(mobile);

  res.json({
    success: true,
    smsSent,
    message: smsSent
      ? `Resource card sent to ${mobile.replace(/\d(?=\d{4})/g, '*')}.`
      : 'Resource card ready to show patient.',
    resources: matched,
    location,
  });
});

router.get('/stats', (req, res) => {
  res.json(handoffLog);
});

module.exports = router;
