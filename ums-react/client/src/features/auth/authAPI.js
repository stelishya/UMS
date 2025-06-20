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
