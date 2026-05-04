const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/classes", async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({ message: "teacherId is required." });
    }

    const [rows] = await db.query(
      `
      SELECT 
        id,
        name,
        min_attendance_pct AS minAttendance
      FROM classes
      WHERE teacher_id = ?
      ORDER BY name
      `,
      [teacherId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Teacher classes error:", err);
    res.status(500).json({ message: "Could not load teacher classes." });
  }
});

router.get("/classes/:classId/students", async (req, res) => {
  try {
    const { classId } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        u.id,
        CONCAT(u.first_name, ' ', u.last_name) AS name,
        u.email,
        COALESCE(s.attendance_pct, 0) AS attendancePct,
        COALESCE(s.total_classes - s.attended_classes, 0) AS absences
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      LEFT JOIN attendance_summary s
        ON s.student_id = u.id AND s.class_id = e.class_id
      WHERE e.class_id = ?
        AND u.role = 'student'
      ORDER BY u.last_name, u.first_name
      `,
      [classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Teacher students error:", err);
    res.status(500).json({ message: "Could not load students." });
  }
});

router.post("/classes/:classId/attendance", async (req, res) => {
  try {
    const { classId } = req.params;
    const { date, teacherId, records } = req.body;

    if (!classId || !date || !teacherId || !Array.isArray(records)) {
      return res.status(400).json({
        message: "classId, date, teacherId, and records are required.",
      });
    }

    // 1. Save or update the daily attendance records
    for (const record of records) {
      await db.query(
        `
          INSERT INTO attendance (class_id, student_id, date, status, marked_by)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            marked_by = VALUES(marked_by),
            updated_at = CURRENT_TIMESTAMP
          `,
        [classId, record.studentId, date, record.status, teacherId]
      );
    }

    // 2. Recalculate attendance_summary for each student
    for (const record of records) {
      const [summaryRows] = await db.query(
        `
          SELECT
            COUNT(*) AS total_classes,
            SUM(
              CASE 
                WHEN status IN ('present', 'late', 'excused') THEN 1 
                ELSE 0 
              END
            ) AS attended_classes
          FROM attendance
          WHERE class_id = ?
            AND student_id = ?
          `,
        [classId, record.studentId]
      );

      const totalClasses = Number(summaryRows[0].total_classes) || 0;
      const attendedClasses = Number(summaryRows[0].attended_classes) || 0;

      const attendancePct =
        totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

      await db.query(
        `
          INSERT INTO attendance_summary
            (student_id, class_id, total_classes, attended_classes, attendance_pct)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            total_classes = VALUES(total_classes),
            attended_classes = VALUES(attended_classes),
            attendance_pct = VALUES(attendance_pct)
          `,
        [
          record.studentId,
          classId,
          totalClasses,
          attendedClasses,
          attendancePct,
        ]
      );
    }

    res.json({
      message: "Attendance submitted successfully.",
    });
  } catch (err) {
    console.error("Submit attendance error:", err);
    res.status(500).json({
      message: "Could not submit attendance.",
    });
  }
});

router.get("/classes/:classId/attendance", async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({
        message: "classId and date are required.",
      });
    }

    const [rows] = await db.query(
      `
        SELECT student_id AS studentId, status
        FROM attendance
        WHERE class_id = ?
          AND date = ?
        `,
      [classId, date]
    );

    res.json(rows);
  } catch (err) {
    console.error("Fetch attendance error:", err);
    res.status(500).json({
      message: "Could not load attendance.",
    });
  }
});

router.get("/classes/:classId/history", async (req, res) => {
  try {
    const { classId } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          date,
          SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) AS present,
          SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) AS absent,
          COUNT(*) AS total
        FROM attendance
        WHERE class_id = ?
        GROUP BY date
        ORDER BY date DESC
        `,
      [classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Teacher history error:", err);
    res.status(500).json({
      message: "Could not load attendance history.",
    });
  }
});

router.get("/classes/:classId/history/:date", async (req, res) => {
  try {
    const { classId, date } = req.params;

    const [rows] = await db.query(
      `
        SELECT
          u.id,
          CONCAT(u.first_name, ' ', u.last_name) AS name,
          u.email,
          a.status
        FROM attendance a
        JOIN users u ON a.student_id = u.id
        WHERE a.class_id = ?
          AND a.date = ?
        ORDER BY u.last_name, u.first_name
        `,
      [classId, date]
    );

    res.json(rows);
  } catch (err) {
    console.error("Teacher session detail error:", err);
    res.status(500).json({
      message: "Could not load attendance session.",
    });
  }
});

router.put("/classes/:classId/history/:date", async (req, res) => {
  try {
    const { classId, date } = req.params;
    const { teacherId, records } = req.body;

    if (!teacherId || !Array.isArray(records)) {
      return res.status(400).json({
        message: "teacherId and records are required.",
      });
    }

    for (const record of records) {
      await db.query(
        `
          INSERT INTO attendance (class_id, student_id, date, status, marked_by)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            marked_by = VALUES(marked_by),
            updated_at = CURRENT_TIMESTAMP
          `,
        [classId, record.studentId, date, record.status, teacherId]
      );
    }

    for (const record of records) {
      const [summaryRows] = await db.query(
        `
          SELECT
            COUNT(*) AS total_classes,
            SUM(
              CASE 
                WHEN status IN ('present', 'late', 'excused') THEN 1 
                ELSE 0 
              END
            ) AS attended_classes
          FROM attendance
          WHERE class_id = ?
            AND student_id = ?
          `,
        [classId, record.studentId]
      );

      const totalClasses = Number(summaryRows[0].total_classes) || 0;
      const attendedClasses = Number(summaryRows[0].attended_classes) || 0;
      const attendancePct =
        totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

      await db.query(
        `
          INSERT INTO attendance_summary
            (student_id, class_id, total_classes, attended_classes, attendance_pct)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            total_classes = VALUES(total_classes),
            attended_classes = VALUES(attended_classes),
            attendance_pct = VALUES(attendance_pct)
          `,
        [
          record.studentId,
          classId,
          totalClasses,
          attendedClasses,
          attendancePct,
        ]
      );
    }

    res.json({
      message: "Attendance history updated successfully.",
    });
  } catch (err) {
    console.error("Save history error:", err);
    res.status(500).json({
      message: "Could not save attendance history.",
    });
  }
});

router.get("/excuses", async (req, res) => {
  try {
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        message: "teacherId is required.",
      });
    }

    const [rows] = await db.query(
      `
        SELECT
          ae.id,
          ae.reason,
          ae.status AS excuseStatus,
          ae.submitted_at AS submittedAt,
          a.date AS absenceDate,
          a.status AS attendanceStatus,
          c.name AS className,
          u.id AS studentId,
          CONCAT(u.first_name, ' ', u.last_name) AS studentName,
          u.email AS studentEmail
        FROM absence_excuses ae
        JOIN attendance a ON ae.attendance_id = a.id
        JOIN classes c ON a.class_id = c.id
        JOIN users u ON a.student_id = u.id
        WHERE c.teacher_id = ?
        ORDER BY ae.submitted_at DESC
        `,
      [teacherId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Teacher excuses error:", err);
    res.status(500).json({
      message: "Could not load excuses.",
    });
  }
});

