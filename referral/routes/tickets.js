const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  getWorker,
  getWorkerList,
} = require('../store');

const VALID_STATUSES = ['open', 'in-progress', 'awaiting', 'closed'];

function tryGetWorker(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(auth.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

// GET /api/referral/tickets/workers — list workers (must come before /:id)
router.get('/workers', requireAuth, (req, res) => {
  res.json(getWorkerList());
});

// GET /api/referral/tickets
router.get('/', requireAuth, (req, res) => {
  const { status } = req.query;
  let all = getTickets();
  if (status && VALID_STATUSES.includes(status)) {
    all = all.filter(t => t.status === status);
  }
  res.json(all);
});

// GET /api/referral/tickets/:id
router.get('/:id', requireAuth, (req, res) => {
  const ticket = getTicket(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
  res.json(ticket);
});

// POST /api/referral/tickets — public (client) or authenticated (staff)
router.post('/', (req, res) => {
  const { clientName, clientPhone, clientEmail, serviceType, urgency, concern, notes, type, assignedTo } = req.body;
  if (!clientName || !serviceType) {
    return res.status(400).json({ error: 'Client name and service type are required.' });
  }

  const authWorker = tryGetWorker(req);
  let assignedWorkerName = null;

  if (assignedTo) {
    const w = getWorker(assignedTo);
    if (w) assignedWorkerName = w.name;
  }

  const ticket = createTicket({
    type: type || (authWorker ? 'staff' : 'client'),
    clientName,
    clientPhone,
    clientEmail,
    serviceType,
    urgency: urgency || 'medium',
    concern,
    notes,
    assignedTo: assignedTo || null,
    assignedWorkerName,
    createdBy: authWorker ? authWorker.id : null,
  });

  res.status(201).json({ success: true, ticket });
});

// PATCH /api/referral/tickets/:id/status
router.patch('/:id/status', requireAuth, (req, res) => {
  const { status } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  const ticket = getTicket(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  const updates = { status };
  if (status === 'closed') updates.closedAt = new Date().toISOString();
  res.json(updateTicket(req.params.id, updates));
});

// PATCH /api/referral/tickets/:id/claim — assign to current worker, move to in-progress
router.patch('/:id/claim', requireAuth, (req, res) => {
  const ticket = getTicket(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
  if (ticket.assignedTo) {
    return res.status(409).json({ error: 'Ticket is already claimed.' });
  }
  res.json(updateTicket(req.params.id, {
    assignedTo: req.worker.id,
    assignedWorkerName: req.worker.name,
    claimedAt: new Date().toISOString(),
    status: 'in-progress',
  }));
});

// PATCH /api/referral/tickets/:id/unclaim — release back to open
router.patch('/:id/unclaim', requireAuth, (req, res) => {
  const ticket = getTicket(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
  if (ticket.assignedTo !== req.worker.id) {
    return res.status(403).json({ error: 'You can only release tickets assigned to you.' });
  }
  res.json(updateTicket(req.params.id, {
    assignedTo: null,
    assignedWorkerName: null,
    claimedAt: null,
    status: 'open',
  }));
});

// PATCH /api/referral/tickets/:id/notes
router.patch('/:id/notes', requireAuth, (req, res) => {
  const { workerNotes } = req.body;
  const ticket = getTicket(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });
  res.json(updateTicket(req.params.id, { workerNotes }));
});

module.exports = router;
