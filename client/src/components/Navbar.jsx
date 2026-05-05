import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ user, logout, theme, toggleTheme }) {
  if (!user) return null;

  return (
    <header className="navbar">
      <h3>Attendance Portal</h3>

      <nav>
        {user.role === "teacher" ? (
          <ul>
            <li>
              <Link to="/teacher/overview">Overview</Link>
            </li>
            <li>
              <Link to="/teacher/mark">Mark Attendance</Link>
            </li>
            <li>
              <Link to="/teacher/history">Class History</Link>
            </li>
            <li>
              <Link to="/teacher/excuses">Excuses</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to="/student/overview">My Attendance</Link>
            </li>
            <li>
              <Link to="/student/attendance">Absences</Link>
            </li>
          </ul>
        )}
      </nav>

      <div className="user">
        <div className="userBadge">
          <span className="userAvatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </span>

          <div className="userInfo">
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </div>
        </div>

        <button
          type="button"
          className="themeToggle"
          onClick={toggleTheme}
          aria-label="Toggle dark and light theme"
        >
          <span className="themeIcon">{theme === "light" ? "☀️" : "🌙"}</span>

          <span className="themeTrack">
            <span className="themeThumb"></span>
          </span>
        </button>

        <button type="button" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
