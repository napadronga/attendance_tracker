import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import './index.css';

import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import TeacherOverview from './pages/TeacherOverview.jsx';
import TeacherMark from './pages/TeacherMark.jsx';
import TeacherHistory from './pages/TeacherHistory.jsx';
import StudentOverview from './pages/StudentOverview.jsx';
import StudentAttendance from './pages/StudentAttendance.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const [user, setUser] = useState(null);

  function logOut() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <BrowserRouter>
      {user && <Navbar user={user} logout={logOut} />}

      <Routes>
        <Route path="/" element={<Login onLogin={setUser} />} />

        <Route 
          path="/teacher/overview" 
          element={
            <ProtectedRoute user={user} allowedRole="teacher"> 
              <TeacherOverview user={user} />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/teacher/mark" 
          element={
            <ProtectedRoute user={user} allowedRole="teacher"> 
            <TeacherMark user={user} />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/teacher/history" 
          element={
            <ProtectedRoute user={user} allowedRole="teacher"> 
              <TeacherHistory user={user} />
            </ProtectedRoute>
          } 
        />

        <Route 
        path="/student/overview" 
        element={
          <ProtectedRoute user={user} allowedRole="student"> 
            <StudentOverview user={user} />
          </ProtectedRoute>
        } 
        />

        <Route 
        path="/student/attendance" 
        element={
          <ProtectedRoute user={user} allowedRole="student"> 
            <StudentAttendance user={user} />
          </ProtectedRoute>
        } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);