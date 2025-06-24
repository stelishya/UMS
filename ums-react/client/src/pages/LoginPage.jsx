import React,{ useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  login
  // loginStart, loginSuccess, loginFailure 
} from '../features/auth/authSlice';
import { loginUser } from '../features/auth/authAPI';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import './css/LoginPage.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors,setErrors] = useState({})

//   const { loading, error } = useSelector((state) => state.user);

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
  const validate=()=>{
    const newErrors={};
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
  }

  //handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors= validate();
    setErrors(validationErrors)
    
    if (!email || !password) {
      toast.error('Please enter both email and password.', { ...toastConfig, style: errorStyle });
      return;
    }
    
    const formData = {email,password};
    if (Object.keys(validationErrors).length === 0) {
      console.log('Form is valid, submitting...', formData);
      dispatch(login(formData))
      .unwrap()
      .then(() => {
        toast.success('Login successful!', { ...toastConfig, style: successStyle });
        // window.location.href = '/';
        navigate('/');
      })
      .catch((error) => {
        toast.error(error, { ...toastConfig, style: errorStyle });
      });
    }else{
      console.log("Form has errors", validationErrors);
    }

    // dispatch(loginStart());

    // try {
    //   const data = await loginUser({email, password});
    //   console.log("data in login page",data)
    //   dispatch(loginSuccess(data));
    //   toast.success('Login successful!', { ...toastConfig, style: successStyle });
    //   window.location.href = '/';
    // } catch (err) {
    //   const errorMessage = err.response?.data?.message || 'Login failed. Please check your credentials.';
    //   dispatch(loginFailure(err.response.data.message));
    //   toast.error(errorMessage, { ...toastConfig, style: errorStyle });

    // }
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
          <div className="login-form-group">
            <label className='login-label' style={{color:"#faf9f9"}} htmlFor="email">Email</label>
            <div className="input-with-icon">
            <input 
              style={{backgroundColor:"#faf9f9"}} 
              id="email"
              // type="email" 
              name="email"
              placeholder="Enter Your Email" 
              value={email}
              onChange={e => setEmail(e.target.value.toLowerCase())} 
              // required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
            </div>
          </div>

          <div className="login-form-group">
            {/* <div className="password-label-row"> */}
              <label className='login-label' style={{color:"#faf9f9"}}  htmlFor="password">Password</label>
              <div className="input-with-icon">
              <input 
                style={{backgroundColor:"#faf9f9"}} 
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter Your Password" 
                value={password}
                onChange={e => setPassword(e.target.value)} 
                // required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
                {errors.password && <p className="error-text">{errors.password}</p>}
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
