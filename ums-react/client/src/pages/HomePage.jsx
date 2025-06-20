import {Link} from 'react-router-dom'
import './css/HomePage.css';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

function HomePage() {
    const {user,logout} = useAuth();
    // const userName = user?.name || 'Guest';

    const handleLogout = () => {
      // if (window.confirm('Are you sure you want to log out?')) {
      //   logout();
      //   window.location.href = '/login';
      // }
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
          logout();
          window.location.href = '/login';
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