const crypto = require("crypto");
const supportServices = require("./data/support-services.json");

// ── helpers ──────────────────────────────────────────────────────────────────

function makeId() {
  return crypto.randomUUID();
}

function findService(id) {
  return supportServices.find((s) => s.id === id) || null;
}

// ── in-memory stores ─────────────────────────────────────────────────────────

// patients: guid (the value embedded in a QR code / wearable) → patient record
const patients = new Map();

// bookings: bookingId → booking record
const bookings = new Map();

// ── seed: patients pre-configured with target service IDs ────────────────────

const seedPatients = [
  {
    guid: "a1b2c3d4-0001-4000-8000-aabbccddeeff",
    name: "Margaret Thompson",
    dob: "1958-03-14",
    phone: "0411 222 333",
    email: "margaret.thompson@example.com",
    serviceId: "69fbfdc113c15e7b813ce66c", // Phoenix Assist – Disability Services
    notes: "NDIS participant requiring support worker coordination.",
  },
  {
    guid: "a1b2c3d4-0002-4000-8000-aabbccddeeff",
    name: "James Nguyen",
    dob: "1990-07-22",
    phone: "0422 333 444",
    email: "james.nguyen@example.com",
    serviceId: "69fbf85ee02b152d7dae5979", // Constructive Thinking Counselling
    notes: "Referred by GP for anxiety and relationship stress.",
  },
  {
    guid: "a1b2c3d4-0003-4000-8000-aabbccddeeff",
    name: "Sarah O'Brien",
    dob: "1985-11-05",
    phone: "0433 444 555",
    email: "sarah.obrien@example.com",
    serviceId: "69fbf3d21cc543b67427b657", // Kara Thomson Psychology
    notes:
      "Medicare Mental Health Treatment Plan in place. Requires psychologist.",
  },
  {
    guid: "a1b2c3d4-0004-4000-8000-aabbccddeeff",
    name: "Daniel Kowalski",
    dob: "1979-01-30",
    phone: "0444 555 666",
    email: "daniel.kowalski@example.com",
    serviceId: "69e57107c1a8bcb57d0a2d5a", // Samaritans – Social-Emotional
    notes: "Isolated male, social engagement program recommended.",
  },
  {
    guid: "a1b2c3d4-0005-4000-8000-aabbccddeeff",
    name: "Aisha Patel",
    dob: "2005-06-18",
    phone: "0455 666 777",
    email: "aisha.patel@example.com",
    serviceId: "69e57107c1a8bcb57d0a2d42", // Black Dog Institute
    notes: "Young adult, mental health monitoring program.",
  },
  {
    guid: "a1b2c3d4-0006-4000-8000-aabbccddeeff",
    name: "Robert Fairweather",
    dob: "1965-09-12",
    phone: "0466 777 888",
    email: "robert.fairweather@example.com",
    serviceId: "69e57107c1a8bcb57d0a2d3e", // The Benevolent Society
    notes: "Family support referral following child safety assessment.",
  },
];

seedPatients.forEach((p) => {
  const service = findService(p.serviceId);
  patients.set(p.guid, {
    ...p,
    serviceName: service ? service.name : p.serviceId,
    serviceCategory: service ? service.category : "",
  });
});

// ── seed: a handful of prior bookings so the UI has data to show ─────────────

const seedBookings = [
  {
    guid: "a1b2c3d4-0001-4000-8000-aabbccddeeff",
    bookedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    guid: "a1b2c3d4-0003-4000-8000-aabbccddeeff",
    bookedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    guid: "a1b2c3d4-0005-4000-8000-aabbccddeeff",
    bookedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
];

seedBookings.forEach(({ guid, bookedAt }) => {
  const patient = patients.get(guid);
  if (!patient) return;
  const service = findService(patient.serviceId);
  const id = makeId();
  bookings.set(id, {
    id,
    guid,
    patientName: patient.name,
    patientDob: patient.dob,
    patientPhone: patient.phone,
    patientEmail: patient.email,
    patientNotes: patient.notes,
    serviceId: patient.serviceId,
    serviceName: service ? service.name : "Unknown Service",
    serviceCategory: service ? service.category : "",
    servicePhone: service ? service.phone : "",
    serviceEmail: service ? service.email : "",
    status: "pending",
    bookedAt,
  });
});

// ── public API ────────────────────────────────────────────────────────────────

function getPatientByGuid(guid) {
  return patients.get(guid) || null;
}

function createBooking(guid) {
  const patient = getPatientByGuid(guid);
  if (!patient) return { error: "Patient not found for this identifier." };

  const service = findService(patient.serviceId);
  if (!service) return { error: "Configured service not found." };

  const id = makeId();
  const booking = {
    id,
    guid,
    patientName: patient.name,
    patientDob: patient.dob,
    patientPhone: patient.phone,
    patientEmail: patient.email,
    patientNotes: patient.notes,
    serviceId: patient.serviceId,
    serviceName: service.name,
    serviceCategory: service.category,
    servicePhone: service.phone,
    serviceEmail: service.email,
    status: "pending",
    bookedAt: new Date().toISOString(),
  };

  bookings.set(id, booking);
  return { booking };
}

function getBookings() {
  return Array.from(bookings.values()).sort(
    (a, b) => new Date(b.bookedAt) - new Date(a.bookedAt),
  );
}

function getBookingById(id) {
  return bookings.get(id) || null;
}

function updateBookingStatus(id, status) {
  const booking = bookings.get(id);
  if (!booking) return null;
  booking.status = status;
  bookings.set(id, booking);
  return booking;
}

function getPatients() {
  return Array.from(patients.values());
}

module.exports = {
  getPatientByGuid,
  getPatients,
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
};
