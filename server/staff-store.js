const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const users = new Map();
const orgs = new Map();
const tickets = new Map();

function makeId() {
  return crypto.randomUUID();
}

// ── Gamification constants ──────────────────────────────────────────────────

const BADGES = [
  { id: 'first-steps',  name: 'First Steps',         icon: '🌱', desc: 'Submit your first ticket',       check: c => c.ticketCount >= 1  },
  { id: 'helping-hand', name: 'Helping Hand',         icon: '🤝', desc: 'Submit 5 tickets',               check: c => c.ticketCount >= 5  },
  { id: 'dedicated',    name: 'Dedicated Advocate',   icon: '⭐', desc: 'Submit 10 tickets',              check: c => c.ticketCount >= 10 },
  { id: 'champion',     name: 'Community Champion',   icon: '🏆', desc: 'Submit 25 tickets',              check: c => c.ticketCount >= 25 },
  { id: 'crisis',       name: 'Crisis Responder',     icon: '🚨', desc: 'Submit an urgent crisis ticket', check: c => c.crisisCount >= 1  },
];

const LEVELS = [
  { name: 'Supporter', minPoints: 0,   icon: '💙', next: 50  },
  { name: 'Advocate',  minPoints: 50,  icon: '💚', next: 150 },
  { name: 'Champion',  minPoints: 150, icon: '💛', next: 300 },
  { name: 'Expert',    minPoints: 300, icon: '🏅', next: null },
];

function getLevel(points) {
  return [...LEVELS].reverse().find(l => points >= l.minPoints) || LEVELS[0];
}

function checkNewBadges(carer) {
  return BADGES
    .filter(b => !carer.badges.includes(b.id) && b.check(carer))
    .map(b => b.id);
}

// ── Seed data ───────────────────────────────────────────────────────────────

const seedOrgs = [
  { id: makeId(), name: 'Hunter Valley Hospital',   type: 'Hospital'            },
  { id: makeId(), name: 'NSW Police',               type: 'Law Enforcement'     },
  { id: makeId(), name: 'Social Services NSW',      type: 'Social Services'     },
  { id: makeId(), name: 'Centrelink',               type: 'Government Services' },
  { id: makeId(), name: 'Hunter Region GP Network', type: 'Primary Care'        },
  { id: makeId(), name: 'Other',                    type: 'Other'               },
];
seedOrgs.forEach(o => orgs.set(o.id, o));

const seedStaff = {
  id: makeId(),
  name: 'Evolve Staff',
  email: 'staff@evolve.org.au',
  passwordHash: bcrypt.hashSync('evolve2024', 10),
  role: 'staff',
  createdAt: new Date().toISOString(),
};
users.set(seedStaff.id, seedStaff);

// ── User helpers ─────────────────────────────────────────────────────────────

function findUserByEmail(email) {
  return Array.from(users.values()).find(u => u.email === email.toLowerCase()) || null;
}

function getUserById(id) {
  return users.get(id) || null;
}

function createCarer(data) {
  const id = makeId();
  const carer = {
    id,
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    role: 'carer',
    orgId: data.orgId,
    orgName: data.orgName,
    specialty: data.specialty || 'Support Worker',
    points: 0,
    ticketCount: 0,
    crisisCount: 0,
    badges: [],
    createdAt: new Date().toISOString(),
  };
  users.set(id, carer);
  return carer;
}

function awardTicketPoints(carerId, urgency) {
  const carer = users.get(carerId);
  if (!carer || carer.role !== 'carer') return null;

  const basePoints = 10;
  const bonus = urgency === 'crisis' ? 5 : 0;
  carer.points += basePoints + bonus;
  carer.ticketCount += 1;
  if (urgency === 'crisis') carer.crisisCount += 1;

  const newBadgeIds = checkNewBadges(carer);
  carer.badges = [...carer.badges, ...newBadgeIds];
  users.set(carerId, carer);

  const newBadges = BADGES.filter(b => newBadgeIds.includes(b.id));
  return { pointsEarned: basePoints + bonus, newBadges, level: getLevel(carer.points) };
}

function getCarerProfile(carer) {
  const level = getLevel(carer.points);
  const earnedBadges = BADGES.filter(b => carer.badges.includes(b.id));
  const nextLevel = LEVELS.find(l => l.minPoints > carer.points) || null;
  return {
    id: carer.id, name: carer.name, email: carer.email,
    role: carer.role,
    orgName: carer.orgName, specialty: carer.specialty,
    points: carer.points, ticketCount: carer.ticketCount,
    level, nextLevel, badges: earnedBadges,
  };
}

function getLeaderboard() {
  return Array.from(users.values())
    .filter(u => u.role === 'carer')
    .sort((a, b) => b.points - a.points)
    .slice(0, 10)
    .map((c, i) => ({
      rank: i + 1,
      name: c.name,
      orgName: c.orgName,
      points: c.points,
      ticketCount: c.ticketCount,
      level: getLevel(c.points),
    }));
}

// ── Organisation helpers ──────────────────────────────────────────────────────

function getOrgs() {
  return Array.from(orgs.values());
}

// ── Ticket helpers ────────────────────────────────────────────────────────────

function createTicket(data) {
  const id = makeId();
  const now = new Date().toISOString();
  const ticket = {
    id,
    carerId: data.carerId,
    carerName: data.carerName,
    carerOrg: data.carerOrg,
    patientName: data.patientName,
    patientPhone: data.patientPhone || '',
    patientEmail: data.patientEmail || '',
    concern: data.concern,
    urgency: data.urgency || 'medium',
    status: 'open',
    statusHistory: [
      { status: 'open', reason: 'Ticket submitted by carer', changedBy: data.carerName, changedAt: now },
    ],
    assignedStaffName: null,
    createdAt: now,
    updatedAt: now,
  };
  tickets.set(id, ticket);
  return ticket;
}

function getTickets() {
  return Array.from(tickets.values()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getTicketsByCarerId(carerId) {
  return Array.from(tickets.values())
    .filter(t => t.carerId === carerId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getTicketById(id) {
  return tickets.get(id) || null;
}

function updateTicketStatus(id, status, reason, staffName) {
  const ticket = tickets.get(id);
  if (!ticket) return null;
  const now = new Date().toISOString();
  const updated = {
    ...ticket,
    status,
    assignedStaffName: staffName,
    updatedAt: now,
    statusHistory: [
      ...ticket.statusHistory,
      { status, reason, changedBy: staffName, changedAt: now },
    ],
  };
  tickets.set(id, updated);
  return updated;
}

module.exports = {
  findUserByEmail,
  getUserById,
  createCarer,
  awardTicketPoints,
  getCarerProfile,
  getLeaderboard,
  getOrgs,
  createTicket,
  getTickets,
  getTicketsByCarerId,
  getTicketById,
  updateTicketStatus,
  BADGES,
  LEVELS,
  getLevel,
};
