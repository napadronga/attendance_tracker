import { useEffect, useState } from "react";
import { apiRequest } from "../api";

async function fetchClasses(studentId) {
  return apiRequest(`/api/student/classes?studentId=${studentId}`);
}

async function fetchAbsences(studentId, classId) {
  return apiRequest(
    `/api/student/classes/${classId}/absences?studentId=${studentId}`
  );
}

async function submitExcuse(attendanceId, reason) {
  return apiRequest(`/api/student/absences/${attendanceId}/excuse`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

function StudentAttendance({ user }) {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [absences, setAbsences] = useState([]);

  const [excuseId, setExcuseId] = useState(null);
  const [excuse, setExcuse] = useState("");

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingAbsences, setLoadingAbsences] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadAbsencesForActiveClass() {
    if (!activeClass || !user?.id) return;

    const data = await fetchAbsences(user.id, activeClass.id);
    setAbsences(data);
  }

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
        setError(err.message || "Could not load classes.");
      } finally {
        setLoadingClasses(false);
      }
    }

    if (user?.id) {
      loadClasses();
    }
  }, [user?.id]);

  useEffect(() => {
    async function loadAbsences() {
      if (!activeClass || !user?.id) return;

      try {
        setLoadingAbsences(true);
        setError("");
        setSuccess("");
        setExcuseId(null);
        setExcuse("");

        const data = await fetchAbsences(user.id, activeClass.id);
        setAbsences(data);
      } catch (err) {
        setError(err.message || "Could not load absences.");
      } finally {
        setLoadingAbsences(false);
      }
    }

    loadAbsences();
  }, [user?.id, activeClass]);

  function openExcuseForm(absenceId) {
    setExcuseId(absenceId);
    setExcuse("");
    setError("");
    setSuccess("");
  }

  function closeExcuseForm() {
    setExcuseId(null);
    setExcuse("");
    setError("");
  }

  async function handleExcuseSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!excuse.trim()) {
      setError("Please enter an excuse before submitting.");
      return;
    }

    if (excuse.trim().length < 5) {
      setError("Excuse must be at least 5 characters long.");
      return;
    }

    try {
      setSubmitting(true);

      await submitExcuse(excuseId, excuse.trim());

      setExcuseId(null);
      setExcuse("");
      setSuccess("Excuse submitted successfully.");
      await loadAbsencesForActiveClass();
    } catch (err) {
      setError(err.message || "Failed to submit excuse. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingClasses) {
    return (
      <main className="page">
        <p>Loading classes...</p>
      </main>
    );
  }

  if (!activeClass) {
    return (
      <main className="page">
        <h2>Your Absences</h2>
        <p className="emptyState">No classes found.</p>
      </main>
    );
  }

  return (
    <main className="page">
      <h2>Your Absences</h2>
      <h3>View your absences for each class.</h3>

      <div>
        {classes.map((c) => (
          <button
            key={c.id}
            type="button"
            className={activeClass.id === c.id ? "classTab active" : "classTab"}
            onClick={() => setActiveClass(c)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {error && <p className="errorMessage">{error}</p>}
      {success && <p className="successMessage">{success}</p>}

      {loadingAbsences ? (
        <p>Loading absences...</p>
      ) : absences.length === 0 ? (
        <p className="emptyState">No absences found for {activeClass.name}.</p>
      ) : (
        <div className="tableWrapper">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
                <th>Excuse Status</th>
                <th>Reason</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {absences.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.date).toLocaleDateString()}</td>

                  <td>
                    <span className={`statusBadge ${a.status}`}>
                      {a.status}
                    </span>
                  </td>

                  <td>
                    {a.excuseStatus ? (
                      <span className={`statusBadge ${a.excuseStatus}`}>
                        {a.excuseStatus}
                      </span>
                    ) : (
                      <span className="statusBadge notSubmitted">
                        Not submitted
                      </span>
                    )}
                  </td>

                  <td>{a.reason || "No excuse submitted"}</td>

                  <td>
                    {a.excuseStatus ? (
                      <button type="button" disabled>
                        Submitted
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openExcuseForm(a.id)}
                      >
                        Add Excuse
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {excuseId && (
        <div className="excuseForm">
          <h3>Add Excuse</h3>

          <form onSubmit={handleExcuseSubmit}>
            <label>Excuse</label>

            <textarea
              placeholder="Enter your excuse here"
              value={excuse}
              onChange={(e) => setExcuse(e.target.value)}
            />

            <div>
              <button type="button" onClick={closeExcuseForm}>
                Cancel
              </button>

              <button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

export default StudentAttendance;
