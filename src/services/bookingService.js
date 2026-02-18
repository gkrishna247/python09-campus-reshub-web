import api from './api'

export async function getMyBookings(params) {
  const response = await api.get('/bookings/', { params })
  return response.data
}

export async function getAllBookings(params) {
  const response = await api.get('/bookings/all/', { params })
  return response.data
}

export async function getPendingBookings(params) {
  const response = await api.get('/bookings/pending/', { params })
  return response.data
}

export async function createBooking(data) {
  const response = await api.post('/bookings/', data)
  return response.data
}

export async function approveBooking(id) {
  const response = await api.post(`/bookings/${id}/approve/`)
  return response.data
}

export async function rejectBooking(id, rejection_reason) {
  const response = await api.post(`/bookings/${id}/reject/`, { rejection_reason })
  return response.data
}

export async function cancelBooking(id, cancellation_reason) {
  const response = await api.post(`/bookings/${id}/cancel/`, { cancellation_reason })
  return response.data
}
