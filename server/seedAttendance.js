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

const demoSeedPlan = [
  {
    email: "student@school.edu",
    wipeClassIds: [1, 2, 3],
    sessions: [
      { classId: 1, month: 1, attendedCount: 17, totalCount: 20 },
      { classId: 2, month: 2, attendedCount: 14, totalCount: 20 },
      { classId: 3, month: 3, attendedCount: 18, totalCount: 20 },
    ],
  },
  {
    email: "nat@school.edu",
    wipeClassIds: [1, 4, 5],
    sessions: [
      { classId: 1, month: 1, attendedCount: 16, totalCount: 20 },
      { classId: 4, month: 4, attendedCount: 13, totalCount: 18 },
      { classId: 5, month: 6, attendedCount: 14, totalCount: 16 },
    ],
  },
  {
    email: "roy@school.edu",
    wipeClassIds: [2, 3, 4],
    sessions: [
      { classId: 2, month: 2, attendedCount: 15, totalCount: 20 },
      { classId: 3, month: 3, attendedCount: 16, totalCount: 20 },
      { classId: 4, month: 4, attendedCount: 11, totalCount: 18 },
    ],
  },
];

async function seedAttendance() {
  try {
    const [[teacher]] = await db.query("SELECT id FROM users WHERE email = ?", [
      "teacher@school.edu",
    ]);

    if (!teacher) {
      throw new Error("Run seedUsers.js first.");
    }

    for (const plan of demoSeedPlan) {
      const [[student]] = await db.query(
        "SELECT id FROM users WHERE email = ?",
        [plan.email]
      );
      if (!student) {
        throw new Error(`Missing user ${plan.email}`);
      }

      const placeholders = plan.wipeClassIds.map(() => "?").join(", ");
      await db.query(
        `
        DELETE FROM attendance
        WHERE student_id = ?
          AND class_id IN (${placeholders})
        `,
        [student.id, ...plan.wipeClassIds]
      );

      for (const session of plan.sessions) {
        await seedClassAttendance({
          classId: session.classId,
          studentId: student.id,
          teacherId: teacher.id,
          month: session.month,
          attendedCount: session.attendedCount,
          totalCount: session.totalCount,
        });
      }
    }

    console.log("Demo attendance records seeded and summaries recalculated.");
    process.exit();
  } catch (err) {
    console.error("Seed attendance error:", err);
    process.exit(1);
  }
}

seedAttendance();
