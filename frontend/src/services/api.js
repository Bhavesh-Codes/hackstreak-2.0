import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Auto-inject JWT token into requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (data) => api.post('/user/login', data),
  register: (data) => api.post('/user/register', data),
};

export const patientService = {
  getAll: () => api.get('/patients/'),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients/', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  getVisits: (id) => api.get(`/patients/${id}/visits`),
  createVisit: (id, data) => api.post(`/patients/${id}/visits`, data),
  getQR: (id) => `${API_BASE_URL}/patients/${id}/qr`,
  getAnalyticsDisease: () => api.get('/patients/analytics/disease'),
  getAnalyticsLocation: () => api.get('/patients/analytics/location'),
};

export default api;
