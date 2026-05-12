const express = require('express');
const router = express.Router();
const { getOrgs, getLeaderboard } = require('../staff-store');

// GET /api/staff/orgs
router.get('/', (req, res) => {
  res.json(getOrgs());
});

// GET /api/staff/orgs/leaderboard
router.get('/leaderboard', (req, res) => {
  res.json(getLeaderboard());
});

module.exports = router;
