import { useEffect, useState } from "react";
import { apiRequest } from "../api";

async function fetchClasses(teacherId) {
  return apiRequest(`/api/teacher/classes?teacherId=${teacherId}`);
}

async function fetchHistory(classId) {
  return apiRequest(`/api/teacher/classes/${classId}/history`);
}

async function fetchSessionDetail(classId, date) {
  return apiRequest(`/api/teacher/classes/${classId}/history/${date}`);
}

async function saveSession(classId, date, teacherId, records) {
  return apiRequest(`/api/teacher/classes/${classId}/history/${date}`, {
    method: "PUT",
    body: JSON.stringify({
      teacherId,
      records,
    }),
  });
}

function TeacherHistory({ user }) {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [history, setHistory] = useState([]);

  const [edit, setEdit] = useState(null);
  const [students, setStudents] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [saving, setSaving] = useState(false);

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
    async function loadHistory() {
      if (!activeClass) return;

      try {
        setLoadingHistory(true);
        setError("");
        setSuccess("");
        setEdit(null);
        setStudents([]);

        const data = await fetchHistory(activeClass.id);

        setHistory(data);
      } catch (err) {
        setError(err.message || "Could not load attendance history.");
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, [activeClass]);

  function handleClassChange(c) {
    setActiveClass(c);
    setEdit(null);
    setStudents([]);
    setSuccess("");
    setError("");
  }

  async function openEdit(session) {
    try {
      setLoadingSession(true);
      setError("");
      setSuccess("");

      const cleanDate = formatDateForApi(session.date);
      const data = await fetchSessionDetail(activeClass.id, cleanDate);

      const studentsWithStatus = data.map((student) => ({
        ...student,
        status: student.status === "present",
      }));

      setEdit({
        ...session,
        date: cleanDate,
      });

      setStudents(studentsWithStatus);
    } catch (err) {
      setError(err.message || "Could not load attendance session.");
    } finally {
      setLoadingSession(false);
    }
  }

  function cancelEdit() {
    setEdit(null);
    setStudents([]);
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

  function getAttendancePercent(session) {
    const present = Number(session.present) || 0;
    const total = Number(session.total) || 0;

    if (total === 0) {
      return "0.0";
    }

    return ((present / total) * 100).toFixed(1);
  }

  function formatDateForApi(dateValue) {
    return new Date(dateValue).toISOString().split("T")[0];
  }

  function formatDateForDisplay(dateValue) {
    return new Date(dateValue).toLocaleDateString();
  }

  async function handleSave() {
    setSuccess("");
    setError("");

    if (!edit) {
      setError("No history record selected.");
      return;
    }

    if (students.length === 0) {
      setError("No students found for this session.");
      return;
    }

    try {
      setSaving(true);

      const records = students.map((s) => ({
        studentId: s.id,
        status: s.status ? "present" : "absent",
      }));

      await saveSession(activeClass.id, edit.date, user.id, records);

      const updatedHistory = await fetchHistory(activeClass.id);
      setHistory(updatedHistory);

      setEdit(null);
      setStudents([]);
      setSuccess("Attendance history updated successfully.");
    } catch (err) {
      setError(err.message || "Could not save history changes.");
    } finally {
      setSaving(false);
    }
  }

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
        <h2>Class History</h2>
        <p className="emptyState">No classes found.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h2>Class History</h2>
      <h3>View and edit previous attendance records.</h3>

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

      {loadingHistory ? (
        <p>Loading attendance history...</p>
      ) : history.length === 0 ? (
        <p className="emptyState">
          No attendance history found for {activeClass.name}.
        </p>
      ) : (
        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Attendance</th>
                <th>Edit</th>
              </tr>
            </thead>

            <tbody>
              {history.map((session) => (
                <tr key={session.date}>
                  <td>{formatDateForDisplay(session.date)}</td>
                  <td>{session.present}</td>
                  <td>{session.absent}</td>
                  <td>{getAttendancePercent(session)}%</td>
                  <td>
                    <button type="button" onClick={() => openEdit(session)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {loadingSession && <p>Loading selected session...</p>}

      {edit && (
        <div className="editHistory">
          <h3>
            Edit {activeClass.name} - {formatDateForDisplay(edit.date)}
          </h3>

          {students.length === 0 ? (
            <p className="emptyState">No students found for this session.</p>
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

          <div className="formActions">
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>

            <button type="button" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default TeacherHistory;
