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
// GET is supported so that scanning a QR code in a browser works directly.
// The GUID identifies the patient in the refer-store; the correct service is
// looked up automatically and a booking is created.
function handleRefer(req, res) {
  const { guid } = req.params;

  // Basic GUID format validation
  const guidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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
}

router.get("/:guid", handleRefer);
router.post("/:guid", handleRefer);

module.exports = router;
