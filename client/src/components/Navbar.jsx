import { Link } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function NavBar({ user, logOut }) {
    return (
    <header className="navbar">
        <h2>Attendance App</h2>
        <nav>
        {user.role === 'teacher' ? (
            <ul>
            <li><Link to="/teacher/overview">Overview</Link></li>
            <li><Link to="/teacher/mark">Mark Attendance</Link></li>
            <li><Link to="/teacher/history">Class History</Link></li>
            </ul>
        ) : (
            <ul>
            <li><Link to="/student/overview">Attendance</Link></li>
            <li><Link to="/student/attendance">Abscences</Link></li>
            </ul>
        )}
        </nav>
        
        <div className="user">
            <h3>{user.name}</h3>
            <button onClick={logOut}>LogOut</button>
        </div>
    </header>
    );
}
export default NavBar;