router.put("/excuses/:excuseId", async (req, res) => {
  try {
    const { excuseId } = req.params;
    const { status, teacherId } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status must be approved or rejected.",
      });
    }

    const [excuseRows] = await db.query(
      `
        SELECT 
          ae.attendance_id,
          a.student_id,
          a.class_id
        FROM absence_excuses ae
        JOIN attendance a ON ae.attendance_id = a.id
        WHERE ae.id = ?
        `,
      [excuseId]
    );

    if (excuseRows.length === 0) {
      return res.status(404).json({
        message: "Excuse not found.",
      });
    }

    const excuse = excuseRows[0];

    await db.query(
      `
        UPDATE absence_excuses
        SET status = ?, reviewed_by = ?
        WHERE id = ?
        `,
      [status, teacherId, excuseId]
    );

    const attendanceStatus = status === "approved" ? "excused" : "absent";

    await db.query(
      `
        UPDATE attendance
        SET status = ?
        WHERE id = ?
        `,
      [attendanceStatus, excuse.attendance_id]
    );

    const [summaryRows] = await db.query(
      `
        SELECT
          COUNT(*) AS total_classes,
          SUM(
            CASE 
              WHEN status IN ('present', 'late', 'excused') THEN 1 
              ELSE 0 
            END
          ) AS attended_classes
        FROM attendance
        WHERE class_id = ?
          AND student_id = ?
        `,
      [excuse.class_id, excuse.student_id]
    );

    const totalClasses = Number(summaryRows[0].total_classes) || 0;
    const attendedClasses = Number(summaryRows[0].attended_classes) || 0;
    const attendancePct =
      totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;

    await db.query(
      `
        INSERT INTO attendance_summary
          (student_id, class_id, total_classes, attended_classes, attendance_pct)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          total_classes = VALUES(total_classes),
          attended_classes = VALUES(attended_classes),
          attendance_pct = VALUES(attendance_pct)
        `,
      [
        excuse.student_id,
        excuse.class_id,
        totalClasses,
        attendedClasses,
        attendancePct,
      ]
    );

    res.json({
      message:
        status === "approved"
          ? "Excuse approved and attendance marked as excused."
          : "Excuse rejected and attendance remains absent.",
    });
  } catch (err) {
    console.error("Update excuse error:", err);
    res.status(500).json({
      message: "Could not update excuse.",
    });
  }
});
module.exports = router;
