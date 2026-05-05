const db = require("./db");

async function seedDemoData() {
  try {
    const [[teacher]] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      ["teacher@school.edu"]
    );

    if (!teacher) {
      throw new Error("Run seedUsers.js first.");
    }

    await db.query(
      `
      INSERT INTO classes (id, name, teacher_id, min_attendance_pct)
      VALUES
        (1, 'Biology', ?, 75),
        (2, 'English', ?, 75),
        (3, 'Math', ?, 80),
        (4, 'Animal Psychology', ?, 78),
        (5, 'Plant Physics', ?, 72)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        teacher_id = VALUES(teacher_id),
        min_attendance_pct = VALUES(min_attendance_pct)
      `,
      [teacher.id, teacher.id, teacher.id, teacher.id, teacher.id]
    );

    const emailToEnrollment = {
      "student@school.edu": [1, 2, 3],
      "nat@school.edu": [1, 4, 5],
      "roy@school.edu": [2, 3, 4],
    };

    for (const [email, classIds] of Object.entries(emailToEnrollment)) {
      const [[row]] = await db.query("SELECT id FROM users WHERE email = ?", [
        email,
      ]);
      if (!row) continue;
      for (const classId of classIds) {
        await db.query(
          `
          INSERT INTO enrollments (student_id, class_id)
          VALUES (?, ?)
          ON DUPLICATE KEY UPDATE student_id = VALUES(student_id)
          `,
          [row.id, classId]
        );
      }
    }

    console.log("Demo class data seeded.");
    process.exit();
  } catch (err) {
    console.error("Seed demo data error:", err);
    process.exit(1);
  }
}

seedDemoData();
