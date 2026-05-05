import { useEffect, useState } from "react";
import { apiRequest } from "../api";

async function fetchUsers() {
  return apiRequest("/api/admin/users");
}

async function fetchClasses() {
  return apiRequest("/api/admin/classes");
}

async function createUser(form) {
  return apiRequest("/api/admin/users", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

async function createClass(form) {
  return apiRequest("/api/admin/classes", {
    method: "POST",
    body: JSON.stringify(form),
  });
}

async function enrollStudent(studentId, classId) {
  return apiRequest("/api/admin/enrollments", {
    method: "POST",
    body: JSON.stringify({ studentId, classId }),
  });
}

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [userForm, setUserForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "password123",
    role: "student",
  });

  const [classForm, setClassForm] = useState({
    name: "",
    teacherId: "",
    minAttendance: 75,
  });

  const [enrollmentForm, setEnrollmentForm] = useState({
    studentId: "",
    classId: "",
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const students = users.filter((u) => u.role === "student");
  const teachers = users.filter((u) => u.role === "teacher");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [userData, classData] = await Promise.all([
        fetchUsers(),
        fetchClasses(),
      ]);

      setUsers(userData);
      setClasses(classData);
    } catch (err) {
      setError(err.message || "Could not load admin data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function updateUserForm(field, value) {
    setUserForm((current) => ({ ...current, [field]: value }));
  }

  function updateClassForm(field, value) {
    setClassForm((current) => ({ ...current, [field]: value }));
  }

  function updateEnrollmentForm(field, value) {
    setEnrollmentForm((current) => ({ ...current, [field]: value }));
  }

  async function handleCreateUser(e) {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await createUser(userForm);

      setSuccess("User created successfully.");

      setUserForm({
        firstName: "",
        lastName: "",
        email: "",
        password: "password123",
        role: "student",
      });

      await loadData();
    } catch (err) {
      setError(err.message || "Could not create user.");
    }
  }

  async function handleCreateClass(e) {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await createClass({
        name: classForm.name,
        teacherId: Number(classForm.teacherId),
        minAttendance: Number(classForm.minAttendance),
      });

      setSuccess("Class created successfully.");

      setClassForm({
        name: "",
        teacherId: "",
        minAttendance: 75,
      });

      await loadData();
    } catch (err) {
      setError(err.message || "Could not create class.");
    }
  }

  async function handleEnrollStudent(e) {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      await enrollStudent(
        Number(enrollmentForm.studentId),
        Number(enrollmentForm.classId)
      );

      setSuccess("Student enrolled successfully.");

      setEnrollmentForm({
        studentId: "",
        classId: "",
      });
    } catch (err) {
      setError(err.message || "Could not enroll student.");
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p>Loading admin dashboard...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h2>Admin Dashboard</h2>
      <h3>Create users, create classes, and enroll students.</h3>

      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}

      <div className="classStats">
        <div>
          <h3>Total Users</h3>
          <h2>{users.length}</h2>
        </div>

        <div>
          <h3>Students</h3>
          <h2>{students.length}</h2>
        </div>

        <div>
          <h3>Teachers</h3>
          <h2>{teachers.length}</h2>
        </div>

        <div>
          <h3>Classes</h3>
          <h2>{classes.length}</h2>
        </div>
      </div>

      <section className="studentTable">
        <h2>Create User</h2>

        <form onSubmit={handleCreateUser}>
          <div className="loginForm">
            <label>First Name</label>
            <input
              value={userForm.firstName}
              onChange={(e) => updateUserForm("firstName", e.target.value)}
            />
          </div>

          <div className="loginForm">
            <label>Last Name</label>
            <input
              value={userForm.lastName}
              onChange={(e) => updateUserForm("lastName", e.target.value)}
            />
          </div>

          <div className="loginForm">
            <label>Email</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => updateUserForm("email", e.target.value)}
            />
          </div>

          <div className="loginForm">
            <label>Password</label>
            <input
              type="text"
              value={userForm.password}
              onChange={(e) => updateUserForm("password", e.target.value)}
            />
          </div>

          <div className="loginForm">
            <label>Role</label>
            <select
              value={userForm.role}
              onChange={(e) => updateUserForm("role", e.target.value)}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="submitButton">
            Create User
          </button>
        </form>
      </section>

      <section className="studentTable">
        <h2>Create Class</h2>

        <form onSubmit={handleCreateClass}>
          <div className="loginForm">
            <label>Class Name</label>
            <input
              value={classForm.name}
              onChange={(e) => updateClassForm("name", e.target.value)}
              placeholder="Example: Biology"
            />
          </div>

          <div className="loginForm">
            <label>Teacher</label>
            <select
              value={classForm.teacherId}
              onChange={(e) => updateClassForm("teacherId", e.target.value)}
            >
              <option value="">Select teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.firstName} {teacher.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="loginForm">
            <label>Minimum Attendance %</label>
            <input
              type="number"
              value={classForm.minAttendance}
              onChange={(e) =>
                updateClassForm("minAttendance", e.target.value)
              }
            />
          </div>

          <button type="submit" className="submitButton">
            Create Class
          </button>
        </form>
      </section>

      <section className="studentTable">
        <h2>Enroll Student</h2>

        <form onSubmit={handleEnrollStudent}>
          <div className="loginForm">
            <label>Student</label>
            <select
              value={enrollmentForm.studentId}
              onChange={(e) =>
                updateEnrollmentForm("studentId", e.target.value)
              }
            >
              <option value="">Select student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          <div className="loginForm">
            <label>Class</label>
            <select
              value={enrollmentForm.classId}
              onChange={(e) => updateEnrollmentForm("classId", e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submitButton">
            Enroll Student
          </button>
        </form>
      </section>

      <section className="studentTable">
        <h2>Users</h2>

        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.firstName} {u.lastName}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`statusBadge ${u.role}`}>{u.role}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default AdminDashboard;