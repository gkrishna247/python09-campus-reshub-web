import PropTypes from 'prop-types'
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import NotificationBell from './NotificationBell'
import { useAuth } from '../../hooks/useAuth'

function AppHeader({ onMenuClick, themeMode, onToggleTheme }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <AppBar position="fixed" sx={{ zIndex: (muiTheme) => muiTheme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center" gap={1}>
          {!isDesktop ? (
            <IconButton edge="start" color="inherit" onClick={onMenuClick}>
              <MenuIcon />
            </IconButton>
          ) : null}
          <Typography variant="h6" fontWeight={700}>
            Campus ResHub
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <ThemeToggle mode={themeMode} onToggle={onToggleTheme} />
          <NotificationBell />
          <IconButton color="inherit" onClick={(event) => setAnchorEl(event.currentTarget)}>
            <Avatar sx={{ width: 32, height: 32 }}>{(user?.name || 'U').slice(0, 1).toUpperCase()}</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

AppHeader.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  themeMode: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}

export default AppHeader
