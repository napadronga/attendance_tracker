const studentRoutes = require("./student/studentRoutes");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const db = require("./db");
const authRoutes = require("./auth/authRoutes");
const teacherRoutes = require("./teacher/teacherRoutes");

const app = express();


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/teacher", teacherRoutes);


// api route
app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from backend" });
});

// verifies the database connection
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", database: err.message });
  }
});

// serve react build in production only
const buildPath = path.join(__dirname, "../client/build");

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});