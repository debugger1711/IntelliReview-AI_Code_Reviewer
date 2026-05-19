import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('intellireview_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('intellireview_token');
      localStorage.removeItem('intellireview_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ───
export const authAPI = {
  signup: (data) => API.post('/auth/signup', data),
  login: (data) => API.post('/auth/login', data),
};

// ─── Review API ───
export const reviewAPI = {
  create: (data) => API.post('/review', data),
  getAll: () => API.get('/reviews'),
  getById: (id) => API.get(`/reviews/${id}`),
  delete: (id) => API.delete(`/reviews/${id}`),
};

export default API;
