import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, logout }) {
  if (!user) return null;

  return (
    <header className="navbar">
      <h3>Attendance</h3>

      <nav>
        {user.role === 'teacher' ? (
          <ul>
            <li><Link to="/teacher/overview">Overview</Link></li>
            <li><Link to="/teacher/mark">Mark Attendance</Link></li>
            <li><Link to="/teacher/history">Class History</Link></li>
            <li><Link to="/teacher/excuses">Excuses</Link></li>
          </ul>
        ) : (
          <ul>
            <li><Link to="/student/overview">My Attendance</Link></li>
            <li><Link to="/student/attendance">Attendance</Link></li>
          </ul>
        )}
      </nav>

      <div className="user">
        <h3>{user.name}</h3>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;