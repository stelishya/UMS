import { useDispatch } from 'react-redux';
import React,{ useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  register
  // registerStart, registerSuccess, registerFailure
 } from '../features/auth/authSlice';
import { registerUser } from '../features/auth/authAPI';

import './css/SignupPage.css';

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

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

    //name validation
    if (formData.name.trim() === "") {
      newErrors.name = "Username is required.";
    }else if (formData.name.trim().length < 3) {
      newErrors.name = "Username must be at least 3 characters.";
   }
    // email validation
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // password validation
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    // confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formData.confirmPassword.length < 6) {
      newErrors.confirmPassword = 'Confirm Password must be at least 6 characters.';
    }

    return newErrors;
};
  // handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name==='email' ? value.toLowerCase() : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    try {
      if (Object.keys(validationErrors).length === 0) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match!",{...toastConfig,style:errorStyle});
        return;
      }
      dispatch(register(formData))
        .unwrap()
        .then(() => {
          toast.success('Registration successful! Please log in.', { ...toastConfig, style: successStyle });
          navigate('/login')
          // window.location.href = '/login';
        })
        .catch((error) => {
          toast.error(error, { ...toastConfig, style: errorStyle });
        });
      }else{
        console.log('Form has errors:', validationErrors);
      }
      
    } catch (error) {
      console.log("error in signup",error)
      toast.error(error.response?.data?.message || 'Registration failed. Please try again later.', { ...toastConfig, style: errorStyle });
    }

    // dispatch(registerStart());
    // try {
    //   const data = await registerUser(formData);
    //   dispatch(registerSuccess(data));
    //   window.location.href = '/login';
    //   toast.success('Registration successful! Please log in.', {...toastConfig,style:successStyle});
    // } catch (err) {
    //   const errorMessage = err.response?.data?.message || 'Registration failed. Error!';
    //   dispatch(registerFailure(err.response?.data?.message || 'Registration failed'));
    //   toast.error(errorMessage,{...toastConfig,style:errorStyle});
    // }
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
              <label style={{color:"#faf9f9",fontSize:"1rem",fontWeight:"700"}} htmlFor="name">Name</label>
              <input 
                style={{backgroundColor:"#faf9f9"}} 
                id="name"
                type="text" 
                name="name"
                placeholder="Enter your Name" 
                value={formData.name}
                onChange={handleChange}
                // required
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
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
            <label style={{color:"#faf9f9",fontSize:"1rem",fontWeight:"700"}} htmlFor="email">Email</label>
            <input 
              style={{backgroundColor:"#faf9f9",width:"95%"}} 
              id="email"
              // type="email" 
              name="email"
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              // required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label style={{color:"#faf9f9",fontSize:"1rem",fontWeight:"700"}} htmlFor="password">Password</label>
            <div className="input-with-icon">
              <input 
                style={{backgroundColor:"#faf9f9",width:"95%"}} 
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleChange}
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
          </div>


          <div className="form-group">
            <label style={{color:"#faf9f9",fontSize:"1rem",fontWeight:"700"}} htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-with-icon">
              <input 
                style={{backgroundColor:"#faf9f9",width:"95%"}} 
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm your password" 
                value={formData.confirmPassword}
                onChange={handleChange}
                // required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
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