import PropTypes from 'prop-types'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RoleRoute({ allowedRoles }) {
  const { user } = useAuth()
  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />
  }
  return <Navigate to="/access-denied" replace />
}

RoleRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default RoleRoute
