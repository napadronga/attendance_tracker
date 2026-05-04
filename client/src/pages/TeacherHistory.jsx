import { useState } from 'react';

const CLASSES = [
    {id: 1, name: 'Biology'},
    {id: 2, name: 'English'},
    {id: 3, name: 'Math'},
];
const STUDENTS = [
    {id: 1, name: 'Todd', attendancePct: 35, absences: 15, status: true},
    {id: 2, name: 'Jake', attendancePct: 68, absences: 7, status: true},
    {id: 3, name: 'Po', attendancePct: 89, absences: 3, status: true}
];
const PAST_CLASSES = [
    {id : 1, classId: 1, date: '01-23-2026', present: 15, absent: 5},
    {id : 2, classId: 2, date: '01-27-2026', present: 10, absent: 10},
    {id : 3, classId: 3, date: '01-29-2026', present: 17, absent: 3}
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
    console.log('Saving session:', {
        classId,
        date,
        records,
    });

    return true;
}



function TeacherHistory(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);
    const [edit, setEdit] = useState(null);
    const [students, setStudents] = useState(STUDENTS);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const filteredHistory = PAST_CLASSES.filter((session) => session.classId === activeClass.id);

    function handleClassChange(c){
        setActiveClass(c);
        setEdit(null);
        setSuccess('');
        setError('');
    }

    function openEdit(session){
        setEdit(session);
        setStudents(STUDENTS);
        setSuccess('');
        setError('');
    }

    function cancelEdit(){
        setEdit(null);
        setStudents(STUDENTS);
        setError('');
    }

    function toggle(id){
        setStudents((currentStudents) => 
            currentStudents.map((s) => {
            if(s.id === id){
                return {...s, status: !s.status};
            }
            return s;
        }));
    }
    
    function getAttendancePercent(session){
        const total = session.present + session.absent;

        if(total === 0){
            return '0.0';
        }

        return ((session.present / total) * 100).toFixed(1);
    }

    async function handleSave(){

        setSuccess('');
        setError('');

        if (!edit){
            setError('No history record selected.');
            return;
        }

        if(students.length === 0){
            setError('No students found for this session.');
            return;
        }

        try{
            setLoading(true);

            const records = students.map((S) => ({
                studentId: S.id,
                status: S.status ? 'present' : 'absent'
            }));
            await saveSession(activeClass.id, edit.date, records);

            setEdit(null);
            setSuccess('Attendance history updated successfully.');
        }catch(err){
            setError('Could not save history changes. Please try again.');
        }finally{
            setLoading(false);
        }
    }

    return (
        <main className="page">
            <h2>Class History</h2>
            <h3>View and Edit previous attendance records.</h3>


            <div>
                {CLASSES.map(c => (
                    <button 
                    key={c.id} 
                    type="button"
                    className={activeClass.id === c.id ? 'classTab active' : 'classTab'}
                    onClick={() => handleClassChange(c)}
                    >
                        {c.name}
                    </button>
                ))}
            </div>


            {error && <p className="errorMessage">{error}</p>}
            {success && <p className="successMessage">{success}</p>}

            {filteredHistory.length === 0 ? (
                <p className="emptyState"> No attendance history found for {activeClass.name}.
                </p>
            ) : (
                <div className="tableWrapper">
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
                            {filteredHistory.map((d) => (
                                <tr key={d.id}>
                                    <td>{d.date}</td>
                                    <td>{d.present}</td>
                                    <td>{d.absent}</td>
                                    <td>{getAttendancePercent(d)}%</td>
                                    <td>
                                        <button type="button" onClick={() => openEdit(d)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
            


            {edit && (
                <div className="editHistory">
                    <h3>Edit {activeClass.name} - {edit.date}</h3>
                    
                    {students.length === 0 ? (
                        <p className="emptyState">No students found for this session.</p>
                    ) : (
                        <div className="tableWrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th>
                                        <th>Presence</th>
                                        <th>Change</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {students.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.name}</td>
                                            <td>{s.status ? 'Present' : 'Absent'}</td>
                                            <td>
                                                <button type="button" onClick={() => toggle(s.id)}>
                                                    Mark {s.status ? 'Absent' : 'Present'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> 
                    )}
                    
                    <div className="formActions">
                        <button
                        type="button"
                        onClick={cancelEdit}>
                            Cancel
                        </button>

                        <button 
                        type="button"
                        onClick={handleSave} 
                        disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default TeacherHistory;