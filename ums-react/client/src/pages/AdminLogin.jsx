import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux'
import { adminLogin } from '../features/auth/authSlice';

import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './css/AdminLogin.css';

function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const { login } = useAuth();

    //toastify
    const toastConfig = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      };
      const successStyle = { backgroundColor: 'green', color: '#fff' };
      const errorStyle   = { backgroundColor: 'red',   color: '#fff' };
    //validation
    const validate = () => {
        const newErrors = {};
        const emailPattern = /^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$/;
    
        // email validation
        if (!email) {
          newErrors.email = 'Email is required.';
        } else if (!emailPattern.test(email)) {
          newErrors.email = 'Please enter a valid email address.';
        }
    
        // password validation
        if (!password) {
          newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
          newErrors.password = 'Password must be at least 6 characters.';
        }
    
        return newErrors;
    };

    //handlers
    const handleSubmit = async (e) => {
        console.log("handleSubmit in AdminLogin")
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        try {
            if (Object.keys(validationErrors).length === 0) {
                const formData = {email,password};
                console.log('Form is valid, submitting...', formData);

                dispatch(adminLogin(formData))
                .unwrap()
                .then(() => {
                    navigate('/admin');
                    toast.success('Admin login successful!', {...toastConfig,style:successStyle});
                })
                .catch((error) => {
                    console.log('Error caught in AdminLogin component:', error);
                    toast.error(error || 'Login failed. Please check your credentials.', {...toastConfig,style:errorStyle});
                });
            // const response = await axios.post('/api/users/admin-login', formData);
            // console.log("response in admin login",response)
            // if (response.data) {
            //     login(response.data);
            //     // toast.success('Admin login successful!');
            //     navigate('/admin');
            // }
            }else{
                console.log('Form has errors:', validationErrors);
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
                        // type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.toLowerCase())}
                        // required
                    />
                    {errors.email && <p className="error-text">{errors.email}</p>}
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        // required
                    />
                    {errors.password && <p className="error-text">{errors.password}</p>}
                    <button type="submit" className="admin-login-button">Log In</button>
                </form>
            </div>
        </div>
    );
}

export default AdminLogin;