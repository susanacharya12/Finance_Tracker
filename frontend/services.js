import api from './axios'

// ── Authentication ────────────────────────────────────────────────────────────
export const authAPI = {
  login:      (data)        => api.post('/token/', data),
  refresh:    (data)        => api.post('/token/refresh/', data),
  register:   (data)        => api.post('/users/register/', data),
  getProfile: ()            => api.get('/users/profile/'),
}

// ── Categories ────────────────────────────────────────────────────────────────
export const categoriesAPI = {
  getAll: ()           => api.get('/categories/'),
  create: (data)       => api.post('/categories/', data),
  update: (id, data)   => api.put(`/categories/${id}/`, data),
  delete: (id)         => api.delete(`/categories/${id}/`),
}

// ── Transactions ──────────────────────────────────────────────────────────────
export const transactionsAPI = {
  getAll: (params)     => api.get('/transactions/', { params }),
  create: (data)       => api.post('/transactions/', data),
  update: (id, data)   => api.put(`/transactions/${id}/`, data),
  delete: (id)         => api.delete(`/transactions/${id}/`),
}
