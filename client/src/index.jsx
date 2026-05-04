import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import TeacherOverview from './pages/TeacherOverview.jsx'
import TeacherMark from './pages/TeacherMark.jsx'
import TeacherHistory from './pages/TeacherHistory.jsx'
import StudentOverview from './pages/StudentOverview.jsx'
import StudentAttendance from './pages/StudentAttendance.jsx'

function App() {
  const [user, setUser] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />
        <Route path="/teacher/overview" element={<TeacherOverview user={user} />} />
        <Route path="/teacher/mark" element={<TeacherMark user={user} />} />
        <Route path="/teacher/history" element={<TeacherHistory user={user} />} />
        <Route path="/student/overview" element={<StudentOverview user={user} />} />
        <Route path="/student/attendance" element={<StudentAttendance user={user} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)