import PropTypes from 'prop-types'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import ApprovalLayout from '../layouts/ApprovalLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import RouteGuard from './RouteGuard'
import RoleRoute from './RoleRoute'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ApprovalStatusPage from '../pages/approval/ApprovalStatusPage'
import ProfilePage from '../pages/profile/ProfilePage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import ResourceListPage from '../pages/resources/ResourceListPage'
import ResourceDetailPage from '../pages/resources/ResourceDetailPage'
import MyBookingsPage from '../pages/bookings/MyBookingsPage'
import BookingCreateDialogPage from '../pages/bookings/BookingCreateDialog'
import UserManagementPage from '../pages/admin/UserManagementPage'
import UserDetailPage from '../pages/admin/UserDetailPage'
import ApprovalsPage from '../pages/admin/ApprovalsPage'
import AuditLogPage from '../pages/admin/AuditLogPage'
import StatisticsPage from '../pages/admin/StatisticsPage'
import CalendarOverridePage from '../pages/admin/CalendarOverridePage'
import ScheduleManagementPage from '../pages/admin/ScheduleManagementPage'
import StaffResourcesPage from '../pages/staff/StaffResourcesPage'
import StaffBookingApprovalsPage from '../pages/staff/StaffBookingApprovalsPage'
import RequestResourcePage from '../pages/staff/RequestResourcePage'
import NotFoundPage from '../pages/errors/NotFoundPage'
import AccessDeniedPage from '../pages/errors/AccessDeniedPage'
import { useAuth } from '../hooks/useAuth'

function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}

function AppRoutes({ themeMode, onToggleTheme }) {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<RouteGuard />}>
        <Route element={<ApprovalLayout />}>
          <Route path="/approval-status" element={<ApprovalStatusPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route element={<DashboardLayout themeMode={themeMode} onToggleTheme={onToggleTheme} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/resources" element={<ResourceListPage />} />
          <Route path="/resources/:id" element={<ResourceDetailPage />} />

          <Route element={<RoleRoute allowedRoles={['STUDENT', 'FACULTY', 'ADMIN']} />}>
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/bookings/new" element={<BookingCreateDialogPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/users/:id" element={<UserDetailPage />} />
            <Route path="/admin/audit-logs" element={<AuditLogPage />} />
            <Route path="/admin/statistics" element={<StatisticsPage />} />
            <Route path="/admin/calendar" element={<CalendarOverridePage />} />
            <Route path="/admin/schedule/:resourceId" element={<ScheduleManagementPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN', 'FACULTY']} />}>
            <Route path="/admin/approvals" element={<ApprovalsPage />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['STAFF']} />}>
            <Route path="/staff/resources" element={<StaffResourcesPage />} />
            <Route path="/staff/bookings" element={<StaffBookingApprovalsPage />} />
            <Route path="/staff/request-resource" element={<RequestResourcePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route element={<Outlet />} />
    </Routes>
  )
}

AppRoutes.propTypes = {
  themeMode: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}

export default AppRoutes
