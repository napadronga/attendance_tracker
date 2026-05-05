import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

async function registerUser(firstName, lastName, email, password, role) {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
      role,
    }),
  });
}

function Register() {
  const [role, setRole] = useState("student");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  function validateForm() {
    if (!firstName.trim()) {
      return "First name is required.";
    }

    if (!lastName.trim()) {
      return "Last name is required.";
    }

    if (!email.trim()) {
      return "Email is required.";
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return "Please enter a valid email address.";
    }

    if (password.length < 8) {
      return "Password must be at least 8 characters.";
    }

    if (!role) {
      return "Please select a role.";
    }

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await registerUser(
        firstName.trim(),
        lastName.trim(),
        email.trim(),
        password,
        role
      );

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="loginPage">
      <section className="loginCard">
        <div className="loginHeader">
          <h1>Create Account</h1>
          <p>Register as a student or teacher</p>
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
        </div>

        {error && <p className="errorMessage">{error}</p>}
        {success && <p className="successMessage">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="loginForm">
            <label>First Name</label>
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="loginForm">
            <label>Last Name</label>
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="loginForm">
            <label>Email</label>
            <input
              type="email"
              placeholder="person123@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="loginForm">
            <label>Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="submitButton" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="authSwitch">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </section>
    </main>
  );
}

export default Register;