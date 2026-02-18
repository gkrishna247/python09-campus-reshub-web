import PropTypes from 'prop-types'
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import AppHeader from '../components/layout/AppHeader'
import Sidebar from '../components/layout/Sidebar'

const SIDEBAR_WIDTH = 260

function DashboardLayout({ themeMode, onToggleTheme }) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'))
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleToggleSidebar = () => setMobileOpen((prev) => !prev)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppHeader onMenuClick={handleToggleSidebar} themeMode={themeMode} onToggleTheme={onToggleTheme} />
      <Sidebar
        drawerWidth={SIDEBAR_WIDTH}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isDesktop={isDesktop}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: isDesktop ? `${SIDEBAR_WIDTH}px` : 0,
          width: isDesktop ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

DashboardLayout.propTypes = {
  themeMode: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
}

export default DashboardLayout
