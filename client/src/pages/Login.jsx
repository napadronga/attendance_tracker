import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function loginUser(email, password, role){
    // FINISH THIS, /api/auth/login
    // Returns {user: {id, name, email, role}}
    return {
        user: {
            id: role === 'teacher' ? 1 : 2,
            role,
            name: role === 'teacher' ? 'TestTeacher' : 'TestStudent',
            email,
        }
    };
}

function Login({ onLogin }){
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState ('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    function validateForm(){
        if (!role){
            return 'Please select Student or Teacher';
        }

        if (!email.trim()){
            return 'Email is required';
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            return 'Please enter a valid email address.';
        }

        if(password.length < 8){
            return 'Password must be at least 8 characters';
        }

        return '';
    }

    async function handleSubmit (e){
        e.preventDefault();
        
        setError('');

        const validationError = validateForm();

        if(validationError){
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const { user } = await loginUser(email, password, role);

            onLogin(user);

            navigate(role === 'teacher' ? '/teacher/overview' : '/student/overview');
        } catch (err) {
            setError('Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    }

    return(
        <main className="loginPage">
            <section className="loginCard">
                <div className="loginHeader">
                    <h1>Attendance Portal</h1>
                    <p>Login to view and manage attendance</p>
                </div>

                <div className="roleButtons">
                    <button
                    type="button"
                    className={role === 'student' ? 'roleButton active' : 'roleButton'}
                    onClick={() => setRole('student')}
                    >
                        Student
                    </button>

                    <button
                    type = "button"
                    className={role === 'teacher' ? 'roleButton active' : 'roleButton'}
                    onClick={() => setRole('teacher')}
                    >
                        Teacher
                    </button>
                </div>
                
                {error && <p className="errorMessage">{error}</p>}

                <form onSubmit ={handleSubmit}>
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
                        placeholder="password123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="submitButton" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </section>
        </main>
        );
}

export default Login;
