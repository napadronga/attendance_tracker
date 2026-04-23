CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

-- a single table for both teachers and students,role separates them, shared login

CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  role          ENUM('teacher', 'student') NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- each class belongs to one teacher,min_attendance_pct is the minimum required attendance (e.g. 75.00)
CREATE TABLE classes (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  name               VARCHAR(255) NOT NULL,
  teacher_id         INT NOT NULL,
  min_attendance_pct DECIMAL(5,2) NOT NULL DEFAULT 75.00,
  max_students       INT DEFAULT NULL,
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- enrollments table to trackwhich students are in which classes
CREATE TABLE enrollments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  student_id  INT NOT NULL,
  class_id    INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE (student_id, class_id),
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (class_id)   REFERENCES classes(id) ON DELETE CASCADE
);

-- attendance is one row per student per class per day
-- status tracks present/absent/late/excused
-- marked_by is who recorded it

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

-- absence_excuses - students can submit a reason for an absence
CREATE TABLE absence_excuses (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  attendance_id INT NOT NULL,
  reason        TEXT NOT NULL,
  status        ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  reviewed_by   INT DEFAULT NULL,
  submitted_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (attendance_id) REFERENCES attendance(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by)   REFERENCES users(id) ON DELETE SET NULL
);

-- indexes for common queries
CREATE INDEX idx_attendance_class_date   ON attendance(class_id, date);
CREATE INDEX idx_attendance_student      ON attendance(student_id);
CREATE INDEX idx_enrollments_student     ON enrollments(student_id);
CREATE INDEX idx_enrollments_class       ON enrollments(class_id);
CREATE INDEX idx_classes_teacher         ON classes(teacher_id);
