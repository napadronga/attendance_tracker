import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// not added yet import './index.css'
import Login from './pages/Login.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)