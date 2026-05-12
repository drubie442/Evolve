const express = require('express');
const router = express.Router();
const resources = require('../data/resources');

// GET /api/resources?concern=anxiety&ageGroup=adult
router.get('/', (req, res) => {
  const { concern, ageGroup } = req.query;
  let filtered = [...resources];

  if (concern && concern !== 'all') {
    filtered = filtered.filter(r => r.concerns.includes(concern));
  }
  if (ageGroup && ageGroup !== 'any') {
    filtered = filtered.filter(r => r.ageGroups.includes(ageGroup));
  }

  // Crisis resources first
  filtered.sort((a, b) => (b.crisis ? 1 : 0) - (a.crisis ? 1 : 0));

  res.json(filtered);
});

module.exports = router;
