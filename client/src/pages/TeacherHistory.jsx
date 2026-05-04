import { useState } from 'react';

const CLASSES = ['Biology', 'English', 'Math'];
const STUDENTS = [
    {id: 1, name: 'Todd', attendancePct: 35, absences: 15, status: true},
    {id: 2, name: 'Jake', attendancePct: 68, absences: 7, status: true},
    {id: 3, name: 'Po', attendancePct: 89, absences: 3, status: true}
];
const PAST_CLASSES = [
    {date: '01-23-2026', present: 15, absent: 5},
    {date: '01-27-2026', present: 10, absent: 10},
    {date: '01-29-2026', present: 17, absent: 3}
];

async function fetchHistory(classId){
    // FINISH THIS, /api/teacher/classes/{classId}/history
    // Return [{date, present, absent, total}]
    return [];
}

async function fetchSessionDetail(classId, date){
    // FINISH THIS, /api/teacher/classes/{classId}/history/{date}
    // Return [{id, name, status}]
    return[];
}

async function saveSession(classId, date, records){
    // FINISH THIS, /api/teacher/classes/{classId}/history/{date}
    // Body {records: [{studentId, status}]}
    // Return true on success
    return true;
}

function TeacherHistory(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);
    const [edit, setEdit] = useState(null);
    const [students, setStudents] = useState(STUDENTS);

    function toggle(id){
        setStudents(students.map(s => {
            if(s.id === id){
                return {...s, status: !s.status};
            }
            return s;
        }))
    }

    async function handleSave(){
        const records = students.map(s => ({
            studentId: s.id,
            status: s.status ? 'present' : 'absent'
        }));
        await saveSession(activeClass, edit.date, records);
        setEdit(null);
    }

    return (
        <div>
            <h2>Class History</h2>

            <div>
                {CLASSES.map(c => (
                    <button key={c} onClick={() => setActiveClass(c)}>{c}</button>
                ))}
            </div>

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
                    {PAST_CLASSES.map((d, index) => (
                        <tr key={index}>
                            <td>{d.date}</td>
                            <td>{d.present}</td>
                            <td>{d.absent}</td>
                            <td>{(d.present / ((d.present + d.absent)) * 100).toFixed(1)}%</td>
                            <td><button onClick={() => setEdit(d)}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {edit && (
                <div className="editHistory">
                    <h3>Edit {edit.date}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Presence</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, index) => (
                                <tr key={index}>
                                    <td>{s.name}</td>
                                    <td>{s.status ? 'Present' : 'Absent'}</td>
                                    <td>
                                        <button type="button" onClick={() => toggle(s.id)}>
                                            {s.status ? 'Present' : 'Absent'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <button onClick={() => setEdit(null)}>Cancel</button>
                        <button onClick={handleSave}>Save</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default TeacherHistory;