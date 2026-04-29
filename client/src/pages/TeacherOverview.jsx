import { useState } from 'react';

const CLASSES = ['Biology', 'English', 'Math'];
const STUDENTS = [
    {id: 1, name: 'Todd', attendance: 35, absences: 15, email: "Todd@email.com", present: true},
    {id: 2, name: 'Jake', attendance: 68, absences: 7, email: "Jake@email.com", present: true},
    {id: 3, name: 'Po', attendance: 89, absences: 3, email: "Po@email.com", present: true}
];

// Need to finish fetching from database

function TeacherOverview(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);

    // Find avg attendance of class, loop through all students and add their att
    let total= 0;
    STUDENTS.forEach(s => {
        total += s.attendance;
    });
    const avgAttendance = (total / STUDENTS.length);
    
    // Fetch classes to make dynamic buttons
    // Also can update the displays to pull stats from db

    return(
        <div>
            <h2>Class Overview</h2>
            <h3>Attendance for your classes</h3>

            <div>
                {CLASSES.map(c => (
                    <button key={c} className="classTabs" onClick={() => setActiveClass(c)}>{c}</button>
                ))}
            </div>

            <div className="clasStats">
                <div className="avgAttendance">
                    <h3>Average Attendance</h3>
                    <h2>{avgAttendance}%</h2>
                </div>
                <div className="totalStudents">
                    <h3>Total Students</h3>
                    <h2>{STUDENTS.length}</h2>
                </div>
            </div>

            <div className="students">
                <h2>Students</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Students</th>
                            <th>Attendance</th>
                            <th>Absences</th>
                        </tr>
                    </thead>
                    <tbody>
                        {STUDENTS.map((s, index)  => (
                            <tr key={index}>
                                <td>{s.name}</td>
                                <td>{s.attendance}%</td>
                                <td>{s.absences}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default TeacherOverview;