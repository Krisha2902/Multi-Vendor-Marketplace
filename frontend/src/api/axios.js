import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Har request me token apne aap lag jayega
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch {
    // Ignore restricted localStorage or header access
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isCredentialRequest =
      requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

    if (error.response?.status === 401 && !isCredentialRequest) {
      try {
        localStorage.removeItem('token');
      } catch {
        // Ignore restricted localStorage access
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('shopnest:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;