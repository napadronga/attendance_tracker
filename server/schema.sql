CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

-- users: single table for admin, teachers, and students
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  role          ENUM('admin','teacher','student') NOT NULL DEFAULT 'student',

  -- 2fa support
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret  VARCHAR(255) DEFAULT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user_sessions: login tracking / jwt refresh support
CREATE TABLE user_sessions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  token       VARCHAR(512) NOT NULL,
  expires_at  DATETIME NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- classes: each class belongs to one teacher
CREATE TABLE classes (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  name               VARCHAR(255) NOT NULL,
  teacher_id         INT NOT NULL,
  min_attendance_pct DECIMAL(5,2) NOT NULL DEFAULT 75.00,
  max_students       INT DEFAULT NULL,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- enrollments: which students are in which classes
CREATE TABLE enrollments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  student_id  INT NOT NULL,
  class_id    INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (student_id, class_id),

  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE
);

-- attendance: one row per student per class per day
CREATE TABLE attendance (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  class_id   INT NOT NULL,
  student_id INT NOT NULL,
  date       DATE NOT NULL,
  status     ENUM('present', 'absent', 'late', 'excused') NOT NULL DEFAULT 'absent',
  marked_by  INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE (class_id, student_id, date),

  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (marked_by)  REFERENCES users(id) ON DELETE SET NULL
);

-- attendance_summary: precomputed stats for fast analytics
CREATE TABLE attendance_summary (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  student_id        INT NOT NULL,
  class_id          INT NOT NULL,
  total_classes     INT DEFAULT 0,
  attended_classes  INT DEFAULT 0,
  attendance_pct    DECIMAL(5,2) DEFAULT 0.00,
  last_updated      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE (student_id, class_id),

  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE
);

-- absence_excuses: students can submit a reason for an absence
CREATE TABLE absence_excuses (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  attendance_id INT NOT NULL,
  reason        TEXT NOT NULL,
  status        ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  reviewed_by   INT DEFAULT NULL,
  submitted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by)   REFERENCES users(id) ON DELETE SET NULL
);

-- reports: generated pdf/export records
CREATE TABLE reports (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  generated_by INT NOT NULL,
  class_id     INT DEFAULT NULL,
  student_id   INT DEFAULT NULL,
  report_type  ENUM('student','class','overall') NOT NULL,
  file_path    VARCHAR(255) NOT NULL,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id)     REFERENCES classes(id) ON DELETE SET NULL,
  FOREIGN KEY (student_id)   REFERENCES users(id) ON DELETE SET NULL
);

-- announcements: teacher -> students in a class
CREATE TABLE announcements (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  class_id    INT NOT NULL,
  teacher_id  INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  message     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- audit_logs: security + action tracking
CREATE TABLE audit_logs (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT,
  action     VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- indexes for common queries
CREATE INDEX idx_attendance_class_date   ON attendance(class_id, date);
CREATE INDEX idx_attendance_student      ON attendance(student_id);
CREATE INDEX idx_enrollments_student     ON enrollments(student_id);
CREATE INDEX idx_enrollments_class       ON enrollments(class_id);
CREATE INDEX idx_classes_teacher         ON classes(teacher_id);
CREATE INDEX idx_summary_student         ON attendance_summary(student_id);
CREATE INDEX idx_summary_class           ON attendance_summary(class_id);
CREATE INDEX idx_reports_class           ON reports(class_id);
CREATE INDEX idx_reports_student         ON reports(student_id);
