import { useState } from 'react';

const CLASSES = [
    {id: 1, name: 'Biology', students: [
        {id: 1, name: 'Todd', email: 'Todd@email.com', attendancePct: 35, absences: 15},
        {id: 2, name: 'Jake', email: 'Jake@email.com', attendancePct: 68, absences: 7}
    ]},
    {id: 2, name: 'English', students: [
        {id: 1, name: 'Po', email: 'Po@email.com', attendancePct: 89, absences: 3},
        {id: 2, name: 'Sarah', email: 'Sarah@email.com', attendancePct: 92, absences: 2}
    ]},
    {id: 3, name: 'Math', students: [
        {id: 1, name: 'Mick', email: 'Mick@email.com', attendancePct: 45, absences: 13},
        {id: 2, name: 'Alex', email: 'Alex@email.com', attendancePct: 78, absences: 5}
    ]}
]

async function fetchStudents(classId){
    // FINISH THIS, /api/teacher/classes/{classId}/students
    // Return [{id, firstName, lastName, email}]
    return[];
}

async function submitAttendance(classId, date, records){
    // FINISH THIS, /api/teacher/classes/{classId}/attendance
    // Body {date, records: [{studentId, status}]}
    // return true or false on success
    return true;
}

function TeacherMark(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);
    const [students, setStudents] = useState(CLASSES[0].students.map(s => ({...s, status: true})));

    // Check for id from button and toggle it between absent or present
    function toggle(id){
        setStudents(students.map(s => {
            if(s.id === id){
                return {...s, status: !s.status};
            }
            return s;
        }))
    }

    // Have to do this because each student has a status mode
    function handleClassChange(c){
        setActiveClass(c);
        setStudents(c.students.map(s => ({...s, status: true})));
    }

    let present=0;
    students.forEach(s => {
        if (s.status) present++;
    });
    const absent = students.length - present;

    async function handleSubmit(e){
        e.preventDefault();
        // Grab the date (YYYY-MM-DDHH:mm:ss:sssZ), cut off the second half and keep just the year,month,day
        let date = new Date().toISOString()
        date = date.split('T')[0];
        const records = students.map(s => ({
            studentId: s.id,
            status: s.status ? 'present' : 'absent'
        }));
        await submitAttendance(activeClass, date, records);
    }

    return (
        <div>
            <h2>Mark Attendance for {new Date().toLocaleDateString()}</h2>

            <div>
                {CLASSES.map(c => (
                    <button key={c.id} className="classTabs" onClick={() => handleClassChange(c)}>{c.name}</button>
                ))}
            </div>

            <div className="classStats">
                <div>
                    <h3>Present</h3>
                    <h2>{present}</h2>
                </div>
                <div>
                    <h3>Absent</h3>
                    <h2>{absent}</h2>
                </div>
            </div>

            <div className="studentTable">
                <form onSubmit={handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((s, index) => (
                                <tr key={index}>
                                    <td>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td>{s.status ? 'Present' : 'Absent'}</td>
                                    <td>
                                        <button type="button" onClick={() => toggle(s.id)}>
                                            {s.status ? "Present" : "Absent"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="submitAttendance" type="submit">Submit Attendance</button>
                </form>
            </div>
        </div>
    )
}

export default TeacherMark;