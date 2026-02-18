import api from './api'

export async function getStatistics(range) {
  const response = await api.get('/statistics/', { params: { range } })
  return response.data
}
