# Attendance Management System

A web-based attendance management system built with React, Node.js, Express, and MySQL/MariaDB.

Students can register, log in, view attendance, see absences, submit absence excuses, and see whether an excuse is pending, approved, or rejected. Teachers can view class statistics, mark students present or absent, edit previous attendance records, and approve or reject student excuses. Admin users can manage users, classes, and student enrollments.

---

## 1. Project Stack

### Frontend
- React
- React Router
- Recharts
- CSS
- JavaScript

### Backend
- Node.js
- Express
- MySQL / MariaDB
- bcrypt for password hashing

### Database
- MySQL / MariaDB
- XAMPP / phpMyAdmin

---

## 2. Main Features

### Authentication Features
- Register new accounts
- Login by role: student, teacher, or admin
- Hashed passwords using bcrypt
- Protected routes based on user role
- Logout functionality

### Student Features
- Login as a student
- View attendance overview by class
- View attendance percentage
- View classes attended and total class records
- View total absences
- View minimum required attendance
- View missed days
- Submit an excuse for an absence
- View excuse status: pending, approved, rejected, or not submitted
- View updated attendance status such as absent or excused

### Teacher Features
- Login as a teacher
- View classes taught by the teacher
- View class attendance statistics
- View students in each class
- Mark students present or absent
- Submit attendance to the database
- View previous attendance history
- Edit previous attendance records
- View student absence excuses
- Approve or reject student excuses
- Attendance overview updates after attendance records or excuses are changed

### Admin Features
- Login as an admin
- View users
- Create student, teacher, or admin accounts
- Create classes
- Assign teachers to classes
- Enroll students into classes
- Create starter attendance summary records for enrolled students

### Unique Features
- Dark/light theme switcher
- Theme preference saved with local storage
- Interactive attendance charts using Recharts
- Excuse approval workflow that updates attendance status

---

## 3. Folder Structure

```txt
attendance_tracker
├── client
│   └── src
│       ├── components
│       │   ├── Navbar.jsx
│       │   ├── Navbar.css
│       │   └── ProtectedRoute.jsx
│       ├── pages
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── ForgotPassword.jsx
│       │   ├── StudentOverview.jsx
│       │   ├── StudentAttendance.jsx
│       │   ├── TeacherOverview.jsx
│       │   ├── TeacherMark.jsx
│       │   ├── TeacherHistory.jsx
│       │   ├── TeacherExcuses.jsx
│       │   └── AdminDashboard.jsx
│       ├── api.js
│       ├── index.jsx
│       └── index.css
├── server
│   ├── auth
│   │   └── authRoutes.js
│   ├── student
│   │   └── studentRoutes.js
│   ├── teacher
│   │   └── teacherRoutes.js
│   ├── admin
│   │   └── adminRoutes.js
│   ├── db.js
│   ├── schema.sql
│   ├── seedUsers.js
│   ├── seedDemoData.js
│   ├── seedAttendance.js
│   ├── seedAdmin.js
│   ├── attendance_db.sql
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

Note: The exact folder structure may vary slightly depending on the final files included by the team.

---

## 4. Required Software

Install these before running the project:

- Node.js
- npm
- Git
- XAMPP
- MySQL / MariaDB
- phpMyAdmin

---

## 5. Clone the Project

Open PowerShell or VS Code terminal:

```powershell
git clone https://github.com/napadronga/attendance_tracker.git
cd attendance_tracker
```

If you already have the project:

```powershell
git pull
```

---

## 6. Install Dependencies

From the root folder:

```powershell
npm install
```

Then install frontend dependencies:

```powershell
cd client
npm install
cd ..
```

If the server folder has its own `package.json`, also run:

```powershell
cd server
npm install
cd ..
```

---

## 7. Create the Environment File

Create a `.env` file in the root folder:

```txt
attendance_tracker/.env
```

Add this:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=attendance_db
DB_PORT=3306
PORT=5001
```

For default XAMPP MySQL, the username is usually `root` and the password is blank.

Do not push `.env` to GitHub.

---

## 8. Start MySQL

Open XAMPP Control Panel and start:

```txt
MySQL
```

To open phpMyAdmin:

```txt
http://localhost/phpmyadmin
```

---

## 9. Database Setup

There are two options.

Use **Option A** if you want the exact same demo database as the original data.

Use **Option B** if you want a fresh database created with schema and seed scripts.

---

## Option A: Import the Exact Demo Database

Use this option if the project includes:

```txt
server/attendance_db.sql
```

This SQL export includes:

