import { useState } from 'react';

const CLASSES = [
    { id: 1, name: 'Biology'},
    { id: 2, name: 'English'},
    { id: 3, name: 'Math'},
];

const ABSENCES = [
    { id: 1, classId: 1, date: '01-23-2026', status: 'absent' },
    { id: 2, classId: 1, date: '01-27-2026', status: 'absent' },
    { id: 3, classId: 2, date: '02-03-2026', status: 'absent' },
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
    console.log('Submitting excuse:', {
        attendanceId,
        reason,
    });

    return true;
}

function StudentAttendance(){
    const [activeClass, setActiveClass] = useState(CLASSES[0]);
    const [excuseId, setExcuseId] = useState(null);
    const [excuse, setExcuse] = useState('');

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const filteredAbsences = ABSENCES.filter(
        (absence) => absence.classId === activeClass.id
    );

    function openExcuseForm(absenceId){
        setExcuseId(absenceId);
        setExcuse('');
        setError('');
        setSuccess('');
    }

    function closeExcuseForm(){
        setExcuseId(null);
        setExcuse('');
        setError('');
    }
    async function handleExcuseSubmit(e) {
        e.preventDefault();

        setError('');
        setSuccess('');

        if (!excuse.trim()){
            setError('Please enter an excuse before submitting');
            return;
        }

        if(excuse.trim().length < 5){
            setError('Excuse must be at least 5 characters long');
            return;
        }
        try {
            setLoading(true);
            await submitExcuse(excuseId, excuse.trim());

            setExcuseId(null);
            setExcuse('');
            setSuccess('Excuse submitted successfully');
        }catch(error){
            setError('Failed to submit excuse. Please try again.');
        }finally{
            setLoading(false);
        }
    }

    return (
        <main className="page">
            <h2>Your Absences</h2>
            <h3>View your absences for each class.</h3>

            <div>
                {CLASSES.map(c => (
                    <button 
                        key={c.id} 
                        type="button"
                        className={activeClass.id === c.id ? 'classTab active' : 'classTab'} 
                        onClick={() => setActiveClass(c)}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            {error && <p className="errorMessage">{error}</p>}
            {success && <p className="successMessage">{success}</p>}

            {filteredAbsences.length === 0 ? (
                <p className="emptyState">
                    No absences found for {activeClass.name}.
                </p>
            ) :(
                <div className="tableWrapper">
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Excuses</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAbsences.map((a) => (
                                <tr key={a.id}>
                                    <td>{a.date}</td>
                                    <td>{a.status}</td>
                                    <td>
                                        <button type="button" onClick={() => openExcuseForm(a.id)}>
                                            Add Excuse
                                        </button>
                                    </td>
                                </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}

            {excuseId && (
                <div className="excuseForm">
                    <h3>Add Excuse</h3>

                    <form onSubmit={handleExcuseSubmit}>
                        <label>Excuse</label>

                            <textarea
                                placeholder="Enter your excuse here"
                                value={excuse}
                                onChange={(e) => setExcuse(e.target.value)}
                            />

                            <div>
                                <button type="button" onClick={closeExcuseForm}>Cancel</button>
                                
                                <button type="submit" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                    </form>
                </div>
            )}
    </main>   
    );
}

export default StudentAttendance;