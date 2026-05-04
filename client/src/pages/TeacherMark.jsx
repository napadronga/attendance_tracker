import { useState } from "react";

const CLASSES = [
  { id: 1, name: "Biology" },
  { id: 2, name: "English" },
  { id: 3, name: "Math" },
];

const STUDENTS = [
  {
    id: 1,
    classId: 1,
    name: "Todd",
    attendance: 35,
    absences: 15,
    email: "Todd@email.com",
    status: true,
  },
  {
    id: 2,
    classId: 1,
    name: "Jake",
    attendance: 68,
    absences: 7,
    email: "Jake@email.com",
    status: true,
  },
  {
    id: 3,
    classId: 2,
    name: "Po",
    attendance: 89,
    absences: 3,
    email: "Po@email.com",
    status: true,
  },
];

async function fetchStudents(classId) {
  // FINISH THIS, /api/teacher/classes/{classId}/students
  // Return [{id, firstName, lastName, email}]
  return [];
}

async function submitAttendance(classId, date, records) {
  // FINISH THIS, /api/teacher/classes/{classId}/attendance
  // Body {date, records: [{studentId, status}]}
  // return true or false on success

  console.log("Submitting attendance:", {
    classId,
    date,
    records,
  });

  return true;
}

function TeacherMark() {
  const [activeClass, setActiveClass] = useState(CLASSES[0]);
  const [students, setStudents] = useState(STUDENTS);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const filteredStudents = students.filter(
    (student) => student.classId === activeClass.id
  );

  const present = filteredStudents.filter((s) => s.status).length;
  const absent = filteredStudents.length - present;

  function handleClassChange(c) {
    setActiveClass(c);
    setSuccess("");
    setError("");
  }

  // Check for id from button and toggle it between absent or present
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
    // Grab the date (YYYY-MM-DDHH:mm:ss:sssZ), cut off the second half and keep just the year,month,day
    setSuccess("");
    setError("");

    if (filteredStudents.length === 0) {
      setError(`No students found for ${activeClass.name}.`)
      return;
    }
    try {
      setLoading(true);

      let date = new Date().toISOString();
      date = date.split("T")[0];
      const records = filteredStudents.map((s) => ({
        studentId: s.id,
        status: s.status ? "present" : "absent",
      }));
      await submitAttendance(activeClass.id, date, records);

      setSuccess(`Attendance submitted for ${activeClass.name} on ${date}.`);
    } catch (err) {
      setError("Failed to submit attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <h2>Mark Attendance</h2>
      <h3>Today: {new Date().toLocaleDateString()}</h3>

      <div>
        {CLASSES.map((c) => (
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
          {filteredStudents.length === 0 ? (
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
                  {filteredStudents.map((s) => (
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
            disabled={loading || filteredStudents.length === 0}
          >
            {loading ? "Submitting..." : "Submit Attendance"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default TeacherMark;
