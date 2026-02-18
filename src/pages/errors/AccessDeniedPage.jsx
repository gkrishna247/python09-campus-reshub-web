import LockIcon from '@mui/icons-material/Lock'
import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function AccessDeniedPage() {
  const navigate = useNavigate()

  return (
    <Box minHeight="70vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" px={2}>
      <LockIcon color="error" sx={{ fontSize: 56, mb: 1 }} />
      <Typography variant="h1" fontWeight={700} color="error.main">403</Typography>
      <Typography variant="h4" gutterBottom>Access Denied</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        You don't have permission to access this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </Box>
  )
}

export default AccessDeniedPage
