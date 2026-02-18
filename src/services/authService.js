import api from './api'

export async function login(email, password) {
  const response = await api.post('/auth/login/', { email, password })
  return response.data
}

export async function register(data) {
  const response = await api.post('/auth/register/', data)
  return response.data
}

export async function refreshToken(refresh) {
  const response = await api.post('/auth/token/refresh/', { refresh })
  return response.data
}

export async function logout(refresh) {
  const response = await api.post('/auth/logout/', { refresh })
  return response.data
}

export async function getApprovalStatus() {
  const response = await api.get('/auth/approval-status/')
  return response.data
}
