-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2026 at 02:25 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `attendance_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `absence_excuses`
--

CREATE TABLE `absence_excuses` (
  `id` int(11) NOT NULL,
  `attendance_id` int(11) NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reviewed_by` int(11) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late','excused') NOT NULL DEFAULT 'absent',
  `marked_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

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
(129, 3, 1, '2026-05-04', 'present', 2, '2026-05-04 11:58:53', '2026-05-04 11:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_summary`
--

CREATE TABLE `attendance_summary` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `total_classes` int(11) DEFAULT 0,
  `attended_classes` int(11) DEFAULT 0,
  `attendance_pct` decimal(5,2) DEFAULT 0.00,
  `last_updated` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance_summary`
--

INSERT INTO `attendance_summary` (`id`, `student_id`, `class_id`, `total_classes`, `attended_classes`, `attendance_pct`, `last_updated`) VALUES
(1, 1, 1, 21, 18, 85.71, '2026-05-04 11:57:13'),
(2, 1, 2, 21, 14, 66.67, '2026-05-04 12:03:05'),
(3, 1, 3, 21, 19, 90.48, '2026-05-04 11:58:53');

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `min_attendance_pct` decimal(5,2) NOT NULL DEFAULT 75.00,
  `max_students` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `teacher_id`, `min_attendance_pct`, `max_students`, `created_at`) VALUES
(1, 'Biology', 2, 75.00, NULL, '2026-05-04 11:12:06'),
(2, 'English', 2, 75.00, NULL, '2026-05-04 11:12:06'),
(3, 'Math', 2, 80.00, NULL, '2026-05-04 11:12:06');

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollments`
--

INSERT INTO `enrollments` (`id`, `student_id`, `class_id`, `enrolled_at`) VALUES
(1, 1, 1, '2026-05-04 11:12:06'),
(2, 1, 2, '2026-05-04 11:12:06'),
(3, 1, 3, '2026-05-04 11:12:06');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `generated_by` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `report_type` enum('student','class','overall') NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `role` enum('admin','teacher','student') NOT NULL DEFAULT 'student',
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `two_factor_enabled`, `two_factor_secret`, `created_at`) VALUES
(1, 'student@gmail.com', '$2b$10$Eg/3GLTclKEU1mf7Nm6vmu/RC5QGPYgDK3xEwNWaKqXHaa82S8CCa', 'Test', 'Student', 'student', 0, NULL, '2026-05-04 11:04:24'),
(2, 'teacher@gmail.com', '$2b$10$Eg/3GLTclKEU1mf7Nm6vmu/RC5QGPYgDK3xEwNWaKqXHaa82S8CCa', 'Test', 'Teacher', 'teacher', 0, NULL, '2026-05-04 11:04:24');

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absence_excuses`
--
ALTER TABLE `absence_excuses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attendance_id` (`attendance_id`),
  ADD KEY `reviewed_by` (`reviewed_by`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `class_id` (`class_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `class_id` (`class_id`,`student_id`,`date`),
  ADD KEY `marked_by` (`marked_by`),
  ADD KEY `idx_attendance_class_date` (`class_id`,`date`),
  ADD KEY `idx_attendance_student` (`student_id`);

--
-- Indexes for table `attendance_summary`
--
ALTER TABLE `attendance_summary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`class_id`),
  ADD KEY `idx_summary_student` (`student_id`),
  ADD KEY `idx_summary_class` (`class_id`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_classes_teacher` (`teacher_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`class_id`),
  ADD KEY `idx_enrollments_student` (`student_id`),
  ADD KEY `idx_enrollments_class` (`class_id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `generated_by` (`generated_by`),
  ADD KEY `idx_reports_class` (`class_id`),
  ADD KEY `idx_reports_student` (`student_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absence_excuses`
--
ALTER TABLE `absence_excuses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=132;

--
-- AUTO_INCREMENT for table `attendance_summary`
--
ALTER TABLE `attendance_summary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absence_excuses`
--
ALTER TABLE `absence_excuses`
  ADD CONSTRAINT `absence_excuses_ibfk_1` FOREIGN KEY (`attendance_id`) REFERENCES `attendance` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `absence_excuses_ibfk_2` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`marked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `attendance_summary`
--
ALTER TABLE `attendance_summary`
  ADD CONSTRAINT `attendance_summary_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_summary_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`generated_by`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
