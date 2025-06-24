import {useEffect} from 'react'
import {Link} from 'react-router-dom'
import './css/HomePage.css';
// import { useAuth } from '../context/AuthContext';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

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
function HomePage() {
    // const {user,logout} = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.auth);

    useEffect(() => {
      if (!user) {
          navigate('/login');
      }
  }, [user, navigate]);

    const handleLogout = () => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log me out!'
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(logout());
          toast.success('Logged out successfully', { ...toastConfig, style: successStyle });
          navigate('/login');
          // window.location.href = '/login';
        }
      });
    };

    return (
        <div className="home-container">
            <div className="welcome-card">
            <h1>Hello, {user?.name}!</h1>
            <h2>Welcome to the Home Page</h2>
            <button className="profile-btn">
              <Link to="/profile" className='profile-link'>My Profile</Link>
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
          </div>
        </div>
    )
}

export default HomePage