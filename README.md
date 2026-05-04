# Attendance Management System

A web-based attendance management system built with React, Node.js, Express, and MySQL/MariaDB.

Students can view attendance, see absences, and submit excuses. Teachers can view class statistics, mark students present or absent, and edit previous attendance records.

---

## 1. Project Stack

### Frontend
- React
- React Router
- Recharts
- CSS

### Backend
- Node.js
- Express
- MySQL / MariaDB
- bcrypt

### Database
- MySQL / MariaDB
- XAMPP / phpMyAdmin

---

## 2. Main Features

### Student Features
- Login as a student
- View attendance overview by class
- View attendance percentage
- View classes attended and total class records
- View total absences
- View minimum required attendance
- View missed days
- Submit an excuse for an absence

### Teacher Features
- Login as a teacher
- View classes taught by the teacher
- View class attendance statistics
- View students in each class
- Mark students present or absent
- Submit attendance to the database
- View previous attendance history
- Edit previous attendance records
- Attendance overview updates after records are changed

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
│       │   ├── StudentOverview.jsx
│       │   ├── StudentAttendance.jsx
│       │   ├── TeacherOverview.jsx
│       │   ├── TeacherMark.jsx
│       │   └── TeacherHistory.jsx
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
│   ├── db.js
│   ├── schema.sql
│   ├── seedUsers.js
│   ├── seedDemoData.js
│   ├── seedAttendance.js
│   ├── attendance_db_export.sql
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

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

Use **Option A** if you want the exact same demo database as I do.

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
- Biology, English, and Math classes
- enrollments
- attendance records
- attendance summaries

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

## 13. Test Login API

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

Both should return a user object.

---

## 14. Important API Routes

### Auth

```txt
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
```

---

## 15. How Student and Teacher Are Connected

The student and teacher are connected through the database.

```txt
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

- A teacher owns classes.
- A student is enrolled in classes.
- Attendance records belong to a student and a class.
- Attendance summaries are calculated from attendance records.

---

## 16. Testing Checklist

### Student Side

- Log in as student
- Student redirects to student overview
- Student cannot access teacher pages
- Student overview loads Biology, English, and Math
- Student chart loads
- Student attendance page shows missed days
- Student can submit an excuse
- Blank excuse shows an error message
- Logout works

### Teacher Side

- Log in as teacher
- Teacher redirects to teacher overview
- Teacher cannot access student pages
- Teacher can switch classes
- Teacher overview loads student data
- Teacher chart loads
- Teacher can mark student present or absent
- Submit attendance saves to MySQL
- Returning to Mark Attendance remembers the saved status
- Teacher history loads previous dates
- Teacher can edit previous attendance records
- Saving history updates attendance summary
- Logout works

---

## 17. Registration Note

This project does not include public registration.

In a real attendance system, students and teachers should not create their own accounts freely. Accounts and enrollments should be controlled by an administrator or school office.

Future improvement:

- Add an admin dashboard
- Admin creates student accounts
- Admin creates teacher accounts
- Admin creates classes
- Admin enrolls students into classes
- Admin assigns teachers to classes
(only if you want to continue this project)

---

## 18. Common Problems and Fixes

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

### Recharts dependency error

Inside the `client` folder, run:

```powershell
npm install recharts react-is
Remove-Item -Recurse -Force "node_modules\.vite"
npm start -- --force
```

---

## 19. Current Project Status

Connected core features:

- Login
- Student overview
- Student absences
- Student excuse submission
- Teacher overview
- Teacher mark attendance
- Teacher attendance history
- Edit previous attendance
- Attendance summary updates

Not included yet:

- Public registration
- Admin dashboard
- JWT persistent login
- Excuse approval/rejection
- PDF reports
- Email notifications

---

## 20. Future Improvements

Possible improvements:

- Admin dashboard
- Admin-controlled registration
- Teacher approval or rejection of excuses
- Email notifications
- JWT authentication
- Persistent login after refresh
- More students and teachers
- More analytics and reports
- Export attendance reports as PDF
