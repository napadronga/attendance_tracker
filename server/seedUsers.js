const bcrypt = require("bcrypt");
const db = require("./db");

const demoUsers = [
  ["student@school.edu", "Alex", "Student", "student"],
  ["teacher@school.edu", "Morgan", "Teacher", "teacher"],
  ["nat@school.edu", "Nat", "p", "student"],
  ["roy@school.edu", "Roy", "Peterberryson", "student"],
];

async function seedUsers() {
  try {
    const passwordHash = await bcrypt.hash("password123", 10);

    for (const [email, firstName, lastName, role] of demoUsers) {
      await db.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
         password_hash = VALUES(password_hash),
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         role = VALUES(role)`,
        [email, passwordHash, firstName, lastName, role]
      );
    }

    console.log("Seed users added.");
    process.exit();
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seedUsers();
