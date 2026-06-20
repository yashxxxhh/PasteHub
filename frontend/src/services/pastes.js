import api from './api'

export const pastesService = {
  create: (data) => api.post('/pastes', data),
  list: (params) => api.get('/pastes', { params }),
  get: (shortId) => api.get(`/pastes/${shortId}`),
  update: (shortId, data) => api.put(`/pastes/${shortId}`, data),
  delete: (shortId) => api.delete(`/pastes/${shortId}`),
  duplicate: (shortId) => api.post(`/pastes/${shortId}/duplicate`),
}

export const authService = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  me: () => api.get('/me'),
}

export const dashboardService = {
  stats: () => api.get('/dashboard'),
  myPastes: () => api.get('/my-pastes'),
}
