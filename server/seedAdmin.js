const bcrypt = require("bcrypt");
const db = require("./db");

async function seedAdmin() {
  try {
    const passwordHash = await bcrypt.hash("password123", 10);

    await db.query(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, role)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        password_hash = VALUES(password_hash),
        first_name = VALUES(first_name),
        last_name = VALUES(last_name),
        role = VALUES(role)
      `,
      ["admin@gmail.com", passwordHash, "Test", "Admin", "admin"]
    );

    console.log("Admin user added.");
    process.exit();
  } catch (err) {
    console.error("Seed admin error:", err);
    process.exit(1);
  }
}

seedAdmin();