import { useDispatch,useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { loginUser } from '../features/auth/authAPI';
import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import './css/LoginPage.css';

export default function LoginPage() {
    console.log("login page")
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

//   const { loading, error } = useSelector((state) => state.user);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.', { ...toastConfig, style: errorStyle });
      return;
    }

    dispatch(loginStart());

    try {
      const data = await loginUser({email, password});
      console.log("data in login page",data)
      dispatch(loginSuccess(data));
      toast.success('Login successful!', { ...toastConfig, style: successStyle });
      window.location.href = '/';
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
      dispatch(loginFailure(err.response.data.message));
      toast.error(errorMessage, { ...toastConfig, style: errorStyle });

    }
  };

  return (
    <div className='container'>
    {/* <div className='login-container'> */}
        <div className="login-card">
          <div className="login-header">
            <h2>Login</h2>
            <p>Sign in to access your account</p>
          </div>

        <form onSubmit={handleLogin} className='login-form'>
          <div className="form-group">
            <label className='login-label' htmlFor="email">Email</label>
            <div className="input-with-icon">
            <input 
              id="email"
              type="email" 
              placeholder="Enter Your Email" 
              value={email}
              onChange={e => setEmail(e.target.value)} 
              required
            />
            </div>
          </div>

          <div className="form-group">
            {/* <div className="password-label-row"> */}
              <label className='login-label' htmlFor="password">Password</label>
              <div className="input-with-icon">
              <input 
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Your Password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
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
          {/* </div> */}
          </div>

            <button 
              type="submit"
              className='login-button'
            //   disabled={loading || !email ||!password}  
            >Login
            </button>
        </form>

        <div className="signup-link">
          Don't have an account?{' '}
          <Link to="/register" className="signup-text">
            Sign up
          </Link>
        </div>
        </div>
    {/* </div> */}
    </div>
  );
}
