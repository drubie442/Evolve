const express = require('express');
const router = express.Router();
const { partners, recordScan, recordTriagePath, getAnalytics } = require('../data/partners');

// GET /api/partner/:code — return partner info and record scan
router.get('/:code', (req, res) => {
  const { code } = req.params;
  const partner = partners[code];
  if (!partner) {
    return res.status(404).json({ error: 'Partner not found.' });
  }
  recordScan(code);
  res.json({ code, ...partner });
});

// POST /api/partner/event — record triage path taken from a partner scan
router.post('/event', (req, res) => {
  const { partnerCode, path } = req.body;
  if (!path) return res.status(400).json({ error: 'path is required.' });
  recordTriagePath(partnerCode || 'direct', path);
  res.json({ ok: true });
});

// GET /api/partner/admin/analytics — aggregate scan data
router.get('/admin/analytics', (req, res) => {
  const data = getAnalytics();
  const partnerNames = Object.fromEntries(
    Object.entries(partners).map(([code, p]) => [code, p.name])
  );
  res.json({ analytics: data, partnerNames });
});

module.exports = router;
