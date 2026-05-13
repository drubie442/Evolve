const express = require("express");
const router = express.Router();
const { requireStaff } = require("../middleware/staff-auth");
const {
  createBooking,
  getPatients,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require("../refer-store");

const VALID_STATUSES = ["pending", "confirmed", "cancelled"];

// GET /api/refer/demo-patients — public: minimal patient info for the demo QR page
router.get("/demo-patients", (req, res) => {
  res.json(
    getPatients().map(({ guid, name, serviceName, serviceCategory }) => ({
      guid,
      name,
      serviceName,
      serviceCategory,
    })),
  );
});

// GET /api/refer/patients — staff only: list all registered patients
router.get("/patients", requireStaff, (req, res) => {
  res.json(getPatients());
});

// GET /api/refer/bookings — staff only: list all auto-bookings
router.get("/bookings", requireStaff, (req, res) => {
  const { status } = req.query;
  let all = getBookings();
  if (status && VALID_STATUSES.includes(status)) {
    all = all.filter((b) => b.status === status);
  }
  res.json(all);
});

// GET /api/refer/bookings/:id — staff only: single booking detail
router.get("/bookings/:id", requireStaff, (req, res) => {
  const booking = getBookingById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found." });
  res.json(booking);
});

// PATCH /api/refer/bookings/:id/status — staff only: update booking status
router.patch("/bookings/:id/status", requireStaff, (req, res) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res
      .status(400)
      .json({ error: `Status must be one of: ${VALID_STATUSES.join(", ")}.` });
  }
  const updated = updateBookingStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: "Booking not found." });
  res.json(updated);
});

// POST or GET /api/refer/:guid
// Public endpoint — invoked by a pre-configured QR code or wearable device.
// GET returns a human-readable HTML confirmation page (for QR code scans).
// POST returns JSON (for programmatic / wearable use).
const guidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function bookingHtml(booking) {
  const bookedAt = new Date(booking.bookedAt);
  const dateStr = bookedAt.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = bookedAt.toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Booking Confirmed – Evolve</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #f7faf9;
      color: #1a2e2b;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.10);
      padding: 2.5rem 2rem;
      max-width: 480px;
      width: 100%;
      text-align: center;
    }
    .icon { font-size: 3.5rem; margin-bottom: 0.75rem; }
    h1 { font-size: 1.6rem; font-weight: 800; color: #1a5c50; margin-bottom: 0.25rem; }
    .subtitle { color: #5c7570; margin-bottom: 2rem; font-size: 0.95rem; }
    .detail-grid {
      text-align: left;
      border-top: 1px solid #d0e4e0;
      border-bottom: 1px solid #d0e4e0;
      padding: 1.25rem 0;
      margin-bottom: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }
    .detail-row { display: flex; flex-direction: column; gap: 0.15rem; }
    .detail-label { font-size: 0.78rem; font-weight: 700; color: #5c7570; text-transform: uppercase; letter-spacing: 0.05em; }
    .detail-value { font-size: 1rem; font-weight: 600; color: #1a2e2b; }
    .footer { font-size: 0.85rem; color: #5c7570; }
    .logo { font-weight: 700; color: #2e7d6e; margin-bottom: 1.5rem; font-size: 1.05rem; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">💚 Evolve Wellbeing</div>
    <div class="icon">✅</div>
    <h1>Booking Confirmed</h1>
    <p class="subtitle">Your referral has been received and is being processed.</p>
    <div class="detail-grid">
      <div class="detail-row">
        <span class="detail-label">Patient</span>
        <span class="detail-value">${booking.patientName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Service</span>
        <span class="detail-value">${booking.serviceName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Category</span>
        <span class="detail-value">${booking.serviceCategory}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Booking date &amp; time</span>
        <span class="detail-value">${dateStr} at ${timeStr}</span>
      </div>
    </div>
    <p class="footer">A staff member will be in touch to confirm your appointment details.</p>
  </div>
</body>
</html>`;
}

router.get("/:guid", (req, res) => {
  const { guid } = req.params;
  if (!guidPattern.test(guid)) {
    return res.status(400).send("<p>Invalid identifier.</p>");
  }
  const result = createBooking(guid);
  if (result.error) {
    return res.status(404).send(`<p>${result.error}</p>`);
  }
  res.setHeader("Content-Type", "text/html");
  return res.status(201).send(bookingHtml(result.booking));
});

router.post("/:guid", (req, res) => {
  const { guid } = req.params;
  if (!guidPattern.test(guid)) {
    return res.status(400).json({ error: "Invalid identifier format." });
  }
  const result = createBooking(guid);
  if (result.error) {
    return res.status(404).json({ error: result.error });
  }
  return res.status(201).json({
    message: "Booking created successfully.",
    booking: result.booking,
  });
});

module.exports = router;
