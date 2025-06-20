import React from 'react' ;
import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import AdminLogin from './pages/AdminLogin';
import AdminPage from './pages/AdminPage'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        <Route path="/admin-login" element={<AdminLogin />} /> 
        <Route path="/admin" element={<PrivateRoute redirectTo="/admin-login"><AdminPage /></PrivateRoute>} />
      </Routes>
      <ToastContainer/>
    </>
  )
}

export default App
