import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CLASSES = [
  {
    id: 1,
    name: "Biology",
    students: [
      { id: 1, name: "Todd", attendancePct: 35, absences: 15 },
      { id: 2, name: "Jake", attendancePct: 68, absences: 7 },
    ],
  },
  {
    id: 2,
    name: "English",
    students: [
      { id: 1, name: "Po", attendancePct: 89, absences: 3 },
      { id: 2, name: "Sarah", attendancePct: 92, absences: 2 },
    ],
  },
  {
    id: 3,
    name: "Math",
    students: [
      { id: 1, name: "Mick", attendancePct: 45, absences: 13 },
      { id: 2, name: "Alex", attendancePct: 78, absences: 5 },
      { id: 3, name: "Noah", attendancePct: 26, absences: 11 },
      { id: 4, name: "Dandy", attendancePct: 94, absences: 6 },
    ],
  },
];
const STUDENTS = [
  {
    id: 1,
    name: "Todd",
    attendancePct: 35,
    absences: 15,
    email: "Todd@email.com",
  },
  {
    id: 2,
    name: "Jake",
    attendancePct: 68,
    absences: 7,
    email: "Jake@email.com",
  },
  { id: 3, name: "Po", attendancePct: 89, absences: 3, email: "Po@email.com" },
];

async function fetchClasses(teacherId) {
  // FINISH THIS, /api/teacher/classes?teacherId={teacherId}
  // Return classes
  return [];
}

async function fetchOverview(classId) {
  // FINISH THIS, /api/teacher/classes/{classId}/overview
  // Return {totalStudents, students: [{id, name, attendancePct, absences}]
  return [];
}

function TeacherOverview() {
  const [activeClass, setActiveClass] = useState(CLASSES[0]);

  // Fetch data here from backend, use fetch functinos add useEffect here for some aysnc function

  // Find avg attendance of class, loop through all students and add their att
  const totalStudents = activeClass.students.length;

  const avgAttendance =
    totalStudents > 0
      ? activeClass.students.reduce((sum, student) => {
          return sum + student.attendancePct;
        }, 0) / totalStudents
      : 0;

  const lowAttendanceStudents = activeClass.students.filter(
    (student) => student.attendancePct < 75
  );

  const excellentCount = activeClass.students.filter(
    (student) => student.attendancePct >= 90
  ).length;

  const goodCount = activeClass.students.filter(
    (student) => student.attendancePct >= 75 && student.attendancePct < 90
  ).length;

  const warningCount = activeClass.students.filter(
    (student) => student.attendancePct >= 60 && student.attendancePct < 75
  ).length;

  const criticalCount = activeClass.students.filter(
    (student) => student.attendancePct < 60
  ).length;

  const distributionData = [
    { name: "Excellent 90-100%", value: excellentCount },
    { name: "Good 75-89%", value: goodCount },
    { name: "Warning 60-74%", value: warningCount },
    { name: "Critical Below 60%", value: criticalCount },
  ].filter((item) => item.value > 0);

  const distributionColors = ["#15803d", "#2563eb", "#ca8a04", "#b91c1c"];

  function handleClassChange(c) {
    setActiveClass(c);
  }

  return (
    <main className="page">
      <h2>Class Overview</h2>
      <h3>Attendance for your classes</h3>

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
                onClick={() => handleClassChange(c)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {lowAttendanceStudents.length > 0 ? (
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
                  {distributionData.map((entry, index) => (
                    <Cell key={entry.name} fill={distributionColors[index]} />
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

          <div className="students">
            <h2>Students</h2>

            {activeClass.students.length === 0 ? (
              <p className="emptyState">
                No students found for {activeClass.name}.
              </p>
            ) : (
              <div className="tableWrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Students</th>
                      <th>Attendance</th>
                      <th>Absences</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeClass.students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.attendancePct}%</td>
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
