const express = require('express');
const router = express.Router();
const resources = require('../data/resources');

// Triage logic: given answers, return a single best-match action card
// Body: { forSelf: bool, concern: string, urgency: string, ageGroup: string }
router.post('/', (req, res) => {
  const { forSelf = true, concern = 'general', urgency = 'days', ageGroup = 'adult' } = req.body;

  // Crisis path — always surface emergency contacts first
  if (urgency === 'today' || concern === 'crisis') {
    const crisisResource = resources.find(r => r.id === 9); // 000
    const lifeline = resources.find(r => r.id === 2);
    return res.json({
      crisis: true,
      primary: crisisResource,
      secondary: lifeline,
      message: forSelf
        ? 'Please reach out right now — help is available 24/7.'
        : 'Please help them reach out right now — support is available 24/7.',
    });
  }

  // Score resources by match
  const scored = resources
    .filter(r => !r.crisis)
    .filter(r => ageGroup === 'any' || r.ageGroups.includes(ageGroup))
    .map(r => {
      let score = 0;
      if (r.concerns.includes(concern)) score += 3;
      if (r.concerns.includes('general')) score += 1;
      if (r.type === 'In-person') score += 1; // prefer in-person for human connection
      return { ...r, score };
    })
    .sort((a, b) => b.score - a.score);

  const primary = scored[0] || resources[0];
  const secondary = scored[1] || null;

  return res.json({
    crisis: false,
    primary,
    secondary,
    message: forSelf
      ? 'Here\'s the best next step for you.'
      : 'Here\'s a resource you can share with them.',
  });
});

module.exports = router;
