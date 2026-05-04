import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

async function loginUser(email, password, role){
    // FINISH THIS, send to auth
    // Returns {user: {id, name, email, role}}
    return {
        user: {
            role,
            name: role === 'teacher' ? 'TestTeacher' : 'TestStudent',
            email: role === 'teacher' ? 'testteacher@123.com' : 'teststudent@123.com',
        }
    };
}

function Login({ onLogin }){
    const [role, setRole] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState ('');
    const navigate = useNavigate();

    async function handleSubmit (e){
        e.preventDefault();
        const {user} = await loginUser(email, password, role);
        onLogin(user);
        navigate(role === 'teacher' ? '/teacher/overview' : '/student/overview');
    }

    return(
        <div className="loginOuterDiv">
            <div>
                <h2 className="loginTitle">Log in to view your attendance</h2>
                <div className="roleButtons">
                    <button onClick={() => setRole('student')}>Student</button>
                    <button onClick={() => setRole('teacher')}>Teacher</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className='loginForm'>
                        <label>Email</label>
                        <input className = "loginInput"
                        type="text"
                        placeholder="person123@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='loginForm'>
                        <label>Password</label>
                        <input className = "loginInput"
                        type="password"
                        placeholder="password123"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="submitButton">Log in</button>
                </form>
            </div>
        </div>
    );
}

export default Login;