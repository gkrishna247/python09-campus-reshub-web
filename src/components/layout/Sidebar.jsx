import PropTypes from 'prop-types'
import { Box, Divider, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import EventNoteIcon from '@mui/icons-material/EventNote'
import PersonIcon from '@mui/icons-material/Person'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import AddBusinessIcon from '@mui/icons-material/AddBusiness'
import PeopleIcon from '@mui/icons-material/People'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import InsightsIcon from '@mui/icons-material/Insights'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const roleMenus = {
  STUDENT: [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Resources', path: '/resources', icon: <MeetingRoomIcon /> },
    { label: 'My Bookings', path: '/bookings', icon: <EventNoteIcon /> },
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ],
  FACULTY: [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Resources', path: '/resources', icon: <MeetingRoomIcon /> },
    { label: 'My Bookings', path: '/bookings', icon: <EventNoteIcon /> },
    { label: 'Approvals', path: '/admin/approvals', icon: <HowToRegIcon /> },
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ],
  STAFF: [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'My Resources', path: '/staff/resources', icon: <MeetingRoomIcon /> },
    { label: 'Booking Approvals', path: '/staff/bookings', icon: <FactCheckIcon /> },
    { label: 'Request Resource', path: '/staff/request-resource', icon: <AddBusinessIcon /> },
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Users', path: '/admin/users', icon: <PeopleIcon /> },
    { label: 'Resources', path: '/resources', icon: <MeetingRoomIcon /> },
    { label: 'All Bookings', path: '/bookings', icon: <EventNoteIcon /> },
    { label: 'Approvals', path: '/admin/approvals', icon: <HowToRegIcon /> },
    { label: 'Calendar', path: '/admin/calendar', icon: <CalendarMonthIcon /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <ReceiptLongIcon /> },
    { label: 'Statistics', path: '/admin/statistics', icon: <InsightsIcon /> },
    { label: 'Profile', path: '/profile', icon: <PersonIcon /> },
  ],
}

function Sidebar({ drawerWidth, mobileOpen, onClose, isDesktop }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const items = roleMenus[user?.role] || []

  const content = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <Divider />
      <List>
        {items.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)}
            onClick={() => {
              navigate(item.path)
              onClose()
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )

  if (isDesktop) {
    return (
      <Drawer variant="permanent" open sx={{ width: drawerWidth, '& .MuiDrawer-paper': { width: drawerWidth } }}>
        {content}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="temporary"
      open={mobileOpen}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
    >
      {content}
    </Drawer>
  )
}

Sidebar.propTypes = {
  drawerWidth: PropTypes.number.isRequired,
  mobileOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isDesktop: PropTypes.bool.isRequired,
}

export default Sidebar
