-- attendance_db: consolidated schema + demo data (single import replaces schema.sql + dump)
-- import from project root: mysql ... < server/attendance_db.sql

SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';

CREATE DATABASE IF NOT EXISTS attendance_db;
USE attendance_db;

SET NAMES utf8mb4;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS absence_excuses;
DROP TABLE IF EXISTS announcements;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS attendance_summary;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS user_sessions;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;


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

-- demo data
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `two_factor_enabled`, `two_factor_secret`, `created_at`) VALUES
(1, 'student@school.edu', '$2b$10$Eg/3GLTclKEU1mf7Nm6vmu/RC5QGPYgDK3xEwNWaKqXHaa82S8CCa', 'Alex', 'Student', 'student', 0, NULL, '2026-05-04 11:04:24'),
(2, 'teacher@school.edu', '$2b$10$Eg/3GLTclKEU1mf7Nm6vmu/RC5QGPYgDK3xEwNWaKqXHaa82S8CCa', 'Morgan', 'Teacher', 'teacher', 0, NULL, '2026-05-04 11:04:24'),
(3, 'nat@school.edu', '$2b$10$Eg/3GLTclKEU1mf7Nm6vmu/RC5QGPYgDK3xEwNWaKqXHaa82S8CCa', 'Nat', 'p', 'student', 0, NULL, '2026-05-04 11:04:24'),
(4, 'roy@school.edu', '$2b$10$Eg/3GLTclKEU1mf7Nm6vmu/RC5QGPYgDK3xEwNWaKqXHaa82S8CCa', 'Roy', 'Hackleberryson', 'student', 0, NULL, '2026-05-04 11:04:24');

INSERT INTO `classes` (`id`, `name`, `teacher_id`, `min_attendance_pct`, `max_students`, `created_at`) VALUES
(1, 'Biology', 2, 75.00, NULL, '2026-05-04 11:12:06'),
(2, 'English', 2, 75.00, NULL, '2026-05-04 11:12:06'),
(3, 'Math', 2, 80.00, NULL, '2026-05-04 11:12:06'),
(4, 'Animal Psychology', 2, 78.00, NULL, '2026-05-04 11:12:06'),
(5, 'Plant Physics', 2, 72.00, NULL, '2026-05-04 11:12:06');

INSERT INTO `enrollments` (`id`, `student_id`, `class_id`, `enrolled_at`) VALUES
(1, 1, 1, '2026-05-04 11:12:06'),
(2, 1, 2, '2026-05-04 11:12:06'),
(3, 1, 3, '2026-05-04 11:12:06'),
(4, 3, 1, '2026-05-04 11:12:06'),
(5, 3, 4, '2026-05-04 11:12:06'),
(6, 3, 5, '2026-05-04 11:12:06'),
(7, 4, 2, '2026-05-04 11:12:06'),
(8, 4, 3, '2026-05-04 11:12:06'),
(9, 4, 4, '2026-05-04 11:12:06');

