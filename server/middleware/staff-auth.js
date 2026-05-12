const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'evolve-staff-portal-2024';

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
}

function requireStaff(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ error: 'Evolve staff access only.' });
    }
    next();
  });
}

module.exports = { requireAuth, requireStaff };