- database tables
- demo student account
- demo teacher account
- demo admin account, if included in the export
- Biology, English, and Math classes
- enrollments
- attendance records
- attendance summaries
- submitted excuses and their review statuses, if included in the export

### Steps

1. Start MySQL in XAMPP.
2. Open phpMyAdmin.
3. Click **Import**.
4. Choose:

```txt
server/attendance_db.sql
```

5. Click **Go**.

After importing, the database should be named:

```txt
attendance_db
```

Do not run the seed files after importing the full export because the export already contains demo data.

---

## Option B: Create a Fresh Database with Schema and Seed Files

### Step 1: Import the schema

From the root project folder:

```powershell
C:\xampp\mysql\bin\mysql.exe -u root < server/schema.sql
```

If your MySQL root account has a password:

```powershell
C:\xampp\mysql\bin\mysql.exe -u root -p < server/schema.sql
```

### Step 2: Seed demo users

```powershell
node server/seedUsers.js
```

### Step 3: Seed classes and enrollments

```powershell
node server/seedDemoData.js
```

### Step 4: Seed attendance records

```powershell
node server/seedAttendance.js
```

### Step 5: Seed admin user, if included

```powershell
node server/seedAdmin.js
```

---

## 10. Demo Login Accounts

### Student Login

```txt
Email: student@gmail.com
Password: password123
Role: Student
```

### Teacher Login

```txt
Email: teacher@gmail.com
Password: password123
Role: Teacher
```

### Admin Login

```txt
Email: admin@gmail.com
Password: password123
Role: Admin
```

The selected role must match the account.

---

## 11. Run the Project

From the root folder:

```powershell
npm run dev
```

Backend:

```txt
http://localhost:5001
```

Frontend:

```txt
http://localhost:3001
```

Open:

```txt
http://localhost:3001
```

---

## 12. Test Backend Connection

In a second terminal:

```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/health"
```

Expected result:

```txt
status   database
------   --------
ok       connected
```

If the database is not connected, check:

- MySQL is running in XAMPP
- `.env` exists in the root folder
- `DB_NAME=attendance_db`
- MySQL username/password are correct
- The database has been imported or seeded

---

## 13. Test Authentication API

### Register API Test

```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/register" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"firstName":"New","lastName":"Student","email":"newstudent@gmail.com","password":"password123","role":"student"}'
```

### Teacher Login API Test

```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"teacher@gmail.com","password":"password123","role":"teacher"}'
```

### Student Login API Test

```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"student@gmail.com","password":"password123","role":"student"}'
```

### Admin Login API Test

```powershell
Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@gmail.com","password":"password123","role":"admin"}'
```

---

## 14. Important API Routes

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

### Student

```txt
GET /api/student/classes?studentId=1
GET /api/student/classes/:classId/absences?studentId=1
POST /api/student/absences/:attendanceId/excuse
```

### Teacher

```txt
GET /api/teacher/classes?teacherId=2
GET /api/teacher/classes/:classId/students
GET /api/teacher/classes/:classId/attendance?date=YYYY-MM-DD
POST /api/teacher/classes/:classId/attendance
GET /api/teacher/classes/:classId/history
GET /api/teacher/classes/:classId/history/:date
PUT /api/teacher/classes/:classId/history/:date
GET /api/teacher/excuses?teacherId=2
PUT /api/teacher/excuses/:excuseId
```

### Admin

```txt
GET /api/admin/users
POST /api/admin/users
GET /api/admin/classes
POST /api/admin/classes
POST /api/admin/enrollments
```

---

## 15. How Student, Teacher, and Admin Are Connected

The student, teacher, and admin roles are connected through the database.

```txt
Admin
   ↓
creates users, creates classes, enrolls students

Teacher user
   ↓
classes.teacher_id

Student user
   ↓
enrollments.student_id
   ↓
classes.id

Class + Student
   ↓
attendance.class_id + attendance.student_id
```

This means:

- Admins manage users, classes, and enrollments.
- A teacher owns classes.
- A student is enrolled in classes.
- Attendance records belong to a student and a class.
- Attendance summaries are calculated from attendance records.

---

## 16. Excuse Workflow

The excuse workflow connects the student side and teacher side.

### Student submits an excuse

When a student submits an excuse for an absence:

```txt
attendance.status = absent
absence_excuses.status = pending
```

The student sees:

```txt
Attendance Status: Absent
Excuse Status: Pending
```

### Teacher approves an excuse

When a teacher approves an excuse:

```txt
attendance.status = excused
absence_excuses.status = approved
```

The student sees:

```txt
Attendance Status: Excused
Excuse Status: Approved
```

The teacher sees the same excuse record with an approved status.

### Teacher rejects an excuse

