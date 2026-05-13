const express = require('express');
const router = express.Router();
const { requireAuth, requireStaff } = require('../middleware/staff-auth');
const { registerPatient } = require('../refer-store');
const {
  createTicket,
  getTickets,
  getTicketsByCarerId,
  getTicketById,
  updateTicketStatus,
  awardTicketPoints,
  getUserById,
  getCarerProfile,
} = require('../staff-store');

const VALID_STATUSES = ['open', 'in-progress', 'closed'];

// POST /api/staff/tickets — carer submits a ticket
router.post('/', requireAuth, (req, res) => {
  if (req.user.role !== 'carer') {
    return res.status(403).json({ error: 'Only carers can submit tickets.' });
  }
  const { patientName, patientPhone, patientEmail, concern, urgency } = req.body;
  if (!patientName || !concern) {
    return res.status(400).json({ error: 'Patient name and concern are required.' });
  }
  if (!patientPhone && !patientEmail) {
    return res.status(400).json({ error: 'At least one patient contact method is required.' });
  }

  const carer = getUserById(req.user.id);
  const ticket = createTicket({
    carerId: req.user.id,
    carerName: carer.name,
    carerOrg: carer.orgName,
    patientName,
    patientPhone,
    patientEmail,
    concern,
    urgency: urgency || 'medium',
  });

  // Add patient to the unified patient registry (deduplicates by email/phone)
  registerPatient({
    name: patientName,
    phone: patientPhone || '',
    email: patientEmail || '',
    notes: concern,
    source: 'carer',
  });

  const gamification = awardTicketPoints(req.user.id, urgency);
  const updatedCarer = getUserById(req.user.id);

  res.status(201).json({
    ticket,
    gamification,
    carerProfile: getCarerProfile(updatedCarer),
  });
});

// GET /api/staff/tickets — staff sees all; carers see their own
router.get('/', requireAuth, (req, res) => {
  if (req.user.role === 'staff') {
    const { status } = req.query;
    let all = getTickets();
    if (status && VALID_STATUSES.includes(status)) {
      all = all.filter(t => t.status === status);
    }
    return res.json(all);
  }
  res.json(getTicketsByCarerId(req.user.id));
});

// PATCH /api/staff/tickets/:id/status — staff only
router.patch('/:id/status', requireStaff, (req, res) => {
  const { status, reason } = req.body;
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}` });
  }
  if (!reason || reason.trim().length < 3) {
    return res.status(400).json({ error: 'A reason for the status change is required.' });
  }
  const ticket = getTicketById(req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket not found.' });

  const updated = updateTicketStatus(req.params.id, status, reason.trim(), req.user.name);
  res.json(updated);
});

module.exports = router;
