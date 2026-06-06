import api from '../api';

export const pageService = {
  getAll: () => api.get('/pages'),
  getByName: (pageName) => api.get(`/pages/${pageName}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data),
  delete: (id) => api.delete(`/pages/${id}`)
};

export const projectService = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
};

export const blogService = {
  getAll: () => api.get('/articles'),
  getBySlug: (slug) => api.get(`/articles/${slug}`),
};

export const contactService = {
  send: (data) => api.post('/contacts', data),
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  markAsRead: (id) => api.put(`/contacts/${id}/read`),
  delete: (id) => api.delete(`/contacts/${id}`)
};