When a teacher rejects an excuse:

```txt
attendance.status = absent
absence_excuses.status = rejected
```

The student sees:

```txt
Attendance Status: Absent
Excuse Status: Rejected
```

### Attendance summary rule

The system counts these statuses as attended:

```txt
present
late
excused
```

The system does not count this status as attended:

```txt
absent
```

Because of this, approving an excuse may increase the student's attendance percentage.

---

## 17. Testing Checklist

### Authentication

- Register page creates a new user
- Registered password is hashed in MySQL
- Student login works
- Teacher login works
- Admin login works
- Wrong role does not log in
- Logout works

### Student Side

- Student redirects to student overview
- Student cannot access teacher or admin pages
- Student overview loads classes
- Student chart loads
- Student attendance page shows missed days
- Student can submit an excuse
- Blank excuse shows an error message
- Student sees excuse status as pending after submitting
- Student sees approved or rejected after teacher review
- Student sees attendance status change to excused after approval

### Teacher Side

- Teacher redirects to teacher overview
- Teacher cannot access student or admin pages
- Teacher can switch classes
- Teacher overview loads student data
- Teacher chart loads
- Teacher can mark student present or absent
- Submit attendance saves to MySQL
- Returning to Mark Attendance remembers the saved status
- Teacher history loads previous dates
- Teacher can edit previous attendance records
- Saving history updates attendance summary
- Teacher can view submitted excuses
- Teacher can approve or reject excuses
- Approved excuses change attendance status to excused
- Rejected excuses keep attendance status as absent

### Admin Side

- Admin redirects to admin dashboard
- Admin can view users
- Admin can create users
- Admin can view classes
- Admin can create classes
- Admin can enroll students into classes
- Newly enrolled students can see assigned classes

### Theme

- Dark/light theme toggle works
- Theme stays after refresh
- Login, student, teacher, and admin pages are readable in both themes

---

## 18. Registration and Admin Note

This project includes registration to meet the authentication requirement. Passwords are hashed with bcrypt before being stored in the MySQL database.

In a real school system, public registration should be restricted. Students and teachers should usually be created or approved by an administrator or school office. For this project, the admin dashboard supports user creation, class creation, and class enrollment.

---

## 19. Common Problems and Fixes

### Access denied for user root

Check `.env`.

For default XAMPP:

```env
DB_USER=root
DB_PASSWORD=
```

If your MySQL root account has a password, add it to `DB_PASSWORD`.

### Unknown database attendance_db

Import the database export or run:

```powershell
C:\xampp\mysql\bin\mysql.exe -u root < server/schema.sql
```

### Frontend login fails

Check:

- Backend is running on port `5001`
- Frontend is running on port `3001`
- MySQL is running
- The demo users exist
- The selected role matches the account
- `client/src/api.js` uses `http://localhost:5001`

### New registered student has no classes

A registered student must be enrolled into a class before classes appear in the student overview.

Use the admin dashboard or insert into the `enrollments` table.

### Excuse is approved but still shows absent

This means the `absence_excuses.status` was updated, but the matching `attendance.status` did not change to `excused`.

Check the database:

```sql
SELECT 
  ae.id AS excuse_id,
  ae.attendance_id,
  ae.status AS excuse_status,
  a.id AS attendance_id,
  a.date,
  a.status AS attendance_status
FROM absence_excuses ae
JOIN attendance a ON ae.attendance_id = a.id
ORDER BY a.date DESC;
```

For approved excuses, the expected result is:

```txt
excuse_status = approved
attendance_status = excused
```

### Recharts dependency error

Inside the `client` folder, run:

```powershell
npm install recharts react-is
Remove-Item -Recurse -Force "node_modules\.vite"
npm start -- --force
```

---

## 20. Current Project Status

Connected core features:

- Registration
- Login
- Hashed passwords
- Role-based protected routes
- Student overview
- Student absences
- Student excuse submission
- Student excuse status viewing
- Teacher overview
- Teacher mark attendance
- Teacher attendance history
- Teacher excuse review
- Teacher excuse approval/rejection
- Admin dashboard
- User creation
- Class creation
- Student enrollment
- Edit previous attendance
- Attendance summary updates
- Dark/light theme switcher
- Interactive charts

Not included yet:

- JWT persistent login
- PDF reports
- Email notifications
- Real email-based password reset

---

## 21. Future Improvements

Possible improvements:

- Teacher comments when rejecting excuses
- Email notifications
- JWT authentication
- Persistent login after refresh
- More analytics and reports
- Export attendance reports as PDF
- Real forgot-password email reset
- More detailed admin controls