INSERT INTO `attendance` (`id`, `class_id`, `student_id`, `date`, `status`, `marked_by`, `created_at`, `updated_at`) VALUES
(24, 1, 1, '2026-01-01', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(25, 1, 1, '2026-01-02', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(26, 1, 1, '2026-01-03', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(27, 1, 1, '2026-01-04', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(28, 1, 1, '2026-01-05', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(29, 1, 1, '2026-01-06', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(30, 1, 1, '2026-01-07', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(31, 1, 1, '2026-01-08', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(32, 1, 1, '2026-01-09', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(33, 1, 1, '2026-01-10', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(34, 1, 1, '2026-01-11', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(35, 1, 1, '2026-01-12', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(36, 1, 1, '2026-01-13', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(37, 1, 1, '2026-01-14', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(38, 1, 1, '2026-01-15', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(39, 1, 1, '2026-01-16', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(40, 1, 1, '2026-01-17', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(41, 1, 1, '2026-01-18', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(42, 1, 1, '2026-01-19', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(43, 1, 1, '2026-01-20', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(44, 2, 1, '2026-02-01', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 12:03:05'),
(45, 2, 1, '2026-02-02', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(46, 2, 1, '2026-02-03', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(47, 2, 1, '2026-02-04', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(48, 2, 1, '2026-02-05', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(49, 2, 1, '2026-02-06', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(50, 2, 1, '2026-02-07', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(51, 2, 1, '2026-02-08', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(52, 2, 1, '2026-02-09', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(53, 2, 1, '2026-02-10', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(54, 2, 1, '2026-02-11', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(55, 2, 1, '2026-02-12', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(56, 2, 1, '2026-02-13', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(57, 2, 1, '2026-02-14', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(58, 2, 1, '2026-02-15', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(59, 2, 1, '2026-02-16', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(60, 2, 1, '2026-02-17', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(61, 2, 1, '2026-02-18', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(62, 2, 1, '2026-02-19', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(63, 2, 1, '2026-02-20', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:58:32'),
(64, 3, 1, '2026-03-01', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(65, 3, 1, '2026-03-02', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(66, 3, 1, '2026-03-03', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(67, 3, 1, '2026-03-04', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(68, 3, 1, '2026-03-05', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(69, 3, 1, '2026-03-06', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(70, 3, 1, '2026-03-07', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(71, 3, 1, '2026-03-08', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(72, 3, 1, '2026-03-09', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(73, 3, 1, '2026-03-10', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(74, 3, 1, '2026-03-11', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(75, 3, 1, '2026-03-12', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(76, 3, 1, '2026-03-13', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(77, 3, 1, '2026-03-14', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(78, 3, 1, '2026-03-15', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(79, 3, 1, '2026-03-16', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(80, 3, 1, '2026-03-17', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(81, 3, 1, '2026-03-18', 'present', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(82, 3, 1, '2026-03-19', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(83, 3, 1, '2026-03-20', 'absent', 2, '2026-05-04 11:56:19', '2026-05-04 11:56:19'),
(84, 1, 1, '2026-05-04', 'present', 2, '2026-05-04 11:57:00', '2026-05-04 11:57:13'),
(88, 2, 1, '2026-05-04', 'present', 2, '2026-05-04 11:57:20', '2026-05-04 11:59:06'),
(129, 3, 1, '2026-05-04', 'present', 2, '2026-05-04 11:58:53', '2026-05-04 11:58:53'),
(130, 1, 3, '2026-01-01', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(131, 1, 3, '2026-01-02', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(132, 1, 3, '2026-01-03', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(133, 1, 3, '2026-01-04', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(134, 1, 3, '2026-01-05', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(135, 1, 3, '2026-01-06', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(136, 1, 3, '2026-01-07', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(137, 1, 3, '2026-01-08', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(138, 1, 3, '2026-01-09', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(139, 1, 3, '2026-01-10', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(140, 1, 3, '2026-01-11', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(141, 1, 3, '2026-01-12', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(142, 1, 3, '2026-01-13', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(143, 1, 3, '2026-01-14', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(144, 1, 3, '2026-01-15', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(145, 1, 3, '2026-01-16', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(146, 1, 3, '2026-01-17', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(147, 1, 3, '2026-01-18', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(148, 1, 3, '2026-01-19', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(149, 1, 3, '2026-01-20', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(150, 4, 3, '2026-04-01', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(151, 4, 3, '2026-04-02', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(152, 4, 3, '2026-04-03', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(153, 4, 3, '2026-04-04', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(154, 4, 3, '2026-04-05', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(155, 4, 3, '2026-04-06', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(156, 4, 3, '2026-04-07', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(157, 4, 3, '2026-04-08', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(158, 4, 3, '2026-04-09', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(159, 4, 3, '2026-04-10', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(160, 4, 3, '2026-04-11', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(161, 4, 3, '2026-04-12', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(162, 4, 3, '2026-04-13', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(163, 4, 3, '2026-04-14', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(164, 4, 3, '2026-04-15', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(165, 4, 3, '2026-04-16', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(166, 4, 3, '2026-04-17', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(167, 4, 3, '2026-04-18', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(168, 5, 3, '2026-06-01', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(169, 5, 3, '2026-06-02', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(170, 5, 3, '2026-06-03', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(171, 5, 3, '2026-06-04', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(172, 5, 3, '2026-06-05', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(173, 5, 3, '2026-06-06', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(174, 5, 3, '2026-06-07', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(175, 5, 3, '2026-06-08', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(176, 5, 3, '2026-06-09', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(177, 5, 3, '2026-06-10', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(178, 5, 3, '2026-06-11', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(179, 5, 3, '2026-06-12', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(180, 5, 3, '2026-06-13', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(181, 5, 3, '2026-06-14', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(182, 5, 3, '2026-06-15', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(183, 5, 3, '2026-06-16', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(184, 2, 4, '2026-02-01', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(185, 2, 4, '2026-02-02', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(186, 2, 4, '2026-02-03', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(187, 2, 4, '2026-02-04', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(188, 2, 4, '2026-02-05', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(189, 2, 4, '2026-02-06', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(190, 2, 4, '2026-02-07', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(191, 2, 4, '2026-02-08', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(192, 2, 4, '2026-02-09', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(193, 2, 4, '2026-02-10', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(194, 2, 4, '2026-02-11', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(195, 2, 4, '2026-02-12', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(196, 2, 4, '2026-02-13', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(197, 2, 4, '2026-02-14', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(198, 2, 4, '2026-02-15', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(199, 2, 4, '2026-02-16', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(200, 2, 4, '2026-02-17', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(201, 2, 4, '2026-02-18', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(202, 2, 4, '2026-02-19', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(203, 2, 4, '2026-02-20', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(204, 3, 4, '2026-03-01', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(205, 3, 4, '2026-03-02', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(206, 3, 4, '2026-03-03', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(207, 3, 4, '2026-03-04', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(208, 3, 4, '2026-03-05', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(209, 3, 4, '2026-03-06', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(210, 3, 4, '2026-03-07', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(211, 3, 4, '2026-03-08', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(212, 3, 4, '2026-03-09', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(213, 3, 4, '2026-03-10', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(214, 3, 4, '2026-03-11', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(215, 3, 4, '2026-03-12', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(216, 3, 4, '2026-03-13', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(217, 3, 4, '2026-03-14', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(218, 3, 4, '2026-03-15', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(219, 3, 4, '2026-03-16', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(220, 3, 4, '2026-03-17', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(221, 3, 4, '2026-03-18', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(222, 3, 4, '2026-03-19', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(223, 3, 4, '2026-03-20', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(224, 4, 4, '2026-04-01', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(225, 4, 4, '2026-04-02', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(226, 4, 4, '2026-04-03', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(227, 4, 4, '2026-04-04', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(228, 4, 4, '2026-04-05', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(229, 4, 4, '2026-04-06', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(230, 4, 4, '2026-04-07', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(231, 4, 4, '2026-04-08', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(232, 4, 4, '2026-04-09', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(233, 4, 4, '2026-04-10', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(234, 4, 4, '2026-04-11', 'present', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(235, 4, 4, '2026-04-12', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(236, 4, 4, '2026-04-13', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(237, 4, 4, '2026-04-14', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(238, 4, 4, '2026-04-15', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(239, 4, 4, '2026-04-16', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(240, 4, 4, '2026-04-17', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00'),
(241, 4, 4, '2026-04-18', 'absent', 2, '2026-05-04 12:00:00', '2026-05-04 12:00:00');

INSERT INTO `attendance_summary` (`id`, `student_id`, `class_id`, `total_classes`, `attended_classes`, `attendance_pct`, `last_updated`) VALUES
(1, 1, 1, 21, 18, 85.71, '2026-05-04 11:57:13'),
(2, 1, 2, 21, 14, 66.67, '2026-05-04 12:03:05'),
(3, 1, 3, 21, 19, 90.48, '2026-05-04 11:58:53'),
(4, 3, 1, 20, 16, 80.00, '2026-05-04 12:00:00'),
(5, 3, 4, 18, 13, 72.22, '2026-05-04 12:00:00'),
(6, 3, 5, 16, 14, 87.50, '2026-05-04 12:00:00'),
(7, 4, 2, 20, 15, 75.00, '2026-05-04 12:00:00'),
(8, 4, 3, 20, 16, 80.00, '2026-05-04 12:00:00'),
(9, 4, 4, 18, 11, 61.11, '2026-05-04 12:00:00');

-- align auto_increment with imported ids
ALTER TABLE users MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE classes MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
ALTER TABLE enrollments MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE attendance MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;
ALTER TABLE attendance_summary MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
ALTER TABLE absence_excuses MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE announcements MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE audit_logs MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE reports MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
ALTER TABLE user_sessions MODIFY id int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;