const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/triage", require("./routes/triage"));
app.use("/api/resources", require("./routes/resources"));
app.use("/api/handoff", require("./routes/handoff"));
app.use("/api/partner", require("./routes/partner"));
app.use("/api/support-services", require("./routes/support-services"));

// Staff portal API routes
app.use("/api/staff/auth", require("./routes/staff-auth"));
app.use("/api/staff/tickets", require("./routes/staff-tickets"));
app.use("/api/staff/orgs", require("./routes/staff-orgs"));

// Wearable / QR-code auto-referral API
app.use("/api/refer", require("./routes/refer"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

// Serve React frontend in production (built files copied to server/public)
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Serve staff portal SPA under /staff/
const staffDir =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "staff-portal")
    : path.join(__dirname, "../staff-portal/client/dist");
app.use("/staff", express.static(staffDir));
app.use("/staff", (req, res) => {
  res.sendFile(path.join(staffDir, "index.html"));
});

// React Router fallback — serve index.html for any unmatched route
app.use((req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Evolve server listening on http://localhost:${PORT}`);
});
