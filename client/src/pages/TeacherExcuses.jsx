import { useEffect, useState } from "react";
import { apiRequest } from "../api";

async function fetchExcuses(teacherId) {
  return apiRequest(`/api/teacher/excuses?teacherId=${teacherId}`);
}

async function updateExcuse(excuseId, status, teacherId) {
  return apiRequest(`/api/teacher/excuses/${excuseId}`, {
    method: "PUT",
    body: JSON.stringify({
      status,
      teacherId,
    }),
  });
}

function TeacherExcuses({ user }) {
  const [excuses, setExcuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadExcuses() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchExcuses(user.id);
      setExcuses(data);
    } catch (err) {
      setError(err.message || "Could not load excuses.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.id) {
      loadExcuses();
    }
  }, [user?.id]);

  async function handleUpdate(excuseId, status) {
    try {
      setUpdatingId(excuseId);
      setError("");
      setSuccess("");

      await updateExcuse(excuseId, status, user.id);
      setSuccess(`Excuse ${status} successfully.`);

      await loadExcuses();
    } catch (err) {
      setError(err.message || "Could not update excuse.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <p>Loading excuses...</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h2>Student Excuses</h2>
      <h3>Review absence excuses submitted by students.</h3>

      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}

      {excuses.length === 0 ? (
        <p className="emptyState">No excuses submitted yet.</p>
      ) : (
        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Absence Date</th>
                <th>Attendance Status</th>
                <th>Reason</th>
                <th>Excuse Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {excuses.map((excuse) => (
                <tr key={excuse.id}>
                  <td>
                    {excuse.studentName}
                    <br />
                    <small>{excuse.studentEmail}</small>
                  </td>

                  <td>{excuse.className}</td>

                  <td>{new Date(excuse.absenceDate).toLocaleDateString()}</td>

                  <td>
                    <span className={`statusBadge ${excuse.attendanceStatus}`}>
                      {excuse.attendanceStatus}
                    </span>
                  </td>

                  <td>{excuse.reason}</td>

                  <td>
                    <span className={`statusBadge ${excuse.excuseStatus}`}>
                      {excuse.excuseStatus}
                    </span>
                  </td>

                  <td>{new Date(excuse.submittedAt).toLocaleString()}</td>

                  <td>
                    {excuse.excuseStatus === "pending" ? (
                      <>
                        <button
                          type="button"
                          disabled={updatingId === excuse.id}
                          onClick={() => handleUpdate(excuse.id, "approved")}
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          disabled={updatingId === excuse.id}
                          onClick={() => handleUpdate(excuse.id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span className={`statusBadge ${excuse.excuseStatus}`}>
                        {excuse.excuseStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default TeacherExcuses;
