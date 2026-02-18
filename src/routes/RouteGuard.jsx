import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box } from '@mui/material'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

function RouteGuard() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <LoadingSpinner text="Checking authentication..." />
      </Box>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.approval_status !== 'APPROVED') {
    if (location.pathname === '/approval-status' || location.pathname === '/profile') {
      return <Outlet />
    }
    return <Navigate to="/approval-status" replace />
  }

  if (user.account_status !== 'ACTIVE') {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RouteGuard
