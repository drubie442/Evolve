const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'evolve-staff-portal-2024';
const { findUserByEmail, createCarer, getCarerProfile, getUserById, getOrgs } = require('../staff-store');

function makeToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role, orgName: user.orgName || null },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// POST /api/staff/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  const user = findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
  const token = makeToken(user);
  const profile = user.role === 'carer' ? getCarerProfile(user) : { id: user.id, name: user.name, role: user.role };
  res.json({ token, user: profile });
});

// POST /api/staff/auth/register (carers only)
router.post('/register', async (req, res) => {
  const { name, email, password, orgId, specialty } = req.body;
  if (!name || !email || !password || !orgId) {
    return res.status(400).json({ error: 'Name, email, password and organisation are required.' });
  }
  if (findUserByEmail(email)) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }
  const org = getOrgs().find(o => o.id === orgId);
  if (!org) return res.status(400).json({ error: 'Invalid organisation.' });

  const passwordHash = await bcrypt.hash(password, 10);
  const carer = createCarer({ name, email, passwordHash, orgId, orgName: org.name, specialty });
  const token = makeToken(carer);
  res.status(201).json({ token, user: getCarerProfile(carer) });
});

// GET /api/staff/auth/me
router.get('/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Not authenticated.' });
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET);
    const user = getUserById(payload.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });
    const profile = user.role === 'carer' ? getCarerProfile(user) : { id: user.id, name: user.name, role: user.role };
    res.json(profile);
  } catch {
    res.status(401).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
