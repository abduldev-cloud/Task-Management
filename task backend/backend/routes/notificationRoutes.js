const express = require("express");
const router = express.Router();
const db = require("../models/db");
const requireAuth = require("../middleware/authMiddleware");

router.get("/", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

router.post("/mark-read", requireAuth, async (req, res) => {
  await db.query("UPDATE notifications SET is_read = 1 WHERE user_id = ?", [req.user.id]);
  res.json({ message: "Notifications marked as read" });
});

module.exports = router;
