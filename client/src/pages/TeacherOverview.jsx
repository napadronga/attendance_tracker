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

async function fetchClasses(teacherId){
    // FINISH THIS, /api/teacher/classes?teacherId={teacherId}
    // Return classes
    return [];
}

async function fetchOverview(classId){
    // FINISH THIS, /api/teacher/classes/{classId}/overview
    // Return {totalStudents, students: [{id, name, attendancePct, absences}]
    return [];
}

function TeacherOverview(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);

    // Fetch data here from backend, use fetch functinos add useEffect here for some aysnc function

    // Find avg attendance of class, loop through all students and add their att
    let total= 0;
    activeClass.students.forEach(s => {
        total += s.attendancePct;
    });
    const avgAttendance = (total / activeClass.students.length);
    

    return(
        <div>
            <h2>Overview for {activeClass.name}</h2>

            <div>
                {CLASSES.map(c => (
                    <button key={c.id} className="classTabs" onClick={() => setActiveClass(c)}>{c.name}</button>
                ))}
            </div>

            <div className="classStats">
                <div>
                    <h3>Average Attendance</h3>
                    <h2>{avgAttendance.toFixed(0)}%</h2>
                </div>
                <div>
                    <h3>Total Students</h3>
                    <h2>{activeClass.students.length}</h2>
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
                        {activeClass.students.map((s, index)  => (
                            <tr key={index}>
                                <td>{s.name}</td>
                                <td>{s.attendancePct}%</td>
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