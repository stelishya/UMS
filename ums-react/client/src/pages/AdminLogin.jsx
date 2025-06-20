import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './css/AdminLogin.css';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        console.log("handleSubmit in AdminLogin")
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/admin-login', { email, password });
            console.log("response in admin login",response)
            if (response.data) {
                login(response.data);
                // toast.success('Admin login successful!');
                navigate('/admin');
            }
        } catch (error) {
            console.log("error in admin login",error)
            toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <div className="admin-login-header">
                    <span className="admin-login-title">Admin Login</span>
                </div>
                <p className="admin-login-prompt">Please fill in your admin login details below</p>
                <form onSubmit={handleSubmit} className="admin-login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="admin-login-button">Log In</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;