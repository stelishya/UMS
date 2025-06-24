import axios from "axios";
// import { store } from '../app/store';
import { logout, setTokens } from '../features/auth/authSlice';
// import { readlink } from "fs";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4006/api", 
});

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = store.getState().auth.accessToken;
//     if (accessToken) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error)=> Promise.reject(error)
// );
  // const token = localStorage.getItem("token");
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  // return config;

export const setupInterceptors = (store) => {
  let isRefreshing = false;
  let failedQueue = [];

  const processQueue= (error,token=null)=>{
    failedQueue.forEach(prom=>{
      if(error){
        prom.reject(error)
      }else{
        prom.resolve(token)
      }
    })
    failedQueue = []
  }

  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = store.getState().auth.accessToken;
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    (response)=>response,
    async (error)=>{
      const  originalRequest = error.config;
      const excludedRoutes = ['/auth/login', '/auth/admin-login', '/auth/register'];

      if(error.response?.status === 401 && !originalRequest._retry && !excludedRoutes.includes(originalRequest.url)){
        if(isRefreshing){
          return new Promise (function (resolve,reject){
            failedQueue.push({resolve,reject})
          })
          .then(token=>{
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
        }
        originalRequest._retry=true;
        isRefreshing=true;

        try {
          const { data } = await axiosInstance.post('/auth/refresh');
          const { accessToken } = data;

        store.dispatch(setTokens({ accessToken }));

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return axiosInstance(originalRequest);

        } catch (refreshError) {
          console.log("refreshError: ",refreshError)
          console.log(error)
          // processQueue(refreshError, null);
          processQueue(error, null);
          store.dispatch(logout());
          return Promise.reject(error);
          // return Promise.reject(refreshError); 
        }finally{
          isRefreshing=false;
        }
      }
      return Promise.reject(error);
    }
  )
}
export default axiosInstance;
