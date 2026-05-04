import { useState } from 'react';

const CLASSES = ['Biology', 'English', 'Math'];
const STUDENTS = [
    {id: 1, name: 'Todd', attendance: 35, absences: 15, email: "Todd@email.com", status: true},
    {id: 2, name: 'Jake', attendance: 68, absences: 7, email: "Jake@email.com", status: true},
    {id: 3, name: 'Po', attendance: 89, absences: 3, email: "Po@email.com", status: true}
];

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
    const [students, setStudents] = useState(STUDENTS);

    // Check for id from button and toggle it between absent or present
    function toggle(id){
        setStudents(students.map(s => {
            if(s.id === id){
                return {...s, status: !s.status};
            }
            return s;
        }))
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
            <h2>Mark Attendance</h2>
            <h3>Today: {new Date().toLocaleDateString()}</h3>

            <div>
                {CLASSES.map(c => (
                    <button key={c} onClick={() => setActiveClass(c)}>{c}</button>
                ))}
            </div>

            <div className="presentCount">
                <h3>Present</h3>
                <h2>{present}</h2>
                <h3>Absent</h3>
                <h2>{absent}</h2>
            </div>

            <div className="studentTable">
                <form onSubmit={handleSubmit}>
                    <table>
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Email</th>
                                <th>Presence</th>
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
                    <button type="submit">Submit Attendance</button>
                </form>
            </div>
        </div>
    )
}

export default TeacherMark;