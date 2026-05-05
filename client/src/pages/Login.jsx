import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

async function loginUser(email, password, role) {
  // FINISH THIS, /api/auth/login
  // Returns {user: {id, name, email, role}}
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, role }),
  });
}

function Login({ onLogin, theme, toggleTheme }){
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState ('');

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function validateForm() {
    if (!role) {
      return "Please select Student or Teacher";
    }

    if (!email.trim()) {
      return "Email is required";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      const { user, token } = await loginUser(email, password, role);

      if (token) {
        localStorage.setItem("token", token);
      }

      onLogin(user);

      if (role === "teacher") {
        navigate("/teacher/overview");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/overview");
      }
    } catch (err) {
      setError(
        err.message ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  }

    return(
        <main className="loginPage">
            <button
              type="button"
              className="themeToggle loginPageToggle"
              onClick={toggleTheme}
              aria-label="Toggle dark and light theme"
            >
              <span className="themeIcon">{theme === 'light' ? '☀️' : '🌙'}</span>
              <span className="themeTrack">
                <span className="themeThumb"></span>
              </span>
            </button>

            <section className="loginCard">
                <div className="loginHeader">
                    <h1>Attendance Portal</h1>
                    <p>Login to view and manage attendance</p>
                </div>

        <div className="roleButtons">
          <button
            type="button"
            className={role === "student" ? "roleButton active" : "roleButton"}
            onClick={() => setRole("student")}
          >
            Student
          </button>

          <button
            type="button"
            className={role === "teacher" ? "roleButton active" : "roleButton"}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>

          <button
            type="button"
            className={role === "admin" ? "roleButton active" : "roleButton"}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        {error && <p className="errorMessage">{error}</p>}

                <form onSubmit ={handleSubmit}>
                    <div className="loginForm">
                        <label>Email</label>
                        <input
                        type="email"
                        placeholder="you@school.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

          <div className="loginForm">
            <label>Password</label>
            <input
              type="password"
              placeholder="password123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submitButton" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="authSwitch">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="authSwitch">
          <Link to="/forgot-password">Forgot password?</Link>
        </p>
      </section>
    </main>
  );
}

export default Login;
