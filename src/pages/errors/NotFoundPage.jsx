import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box minHeight="70vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" px={2}>
      <Typography variant="h1" fontWeight={700} color="primary.main">404</Typography>
      <Typography variant="h4" gutterBottom>Page Not Found</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        The page you're looking for doesn't exist or has been moved.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </Box>
  )
}

export default NotFoundPage
