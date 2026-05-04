const db = require("./db");

function formatDate(year, month, day) {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

async function recalculateSummary(studentId, classId) {
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
    [classId, studentId]
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
    [studentId, classId, totalClasses, attendedClasses, attendancePct]
  );
}

async function seedClassAttendance({
  classId,
  studentId,
  teacherId,
  month,
  attendedCount,
  totalCount,
}) {
  for (let day = 1; day <= totalCount; day++) {
    const status = day <= attendedCount ? "present" : "absent";
    const date = formatDate(2026, month, day);

    await db.query(
      `
      INSERT INTO attendance (class_id, student_id, date, status, marked_by)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        marked_by = VALUES(marked_by),
        updated_at = CURRENT_TIMESTAMP
      `,
      [classId, studentId, date, status, teacherId]
    );
  }

  await recalculateSummary(studentId, classId);
}

async function seedAttendance() {
  try {
    const [[student]] = await db.query("SELECT id FROM users WHERE email = ?", [
      "student@gmail.com",
    ]);

    const [[teacher]] = await db.query("SELECT id FROM users WHERE email = ?", [
      "teacher@gmail.com",
    ]);

    if (!student || !teacher) {
      throw new Error("Run seedUsers.js first.");
    }

    // Reset demo attendance for this student/classes.
    // This is only for demo data.
    await db.query(
      `
      DELETE FROM attendance
      WHERE student_id = ?
        AND class_id IN (1, 2, 3)
      `,
      [student.id]
    );

    await seedClassAttendance({
      classId: 1,
      studentId: student.id,
      teacherId: teacher.id,
      month: 1,
      attendedCount: 17,
      totalCount: 20,
    });

    await seedClassAttendance({
      classId: 2,
      studentId: student.id,
      teacherId: teacher.id,
      month: 2,
      attendedCount: 14,
      totalCount: 20,
    });

    await seedClassAttendance({
      classId: 3,
      studentId: student.id,
      teacherId: teacher.id,
      month: 3,
      attendedCount: 18,
      totalCount: 20,
    });

    console.log("Demo attendance records seeded and summaries recalculated.");
    process.exit();
  } catch (err) {
    console.error("Seed attendance error:", err);
    process.exit(1);
  }
}

seedAttendance();
