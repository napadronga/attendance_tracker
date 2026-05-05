const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT id, first_name AS firstName, last_name AS lastName, email, role, created_at AS createdAt
      FROM users
      ORDER BY role, last_name, first_name
      `
    );

    res.json(rows);
  } catch (err) {
    console.error("Admin users error:", err);
    res.status(500).json({ message: "Could not load users." });
  }
});

// Create user
router.post("/users", async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!["student", "teacher", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?)
      `,
      [email, passwordHash, firstName, lastName, role]
    );

    res.status(201).json({
      id: result.insertId,
      firstName,
      lastName,
      email,
      role,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email already exists." });
    }

    console.error("Admin create user error:", err);
    res.status(500).json({ message: "Could not create user." });
  }
});

// Get classes
router.get("/classes", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.name,
        c.min_attendance_pct AS minAttendance,
        c.teacher_id AS teacherId,
        CONCAT(u.first_name, ' ', u.last_name) AS teacherName
      FROM classes c
      JOIN users u ON c.teacher_id = u.id
      ORDER BY c.name
      `
    );

    res.json(rows);
  } catch (err) {
    console.error("Admin classes error:", err);
    res.status(500).json({ message: "Could not load classes." });
  }
});

// Create class
router.post("/classes", async (req, res) => {
  try {
    const { name, teacherId, minAttendance } = req.body;

    if (!name || !teacherId || !minAttendance) {
      return res.status(400).json({
        message: "Class name, teacherId, and minAttendance are required.",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO classes (name, teacher_id, min_attendance_pct)
      VALUES (?, ?, ?)
      `,
      [name, teacherId, minAttendance]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      teacherId,
      minAttendance,
    });
  } catch (err) {
    console.error("Admin create class error:", err);
    res.status(500).json({ message: "Could not create class." });
  }
});

// Enroll student into class
router.post("/enrollments", async (req, res) => {
  try {
    const { studentId, classId } = req.body;

    if (!studentId || !classId) {
      return res.status(400).json({
        message: "studentId and classId are required.",
      });
    }

    await db.query(
      `
      INSERT IGNORE INTO enrollments (student_id, class_id)
      VALUES (?, ?)
      `,
      [studentId, classId]
    );

    await db.query(
      `
      INSERT INTO attendance_summary
        (student_id, class_id, total_classes, attended_classes, attendance_pct)
      VALUES (?, ?, 0, 0, 0.00)
      ON DUPLICATE KEY UPDATE
        student_id = VALUES(student_id),
        class_id = VALUES(class_id)
      `,
      [studentId, classId]
    );

    res.json({ message: "Student enrolled successfully." });
  } catch (err) {
    console.error("Admin enrollment error:", err);
    res.status(500).json({ message: "Could not enroll student." });
  }
});

module.exports = router;