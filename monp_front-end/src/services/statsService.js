import api from '../api';

export const statsService = {
  getAll: () => api.get('/stats'),
  getById: (id) => api.get(`/stats/${id}`),
  create: (data) => api.post('/stats', data),
  update: (id, data) => api.put(`/stats/${id}`, data),
  delete: (id) => api.delete(`/stats/${id}`),
};
