import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});


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
