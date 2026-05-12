const crypto = require('crypto');

const tickets = new Map();
const workers = new Map();

function makeId() {
  return crypto.randomUUID();
}

function createTicket(data) {
  const id = makeId();
  const now = new Date().toISOString();
  const preAssigned = Boolean(data.assignedTo);
  const ticket = {
    id,
    type: data.type || 'client',
    status: preAssigned ? 'in-progress' : 'open',
    createdAt: now,
    updatedAt: now,
    clientName: data.clientName,
    clientPhone: data.clientPhone || '',
    clientEmail: data.clientEmail || '',
    serviceType: data.serviceType,
    urgency: data.urgency || 'medium',
    concern: data.concern || '',
    notes: data.notes || '',
    assignedTo: data.assignedTo || null,
    assignedWorkerName: data.assignedWorkerName || null,
    claimedAt: preAssigned ? now : null,
    workerNotes: '',
    closedAt: null,
    createdBy: data.createdBy || null,
  };
  tickets.set(id, ticket);
  return ticket;
}

function getTickets() {
  return Array.from(tickets.values()).sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
}

function getTicket(id) {
  return tickets.get(id) || null;
}

function updateTicket(id, updates) {
  const ticket = tickets.get(id);
  if (!ticket) return null;
  const updated = { ...ticket, ...updates, updatedAt: new Date().toISOString() };
  tickets.set(id, updated);
  return updated;
}

function createWorker(data) {
  const id = makeId();
  const worker = {
    id,
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash: data.passwordHash,
    specialty: data.specialty || 'Support Worker',
    createdAt: new Date().toISOString(),
  };
  workers.set(id, worker);
  return worker;
}

function findWorkerByEmail(email) {
  return Array.from(workers.values()).find(w => w.email === email.toLowerCase()) || null;
}

function getWorker(id) {
  return workers.get(id) || null;
}

function getWorkerList() {
  return Array.from(workers.values()).map(w => ({
    id: w.id,
    name: w.name,
    specialty: w.specialty,
  }));
}

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  updateTicket,
  createWorker,
  findWorkerByEmail,
  getWorker,
  getWorkerList,
};
