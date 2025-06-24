import axios from '../../utils/axiosInstance';

export const loginUser = async (credentials) => {
  try {
    const res = await axios.post('/auth/login', credentials);
    console.log("res.data in authAPI.js : ",res.data)
    
    return res.data;
  } catch (error) {
    console.log("error in authAPI.js : ",error)
    throw error;
  }
};

export const registerUser = async (formData) => {
    try {
        console.log('Sending registration request with data:', formData);
        const res = await axios.post('/auth/register', formData);
        console.log('Registration successful:', res.data);
        return res.data;
    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers,
          });
          throw error;
    }
};
export const updateUserProfile = async (userData) => {
  try {
    const res = await axios.patch('/users/profile', userData,{
      headers:{
        'Content-Type' : 'application/json',
      },
    });
    console.log("res.data in authAPI.js : ",res.data)
    return res.data;
  } catch (error) {
    console.error('Profile update error:', error.response?.data || error.message);
    throw error;
  }
};

export const uploadProfileImage = async (formData) => {
  try {
    const res = await axios.post('/users/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Image upload error:', error.response?.data || error.message);
    throw error;
  }
};

export const adminLoginUser = async (credentials) => {
  try {
    const res = await axios.post('/auth/admin-login', credentials);
    console.log("res.data in authAPI.js : ",res.data)
    return res.data;
  } catch (error) {
    console.error('Admin login error:', error.response?.data || error.message);
    throw error;
  }
};