import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <main className="loginPage">
      <section className="loginCard">
        <div className="loginHeader">
          <h1>Forgot Password</h1>
          <p>Password reset assistance</p>
        </div>

        <p className="emptyState">
          For security reasons, password resets are handled by the school
          administrator. Please contact your teacher, school office, or system
          administrator to reset your password.
        </p>

        <p className="authSwitch">
          Remember your password? <Link to="/">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;