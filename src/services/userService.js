import api from './api'

export async function getUsers(params) {
  const response = await api.get('/users/', { params })
  return response.data
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}/`)
  return response.data
}

export async function updateUser(id, data) {
  const response = await api.put(`/users/${id}/`, data)
  return response.data
}

export async function deleteUser(id) {
  const response = await api.delete(`/users/${id}/`)
  return response.data
}

export async function getProfile() {
  const response = await api.get('/profile/')
  return response.data
}

export async function updateProfile(data) {
  const response = await api.patch('/profile/', data)
  return response.data
}

export async function changePassword(data) {
  const response = await api.post('/profile/change-password/', data)
  return response.data
}

export async function getPendingRegistrations(params) {
  const response = await api.get('/approvals/registrations/', { params })
  return response.data
}

export async function approveRegistration(id) {
  const response = await api.post(`/approvals/registrations/${id}/approve/`)
  return response.data
}

export async function rejectRegistration(id, rejection_reason) {
  const response = await api.post(`/approvals/registrations/${id}/reject/`, { rejection_reason })
  return response.data
}

export async function getRoleChangeRequests(params) {
  const response = await api.get('/role-changes/list/', { params })
  return response.data
}

export async function getMyRoleChangeRequests() {
  const response = await api.get('/role-changes/my/')
  return response.data
}

export async function requestRoleChange(requested_role) {
  const response = await api.post('/role-changes/', { requested_role })
  return response.data
}

export async function approveRoleChange(id) {
  const response = await api.post(`/role-changes/${id}/approve/`)
  return response.data
}

export async function rejectRoleChange(id, rejection_reason) {
  const response = await api.post(`/role-changes/${id}/reject/`, { rejection_reason })
  return response.data
}
