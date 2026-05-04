const bcrypt = require("bcrypt");
const db = require("./db");

async function seedUsers() {
  try {
    const passwordHash = await bcrypt.hash("password123", 10);

    await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       first_name = VALUES(first_name),
       last_name = VALUES(last_name),
       role = VALUES(role)`,
      ["student@gmail.com", passwordHash, "Test", "Student", "student"]
    );

    await db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       password_hash = VALUES(password_hash),
       first_name = VALUES(first_name),
       last_name = VALUES(last_name),
       role = VALUES(role)`,
      ["teacher@gmail.com", passwordHash, "Test", "Teacher", "teacher"]
    );

    console.log("Seed users added.");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedUsers();