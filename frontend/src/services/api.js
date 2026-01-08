import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor to handle cases where the SPA returns index.html for API calls (Vercel/Static hosting)
api.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      return Promise.reject(new Error('API returned HTML, likely not found (SPA fallback)'));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Events Service
export const eventsApi = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getStats: () => api.get('/events/stats'),
};

// Sales Service
export const salesApi = {
  getAll: () => api.get('/sales'),
  create: (data) => api.post('/sales', data),
  getStats: () => api.get('/sales/stats'),
  getRevenue: () => api.get('/sales/revenue'),
};

// Users Service
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
