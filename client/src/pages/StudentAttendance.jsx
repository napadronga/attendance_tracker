import { useState } from 'react';

const CLASSES = [
    { id: 1, name: 'Biology'},
    { id: 2, name: 'English'},
    { id: 3, name: 'Math'},
];

const ABSENCES = [
    { id: 1, date: '01-23-2026', status: 'absent' },
    { id: 2, date: '01-27-2026', status: 'absent' },
    { id: 3, date: '02-03-2026', status: 'absent' },
];

async function fetchAbsences(studentId, classId){
    // FINISH THIS /api/student/classes/{classId}/absences
    // Return [{id, date, status}]
    return [];
}

async function submitExcuse(attendanceId, reason){
    // FINISH THIS /api/student/absences/{attendanceId}/excuse
    // Body {reason}
    // Return true on success
    return true;
}

function StudentAttendance(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);
    const [excuseId, setExcuseId] = useState(null);
    const [excuse, setExcuse] = useState('');

    async function handleExcuseSubmit(e) {
        e.preventDefault();
        await submitExcuse(excuseId, excuse);
        setExcuseId(null);
        setExcuse('');
    }

    return (
        <div>
            <h2>Your Absences</h2>
            <h3>View your absences</h3>

            <div>
                {CLASSES.map(c => (
                    <button key={c.id} className="classTabs" onClick={() => setActiveClass(c)}>{c.name}</button>
                ))}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Excuses</th>
                    </tr>
                </thead>
                <tbody>
                    {ABSENCES.map((a, index) => (
                        <tr key={index}>
                            <td>{a.date}</td>
                            <td>{a.status}</td>
                            <td>
                                <button type="button" onClick={() => setExcuseId(a.id)}>Add Excuse</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {excuseId && (
                <div className="excuseForm">
                    <h3>Add Excuse</h3>
                    <form onSubmit={handleExcuseSubmit}>
                        <label>Excuse</label>
                            <input
                                type="text"
                                placeholder="Enter your excuse here"
                                value={excuse}
                                onChange={(e) => setExcuse(e.target.value)}
                            />
                            <div>
                                <button type="button" onClick={() => {setExcuseId(null); setExcuse('');}}>Cancel</button>
                                <button type="submit">Submit</button>
                            </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default StudentAttendance;