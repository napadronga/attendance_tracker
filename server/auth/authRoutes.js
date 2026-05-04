const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password, and role are required.",
      });
    }

    const [rows] = await db.query(
      `SELECT id, email, password_hash, role, first_name, last_name
       FROM users
       WHERE email = ? AND role = ?`,
      [email, role]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email, password, or role.",
      });
    }

    const user = rows[0];

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email, password, or role.",
      });
    }

    res.json({
      user: {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);

    res.status(500).json({
      message: "Server error during login.",
    });
  }
});

module.exports = router;