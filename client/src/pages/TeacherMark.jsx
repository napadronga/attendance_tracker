import { useEffect, useState } from "react";
import { apiRequest } from "../api";

async function fetchClasses(teacherId) {
  // FINISH THIS, /api/teacher/classes/{classId}/students
  // Return [{id, firstName, lastName, email}]
  return apiRequest(`/api/teacher/classes?teacherId=${teacherId}`);
}

async function fetchStudents(classId) {
  return apiRequest(`/api/teacher/classes/${classId}/students`);
}

async function fetchAttendance(classId, date) {
  return apiRequest(`/api/teacher/classes/${classId}/attendance?date=${date}`);
}

async function submitAttendance(classId, date, teacherId, records) {
  // FINISH THIS, /api/teacher/classes/{classId}/attendance
  // Body {date, records: [{studentId, status}]}
  // return true or false on success
  return apiRequest(`/api/teacher/classes/${classId}/attendance`, {
    method: "POST",
    body: JSON.stringify({
      date,
      teacherId,
      records,
    }),
  });
}

function TeacherMark({ user }) {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [students, setStudents] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoadingClasses(true);
        setError("");

        const data = await fetchClasses(user.id);

        setClasses(data);

        if (data.length > 0) {
          setActiveClass(data[0]);
        }
      } catch (err) {
        setError(err.message || "Could not load teacher classes.");
      } finally {
        setLoadingClasses(false);
      }
    }

    if (user?.id) {
      loadClasses();
    }
  }, [user?.id]);

  useEffect(() => {
    async function loadStudents() {
      if (!activeClass) return;

      try {
        setLoadingStudents(true);
        setSuccess("");
        setError("");

        const today = new Date().toISOString().split("T")[0];

        const studentData = await fetchStudents(activeClass.id);
        const attendanceData = await fetchAttendance(activeClass.id, today);

        const attendanceMap = {};

        attendanceData.forEach((record) => {
          attendanceMap[record.studentId] = record.status;
        });

        const studentsWithStatus = studentData.map((student) => ({
          ...student,
          status: attendanceMap[student.id] === "absent" ? false : true,
        }));

        setStudents(studentsWithStatus);
      } catch (err) {
        setError(err.message || "Could not load students.");
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudents();
  }, [activeClass]);

  function handleClassChange(c) {
    setActiveClass(c);
    setSuccess("");
    setError("");
  }

  function toggle(id) {
    setStudents((currentStudents) =>
      currentStudents.map((s) => {
        if (s.id === id) {
          return { ...s, status: !s.status };
        }

        return s;
      })
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!activeClass) {
      setError("No class selected.");
      return;
    }

    if (students.length === 0) {
      setError(`No students found for ${activeClass.name}.`);
      return;
    }

    try {
      setSubmitting(true);

      const date = new Date().toISOString().split("T")[0];

      const records = students.map((s) => ({
        studentId: s.id,
        status: s.status ? "present" : "absent",
      }));

      await submitAttendance(activeClass.id, date, user.id, records);

      setSuccess(`Attendance submitted for ${activeClass.name} on ${date}.`);
    } catch (err) {
      setError(err.message || "Failed to submit attendance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const present = students.filter((s) => s.status).length;
  const absent = students.length - present;

  if (loadingClasses) {
    return (
      <main className="page">
        <p>Loading teacher classes...</p>
      </main>
    );
  }

  if (!activeClass) {
    return (
      <main className="page">
        <h2>Mark Attendance</h2>
        <p className="emptyState">No classes found.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h2>Mark Attendance</h2>
      <h3>Today: {new Date().toLocaleDateString()}</h3>

      <div>
        {classes.map((c) => (
          <button
            key={c.id}
            type="button"
            className={activeClass.id === c.id ? "classTab active" : "classTab"}
            onClick={() => handleClassChange(c)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}

      <div className="presentCount">
        <div>
          <h3>Present</h3>
          <h2>{present}</h2>
        </div>

        <div>
          <h3>Absent</h3>
          <h2>{absent}</h2>
        </div>
      </div>

      <div className="studentTable">
        <form onSubmit={handleSubmit}>
          {loadingStudents ? (
            <p>Loading students...</p>
          ) : students.length === 0 ? (
            <p className="emptyState">
              No students found for {activeClass.name}.
            </p>
          ) : (
            <div className="tableWrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Presence</th>
                    <th>Change</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((s) => (
                    <tr key={s.id}>
                      <td>{s.name}</td>
                      <td>{s.email}</td>
                      <td>{s.status ? "Present" : "Absent"}</td>
                      <td>
                        <button type="button" onClick={() => toggle(s.id)}>
                          Mark {s.status ? "Absent" : "Present"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <button
            type="submit"
            className="submitButton"
            disabled={submitting || loadingStudents || students.length === 0}
          >
            {submitting ? "Submitting..." : "Submit Attendance"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default TeacherMark;
