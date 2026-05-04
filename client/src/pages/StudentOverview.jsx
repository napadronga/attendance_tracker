import { useState } from 'react';

const CLASSES = [
    { id: 1, name: 'Biology', attended: 17, total: 20, minAtt: 75},
    { id: 2, name: 'English', attended: 14, total: 20, minAtt: 75},
    { id: 3, name: 'Math', attended: 18, total: 20, minAtt: 80},
];

async function fetchClasses(studentId){
    // FINISH THIS, /api/student/classes?studentId={studentId}
    // Return [{id, name, attended, total, minAtt}]
    return [];
}

function StudentOverview(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);
    const absences = activeClass.total - activeClass.attended;
    const attendancePct = (activeClass.attended / activeClass.total) * 100;

    return(
        <div>
            <h2>Attendance</h2>
            <h3>Overview of your classes</h3>

            <div>
                {CLASSES.map(c => (
                    <button key={c.id} className="classTabs" onClick={() => setActiveClass(c)}>{c.name}</button>
                ))}
            </div>

            <div className="classStats">
                <div>
                    <h3>Attendance Rate</h3>
                    <h2>{attendancePct.toFixed(1)}%</h2>
                </div>
                <div>
                    <h3>Classes Attended</h3>
                    <h2>{activeClass.attended}</h2>
                </div>
                <div>
                    <h3>Total Absences</h3>
                    <h2>{absences}</h2>
                </div>
                <div>
                    <h3>Min Attendance</h3>
                    <h2>{activeClass.minAtt}</h2>
                </div>
            </div>
        </div>
    )
}

export default StudentOverview;