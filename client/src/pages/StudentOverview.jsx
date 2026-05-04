function StudentOverview({ user }) {
    return (
        <div>
            <h2>Student Overview</h2>
            <p>Welcome back{user ? `, ${user.name}` : ''}.</p>
        </div>
    );
}

export default StudentOverview;
