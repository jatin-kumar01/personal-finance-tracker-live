
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://personal-finance-tracker-f9sg.onrender.com',
    headers: {
        'Content-Type': 'application/json'
    }
});
// Attach Bearer token from localStorage to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to /login on 401/403
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
