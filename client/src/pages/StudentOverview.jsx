import { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";


const CLASSES = [
  { id: 1, name: "Biology", attended: 17, total: 20, minAtt: 75 },
  { id: 2, name: "English", attended: 14, total: 20, minAtt: 75 },
  { id: 3, name: "Math", attended: 18, total: 20, minAtt: 80 },
];

async function fetchClasses(studentId) {
  // FINISH THIS, /api/student/classes?studentId={studentId}
  // Return [{id, name, attended, total, minAtt}]
  return [];
}

function StudentOverview() {
  const [activeClass, setActiveClass] = useState(CLASSES[0]);

  const absences = activeClass.total - activeClass.attended;

  const attendancePct =
    activeClass.total > 0
      ? (activeClass.attended / activeClass.total) * 100
      : 0;

  const isBelowMinimum = attendancePct < activeClass.minAtt;

  const chartData = [
    { name: "Attended", value: activeClass.attended },
    { name: "Absences", value: absences },
  ];

  const chartColors = ["#15803d", "#b91c1c"];


  return (
    <main className="page">
      <h2>Attendance</h2>
      <h3>Overview of your classes</h3>
      
      {CLASSES.length === 0 ? (
        <p className="emptyState">No classes found.</p>
        ) : (
      <>
        <div>
          {CLASSES.map((c) => (
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
            Warning: Your attendance in {activeClass.name} is below the minimum
            required attendance.
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
            <h2>{activeClass.attended} / {activeClass.total}</h2>
          </div>

          <div>
            <h3>Total Absences</h3>
            <h2>{absences}</h2>
          </div>

          <div>
            <h3>Min Attendance</h3>
            <h2>{activeClass.minAtt}%</h2>
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
