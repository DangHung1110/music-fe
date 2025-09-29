import axios from 'axios';
import { useAuthStore } from '../store/auth';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1/',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const { accessToken, isTokenExpired } = useAuthStore.getState(); 
  
  if (accessToken && !isTokenExpired()) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { refreshAccessToken, logout, isRefreshTokenExpired } = useAuthStore.getState();
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Check if refresh token is expired
      if (isRefreshTokenExpired()) {
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
