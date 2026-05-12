const express = require('express');
const router = express.Router();
const { getOrgs, getLeaderboard } = require('../store');

// GET /api/orgs
router.get('/', (req, res) => {
  res.json(getOrgs());
});

// GET /api/orgs/leaderboard
router.get('/leaderboard', (req, res) => {
  res.json(getLeaderboard());
});

module.exports = router;
