import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function ApprovalLayout() {
  const { logout } = useAuth()

  return (
    <Box minHeight="100vh">
      <AppBar position="static">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>
            Campus ResHub
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box maxWidth={600} mx="auto" px={2} py={4}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default ApprovalLayout
