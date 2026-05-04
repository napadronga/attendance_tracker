import { useState } from 'react';

const CLASSES = ['Biology', 'English', 'Math'];
const PAST_CLASSES = [
    {date: '01-23-2026', present: 15, absent: 5},
    {date: '01-27-2026', present: 10, absent: 10},
    {date: '01-29-2026', present: 17, absent: 3}
];
const STUDENTS = [
    {name: 'Todd', attendance: 35, absences: 15},
    {name: 'Jake', attendance: 68, absences: 7},
    {name: 'Po', attendance: 89, absences: 3}
];
function TeacherHistory({ user }) {
    const [selectedClass, setSelectedClass] = useState(CLASSES[0]);

    return (
        <div>
            <h2>Attendance History</h2>
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <h3>Past Classes</h3>
            <ul>
                {PAST_CLASSES.map((entry, i) => (
                    <li key={i}>{entry.date} — Present: {entry.present}, Absent: {entry.absent}</li>
                ))}
            </ul>
            <h3>Students</h3>
            <ul>
                {STUDENTS.map((s, i) => (
                    <li key={i}>{s.name} — Attendance: {s.attendance}%, Absences: {s.absences}</li>
                ))}
            </ul>
        </div>
    );
}

export default TeacherHistory;