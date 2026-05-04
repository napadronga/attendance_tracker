const db = require("./db");

async function seedDemoData() {
  try {
    const [[student]] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      ["student@gmail.com"]
    );

    const [[teacher]] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      ["teacher@gmail.com"]
    );

    if (!student || !teacher) {
      throw new Error("Run seedUsers.js first.");
    }

    await db.query(
      `
      INSERT INTO classes (id, name, teacher_id, min_attendance_pct)
      VALUES
        (1, 'Biology', ?, 75),
        (2, 'English', ?, 75),
        (3, 'Math', ?, 80)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        teacher_id = VALUES(teacher_id),
        min_attendance_pct = VALUES(min_attendance_pct)
      `,
      [teacher.id, teacher.id, teacher.id]
    );

    await db.query(
      `
      INSERT INTO enrollments (student_id, class_id)
      VALUES
        (?, 1),
        (?, 2),
        (?, 3)
      ON DUPLICATE KEY UPDATE student_id = VALUES(student_id)
      `,
      [student.id, student.id, student.id]
    );

    await db.query(
      `
      INSERT INTO attendance_summary
        (student_id, class_id, total_classes, attended_classes, attendance_pct)
      VALUES
        (?, 1, 20, 17, 85.00),
        (?, 2, 20, 14, 70.00),
        (?, 3, 20, 18, 90.00)
      ON DUPLICATE KEY UPDATE
        total_classes = VALUES(total_classes),
        attended_classes = VALUES(attended_classes),
        attendance_pct = VALUES(attendance_pct)
      `,
      [student.id, student.id, student.id]
    );

    console.log("Demo class data seeded.");
    process.exit();
  } catch (err) {
    console.error("Seed demo data error:", err);
    process.exit(1);
  }
}

seedDemoData();