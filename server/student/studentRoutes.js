const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/classes", async (req, res) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "studentId is required." });
    }

    const [rows] = await db.query(
      `
      SELECT 
        c.id,
        c.name,
        c.min_attendance_pct AS minAtt,
        COALESCE(s.attended_classes, 0) AS attended,
        COALESCE(s.total_classes, 0) AS total
      FROM enrollments e
      JOIN classes c ON e.class_id = c.id
      LEFT JOIN attendance_summary s 
        ON s.class_id = c.id AND s.student_id = e.student_id
      WHERE e.student_id = ?
      `,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Student classes error:", err);
    res.status(500).json({ message: "Could not load student classes." });
  }
});

router.get("/classes/:classId/absences", async (req, res) => {
  try {
    const { classId } = req.params;
    const { studentId } = req.query;

    if (!studentId || !classId) {
      return res.status(400).json({
        message: "studentId and classId are required.",
      });
    }

    const [rows] = await db.query(
        `
        SELECT 
          a.id,
          a.date,
          a.status,
          ae.reason,
          ae.status AS excuseStatus,
          ae.submitted_at AS excuseSubmittedAt
        FROM attendance a
        LEFT JOIN absence_excuses ae 
          ON ae.attendance_id = a.id
        WHERE a.student_id = ?
          AND a.class_id = ?
          AND a.status IN ('absent', 'late', 'excused')
        ORDER BY a.date DESC
        `,
        [studentId, classId]
      );

    res.json(rows);
  } catch (err) {
    console.error("Student absences error:", err);
    res.status(500).json({
      message: "Could not load absences.",
    });
  }
});

router.post("/absences/:attendanceId/excuse", async (req, res) => {
  try {
    const { attendanceId } = req.params;
    const { reason } = req.body;

    if (!attendanceId || !reason) {
      return res.status(400).json({
        message: "attendanceId and reason are required.",
      });
    }

    await db.query(
      `
        INSERT INTO absence_excuses (attendance_id, reason)
        VALUES (?, ?)
        `,
      [attendanceId, reason]
    );

    res.json({
      message: "Excuse submitted successfully.",
    });
  } catch (err) {
    console.error("Submit excuse error:", err);
    res.status(500).json({
      message: "Could not submit excuse.",
    });
  }
});
module.exports = router;
