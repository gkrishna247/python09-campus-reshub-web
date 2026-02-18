import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import * as authService from '../services/authService'
import { setApiAuthHandlers } from '../services/api'

const AuthContext = createContext(null)

function decodeTokenPayload(token) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(atob(base64Payload))
    return payload
  } catch {
    return null
  }
}

function buildUserFromPayload(payload) {
  if (!payload) return null
  return {
    id: payload.user_id,
    email: payload.email,
    name: payload.name || payload.email,
    role: payload.role,
    account_status: payload.account_status,
    approval_status: payload.approval_status,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'))
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'))
  const [isLoading, setIsLoading] = useState(true)

  const clearAuth = useCallback(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
    setAccessToken(null)
    setRefreshToken(null)
  }, [])

  const logout = useCallback(async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (refresh) {
      try {
        await authService.logout(refresh)
      } catch {
        // best effort
      }
    }
    clearAuth()
    window.location.assign('/login')
  }, [clearAuth])

  const refreshAccessToken = useCallback(async () => {
    const storedRefreshToken = localStorage.getItem('refresh_token')
    if (!storedRefreshToken) {
      clearAuth()
      return null
    }
    try {
      const response = await authService.refreshToken(storedRefreshToken)
      const newAccessToken = response?.data?.access || response?.access
      if (!newAccessToken) throw new Error('Missing refreshed token')
      localStorage.setItem('access_token', newAccessToken)
      setAccessToken(newAccessToken)
      const payload = decodeTokenPayload(newAccessToken)
      setUser((prev) => ({ ...buildUserFromPayload(payload), name: prev?.name || payload?.email }))
      return newAccessToken
    } catch {
      await logout()
      return null
    }
  }, [clearAuth, logout])

  const login = useCallback(async (email, password) => {
    const response = await authService.login(email, password)
    const responseData = response?.data || response
    const { access, refresh, user: userData } = responseData

    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
    setAccessToken(access)
    setRefreshToken(refresh)
    setUser(userData)
    return userData
  }, [])

  const register = useCallback(async (data) => {
    return authService.register(data)
  }, [])

  useEffect(() => {
    setApiAuthHandlers({ onRefresh: refreshAccessToken, onLogout: clearAuth })
  }, [refreshAccessToken, clearAuth])

  useEffect(() => {
    const initializeAuth = async () => {
      const storedAccessToken = localStorage.getItem('access_token')
      const storedRefreshToken = localStorage.getItem('refresh_token')

      if (!storedAccessToken) {
        setIsLoading(false)
        return
      }

      const payload = decodeTokenPayload(storedAccessToken)
      const nowInSeconds = Math.floor(Date.now() / 1000)
      const isExpired = !payload?.exp || payload.exp <= nowInSeconds

      if (isExpired && storedRefreshToken) {
        await refreshAccessToken()
      } else if (payload) {
        setUser(buildUserFromPayload(payload))
        setAccessToken(storedAccessToken)
        setRefreshToken(storedRefreshToken)
      } else {
        clearAuth()
      }

      setIsLoading(false)
    }

    initializeAuth()
  }, [refreshAccessToken, clearAuth])

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isLoading,
      isAuthenticated: Boolean(user && accessToken),
      login,
      register,
      logout,
      refreshAccessToken,
      setUser,
    }),
    [user, accessToken, refreshToken, isLoading, login, register, logout, refreshAccessToken],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export { AuthContext }
