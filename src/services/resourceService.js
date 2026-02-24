import api from './api'

export async function getResources(params) {
  const response = await api.get('/resources/', { params })
  return response.data
}

export async function getResourceById(id) {
  const response = await api.get(`/resources/${id}/`)
  return response.data
}

export async function createResource(data) {
  const response = await api.post('/resources/', data)
  return response.data
}

export async function updateResource(id, data) {
  const response = await api.put(`/resources/${id}/`, data)
  return response.data
}

export async function deleteResource(id) {
  const response = await api.delete(`/resources/${id}/`)
  return response.data
}

export async function getResourceSchedule(id) {
  const response = await api.get(`/resources/${id}/schedule/`)
  return response.data
}

export async function updateResourceSchedule(id, data) {
  const response = await api.put(`/resources/${id}/schedule/`, data)
  return response.data
}

export async function getResourceAvailability(id, date) {
  const response = await api.get(`/resources/${id}/availability/`, { params: { date } })
  return response.data
}

export async function getResourceRequests(params) {
  const response = await api.get('/resource-requests/', { params })
  return response.data
}

export async function createResourceRequest(data) {
  const response = await api.post('/resource-requests/create/', data)
  return response.data
}

export async function approveResourceRequest(id) {
  const response = await api.post(`/resource-requests/${id}/approve/`)
  return response.data
}

export async function rejectResourceRequest(id, rejection_reason) {
  const response = await api.post(`/resource-requests/${id}/reject/`, { rejection_reason })
  return response.data
}

export async function getCalendarOverrides() {
  const response = await api.get('/calendar-overrides/')
  return response.data
}

export async function createCalendarOverride(data) {
  const response = await api.post('/calendar-overrides/', data)
  return response.data
}

export async function deleteCalendarOverride(id) {
  const response = await api.delete(`/calendar-overrides/${id}/`)
  return response.data
}
