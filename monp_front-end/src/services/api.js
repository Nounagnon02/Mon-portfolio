import api from '../api';

export const pageService = {
  getByName: (pageName) => api.get(`/pages/${pageName}`),
  create: (data) => api.post('/pages', data),
  update: (id, data) => api.put(`/pages/${id}`, data)
};

export const pagsService = {
  getAll: () => api.get('/pags'),
  getByName: (name) => api.get(`/pags/name/${name}`),
  update: (id, data) => api.put(`/pags/${id}`, data),
  create: (data) => api.post('/pags', data),
};

export const projectService = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`)
};

export const projetctsService = {
  getAll: () => api.get('/projetcts'),
  getById: (id) => api.get(`/projetcts/${id}`),
  create: (data) => api.post('/projetcts', data),
  update: (id, data) => api.put(`/projetcts/${id}`, data),
  delete: (id) => api.delete(`/projetcts/${id}`),
};

export const contactService = {
  send: (data) => api.post('/contacts', data),
  getAll: () => api.get('/contacts'),
  markAsRead: (id) => api.put(`/contacts/${id}/read`)
};

export const contactsService = {
  getAll: () => api.get('/contactss'),
  getById: (id) => api.get(`/contactss/${id}`),
  create: (data) => api.post('/contactss', data),
  update: (id, data) => api.put(`/contactss/${id}`, data),
  delete: (id) => api.delete(`/contactss/${id}`),
};
