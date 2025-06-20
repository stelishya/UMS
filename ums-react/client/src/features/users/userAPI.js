import axios from "axios";

const API = axios.create({
  baseURL: "/api", //Proxy will forward to backend
});

// Add token to headers automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

export const loginUserAPI = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  return res.data;
};

// Register API
export const registerUserAPI = async (userData) => {
    const res = await API.post("/auth/register", userData);
    return res.data;
  };
  
  // Get Profile
  export const getProfileAPI = async () => {
    const res = await API.get("/user/profile");
    return res.data;
  };