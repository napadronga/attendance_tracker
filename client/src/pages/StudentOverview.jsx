import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { apiRequest } from "../api";

async function fetchClasses(studentId) {
  return apiRequest(`/api/student/classes?studentId=${studentId}`);
}

function StudentOverview({ user }) {
  const [classes, setClasses] = useState([]);
  const [activeClass, setActiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchClasses(user.id);

        setClasses(data);

        if (data.length > 0) {
          setActiveClass(data[0]);
        }
      } catch (err) {
        setError(err.message || "Could not load student classes.");
      } finally {
        setLoading(false);
      }
    }

    if (user?.id) {
      loadClasses();
    }
  }, [user?.id]);

  if (loading) {
    return (
      <main className="page">
        <p>Loading classes...</p>
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
        <h2>Attendance</h2>
        <p className="emptyState">No classes found.</p>
      </main>
    );
  }

  const attended = Number(activeClass.attended) || 0;
  const total = Number(activeClass.total) || 0;
  const minAtt = Number(activeClass.minAtt) || 0;

  const absences = total - attended;

  const attendancePct = total > 0 ? (attended / total) * 100 : 0;

  const isBelowMinimum = attendancePct < minAtt;

  const chartData = [
    { name: "Attended", value: attended },
    { name: "Absences", value: absences },
  ];

  const chartColors = ["#15803d", "#b91c1c"];

  return (
    <main className="page">
      <h2>Attendance</h2>
      <h3>Overview of your classes</h3>

      {classes.length === 0 ? (
        <p className="emptyState">No classes found.</p>
      ) : (
        <>
          <div className="classTabs">
            {classes.map((c) => (
              <button
                key={c.id}
                type="button"
                className={
                  activeClass.id === c.id ? "classTab active" : "classTab"
                }
                onClick={() => setActiveClass(c)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {isBelowMinimum ? (
            <p className="errorMessage">
              Warning: Your attendance in {activeClass.name} is below the
              minimum required attendance.
            </p>
          ) : (
            <p className="successMessage">
              Good standing: Your attendance in {activeClass.name} meets the
              minimum requirement.
            </p>
          )}

          <div className="classStats">
            <div>
              <h3>Attendance Rate</h3>
              <h2>{attendancePct.toFixed(1)}%</h2>
            </div>

            <div>
              <h3>Classes Attended</h3>
              <h2>
                {attended} / {total}
              </h2>
            </div>

            <div>
              <h3>Total Absences</h3>
              <h2>{absences}</h2>
            </div>

            <div>
              <h3>Min Attendance</h3>
              <h2>{minAtt}%</h2>
            </div>
          </div>

          <div className="chartCard">
            <h3>Attendance Breakdown</h3>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="chartLegend">
              <span>
                <span className="legendDot attendedDot"></span>
                Attended
              </span>

              <span>
                <span className="legendDot absentDot"></span>
                Absences
              </span>
            </div>
          </div>
        </>
      )}
    </main>
  );
}

export default StudentOverview;
