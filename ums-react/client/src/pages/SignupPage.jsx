import { useDispatch } from 'react-redux';
import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { registerStart, registerSuccess, registerFailure } from '../features/auth/authSlice';
import { registerUser } from '../features/auth/authAPI';

import './css/SignupPage.css';

export default function SignupPage() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match!",{...toastConfig,style:errorStyle});
      return;
    }

    dispatch(registerStart());
    try {
      const data = await registerUser(formData);
      dispatch(registerSuccess(data));
      window.location.href = '/login';
      toast.success('Registration successful! Please log in.', {...toastConfig,style:successStyle});
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      dispatch(registerFailure(err.response?.data?.message || 'Registration failed'));
      toast.error(errorMessage,{...toastConfig,style:errorStyle});
    }
  };

  return (
    <div className='container'>
      <div className="signup-card">
        <div className="signup-header">
          <h2>Create an Account</h2>
          <p>Join us today and get started</p>
        </div>

        <form onSubmit={handleSubmit} className='signup-form'>
          <div className="name-fields">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                id="name"
                type="text" 
                name="name"
                placeholder="Enter your Name" 
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input 
                id="lastName"
                type="text" 
                name="lastName"
                placeholder="Enter your last name" 
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div> */}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              name="email"
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>


          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <input 
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>


          <button 
            type="submit"
            className='signup-button'
          >
            Sign Up
          </button>
        </form>

        <div className="login-link">
          Already have an account?{' '}
          <Link to="/login" className="login-text">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}