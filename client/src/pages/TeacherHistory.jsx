import { useState } from 'react';

const CLASSES = [
    {id: 1, name: 'Biology', 
        students: [
            {id: 1, name: 'Todd', email: 'Todd@email.com', attendancePct: 35, absences: 15},
            {id: 2, name: 'Jake', email: 'Jake@email.com', attendancePct: 68, absences: 7}
    ],
        history: [
                {date: '01-23-2026', present: 15, absent: 5},
                {date: '01-27-2026', present: 10, absent: 10}
    ]},
    {id: 2, name: 'English', 
        students: [
            {id: 1, name: 'Po', email: 'Po@email.com', attendancePct: 89, absences: 3},
            {id: 2, name: 'Sarah', email: 'Sarah@email.com', attendancePct: 92, absences: 2}
    ],
        history: [
            {date: '05-21-2026', present: 18, absent: 2},
            {date: '07-22-2026', present: 19, absent: 1}
    ]},
    {id: 3, name: 'Math', 
        students: [
            {id: 1, name: 'Mick', email: 'Mick@email.com', attendancePct: 45, absences: 13},
            {id: 2, name: 'Alex', email: 'Alex@email.com', attendancePct: 78, absences: 5}
    ],
        history: [
            {date: '02-5-2026', present: 5, absent: 15},
            {date: '03-2-2026', present: 11, absent: 9}
    ]}
]

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
    const [students, setStudents] = useState(CLASSES[0].students.map(s => ({...s, status: true})));

    function handleClassChange(c){
        setActiveClass(c);
        setStudents(c.students.map(s => ({...s, status:true})));
    }

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
                    <button key={c.id} className="classTabs" onClick={() => handleClassChange(c)}>{c.name}</button>
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
                    {activeClass.history.map((d, index) => (
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
                    <h3>Editing {edit.date}</h3>
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
                    <div className="editButtons">
                        <button onClick={() => setEdit(null)}>Cancel</button>
                        <button onClick={handleSave}>Save</button>
                    </div>
                </div>
            )}
        </div>
    )
};

export default TeacherHistory;