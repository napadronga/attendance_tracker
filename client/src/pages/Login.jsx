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
        <div>
            <div className="login">Login to view your attendance</div>
            <div className="roleButtons">
                <div onClick={() => setRole('student')}>Student</div>
                <div onClick={() => setRole('teacher')}>Teacher</div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='loginForm'>
                    <label>Email</label>
                    <input 
                    type="text"
                    placeholder="person123@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='loginForm'>
                    <label>Password</label>
                    <input
                    type="password"
                    placeholder="password123"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="submitButton">Login</button>
            </form>
        </div>
    );
}

export default Login;