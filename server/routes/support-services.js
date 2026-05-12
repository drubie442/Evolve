const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

// GET /api/support-services
router.get("/", (req, res) => {
  const filePath = path.join(__dirname, "../data/support-services.json");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load support services" });
    }
    res.json(JSON.parse(data));
  });
});

module.exports = router;
