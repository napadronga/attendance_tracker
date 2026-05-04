import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { apiRequest } from "../api";

async function fetchClasses(teacherId) {
  return apiRequest(`/api/teacher/classes?teacherId=${teacherId}`);
}

async function fetchStudents(classId) {
  return apiRequest(`/api/teacher/classes/${classId}/students`);
}

function TeacherOverview({ user }) {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [students, setStudents] = useState([]);

  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
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
        setError("");

        const data = await fetchStudents(activeClass.id);

        setStudents(data);
      } catch (err) {
        setError(err.message || "Could not load students.");
      } finally {
        setLoadingStudents(false);
      }
    }

    loadStudents();
  }, [activeClass]);

  if (loadingClasses) {
    return (
      <main className="page">
        <p>Loading teacher classes...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <p className="errorMessage">{error}</p>
      </main>
    );
  }

  if (!activeClass) {
    return (
      <main className="page">
        <h2>Class Overview</h2>
        <p className="emptyState">No classes found.</p>
      </main>
    );
  }

  const totalStudents = students.length;

  const avgAttendance =
    totalStudents > 0
      ? students.reduce((sum, student) => {
          return sum + Number(student.attendancePct);
        }, 0) / totalStudents
      : 0;

  const lowAttendanceStudents = students.filter(
    (student) => Number(student.attendancePct) < 75
  );

  const excellentCount = students.filter(
    (student) => Number(student.attendancePct) >= 90
  ).length;

  const goodCount = students.filter(
    (student) =>
      Number(student.attendancePct) >= 75 && Number(student.attendancePct) < 90
  ).length;

  const warningCount = students.filter(
    (student) =>
      Number(student.attendancePct) >= 60 && Number(student.attendancePct) < 75
  ).length;

  const criticalCount = students.filter(
    (student) => Number(student.attendancePct) < 60
  ).length;

  const distributionData = [
    { name: "Excellent 90-100%", value: excellentCount, color: "#15803d" },
    { name: "Good 75-89%", value: goodCount, color: "#2563eb" },
    { name: "Warning 60-74%", value: warningCount, color: "#ca8a04" },
    { name: "Critical Below 60%", value: criticalCount, color: "#b91c1c" },
  ].filter((item) => item.value > 0);

  function handleClassChange(c) {
    setActiveClass(c);
  }

  return (
    <main className="page">
      <h2>Class Overview</h2>
      <h3>Attendance for your classes</h3>

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

      {loadingStudents ? (
        <p>Loading students...</p>
      ) : (
        <>
          {students.length === 0 ? (
            <p className="emptyState">
              No students found for {activeClass.name}.
            </p>
          ) : lowAttendanceStudents.length > 0 ? (
            <p className="errorMessage">
              {lowAttendanceStudents.length} student
              {lowAttendanceStudents.length > 1 ? "s are" : " is"} below 75%
              attendance in {activeClass.name}.
            </p>
          ) : (
            <p className="successMessage">
              All students in {activeClass.name} are at or above 75% attendance.
            </p>
          )}

          <div className="classStats">
            <div className="avgAttendance">
              <h3>Average Attendance</h3>
              <h2>{avgAttendance.toFixed(1)}%</h2>
            </div>

            <div className="totalStudents">
              <h3>Total Students</h3>
              <h2>{totalStudents}</h2>
            </div>
          </div>

          {students.length > 0 && (
            <div className="chartCard">
              <h3>Class Attendance Distribution</h3>

              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={distributionData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={95}
                    label
                  >
                    {distributionData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="chartLegend">
                <span>
                  <span className="legendDot excellentDot"></span>
                  Excellent
                </span>

                <span>
                  <span className="legendDot goodDot"></span>
                  Good
                </span>

                <span>
                  <span className="legendDot warningDot"></span>
                  Warning
                </span>

                <span>
                  <span className="legendDot criticalDot"></span>
                  Critical
                </span>
              </div>
            </div>
          )}

          <div className="students">
            <h2>Students</h2>

            {students.length === 0 ? (
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
                      <th>Attendance</th>
                      <th>Absences</th>
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                        <td>{Number(s.attendancePct).toFixed(1)}%</td>
                        <td>{s.absences}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default TeacherOverview;
