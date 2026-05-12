const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createWorker, findWorkerByEmail } = require('../store');
const { JWT_SECRET } = require('../config');

function makeToken(worker) {
  return jwt.sign(
    { id: worker.id, name: worker.name, specialty: worker.specialty },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// POST /api/referral/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, specialty } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  if (findWorkerByEmail(email)) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const worker = createWorker({ name, email, passwordHash, specialty });
  const token = makeToken(worker);
  res.status(201).json({
    token,
    worker: { id: worker.id, name: worker.name, specialty: worker.specialty },
  });
});

// POST /api/referral/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const worker = findWorkerByEmail(email);
  if (!worker) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const ok = await bcrypt.compare(password, worker.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = makeToken(worker);
  res.json({
    token,
    worker: { id: worker.id, name: worker.name, specialty: worker.specialty },
  });
});

module.exports = router;
