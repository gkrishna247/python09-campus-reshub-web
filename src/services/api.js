import axios from 'axios'

let refreshHandler = null
let logoutHandler = null

export function setApiAuthHandlers({ onRefresh, onLogout }) {
  refreshHandler = onRefresh
  logoutHandler = onLogout
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const url = originalRequest?.url || ''
    const isAuthEndpoint = url.includes('/auth/login/') || url.includes('/auth/token/refresh/')

    if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true
      if (refreshHandler) {
        const newAccessToken = await refreshHandler()
        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return api(originalRequest)
        }
      }
      if (logoutHandler) {
        logoutHandler()
      }
      window.location.assign('/login')
    }

    const normalizedError = error.response?.data || {
      status: 'error',
      message: 'Network error. Please check your connection.',
      errors: [],
    }

    return Promise.reject(normalizedError)
  },
)

export default api
