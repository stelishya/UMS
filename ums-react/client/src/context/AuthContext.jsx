import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));


    const toastConfig = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark'
    };
    const successStyle = { backgroundColor: 'green', color: '#fff' };
    const errorStyle   = { backgroundColor: 'red',   color: '#fff' };

    // Check if user is logged in on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken)
            // Fetch user data if token exists
            // You'll need to implement this based on your API

            fetchUserData(storedToken).then(userData => {
              if(userData){
                setUser(userData);
              }else{
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
              }
            });
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        setToken(userData.token)
        localStorage.setItem('token', userData.token);
        toast.success('Login successful!', {...toastConfig,style:successStyle});
    };

    const logout = () => {
        setUser(null);
        setToken(null)
        localStorage.removeItem('token');
        toast.info('Logged out.', toastConfig);
    };
    const updateProfile = async (userData) => {
        try {
            console.log("userData in updateProfile in AuthContext.jsx : ",userData)
          const token = localStorage.getItem('token');
          console.log("token in updateProfile in AuthContext.jsx : ",token)

          console.log("userData.id in updateProfile in AuthContext.jsx : ",userData.id)
          // API call to update user profile
          const response = await fetch('http://localhost:4006/api/users/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
          });
        console.log("response : ",response);
          if (!response.ok) {
            toast.error('Failed to update profile', {...toastConfig,style:errorStyle});
            throw new Error('Failed to update profile');
          }
    
          const data = await response.json();
          console.log("data :",data)
          // Update the user in context
          setUser(prev => ({
            ...prev,
            ...data.user,
            // profileImage: data.user.profileImage || prev?.profileImage
          }));
          // toast.success('Profile updated successfully!', {...toastConfig,style:successStyle});
    
          return data;
        } catch (error) {
          console.error('Update profile error:', error);
          // toast.error(error.message || 'Failed to update profile', {...toastConfig,style:errorStyle});
          throw error;
        }
      };
    return (
        <AuthContext.Provider value={{ user,token, login, logout,updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

// Helper function to fetch user data
async function fetchUserData(token) {
    try {
        const response = await fetch('http://localhost:4006/api/users/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}