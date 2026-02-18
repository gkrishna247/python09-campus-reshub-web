import SchoolIcon from '@mui/icons-material/School'
import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'

function AuthLayout() {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      sx={{ background: 'linear-gradient(180deg, rgba(25,118,210,0.08), rgba(0,137,123,0.08))' }}
    >
      <Card sx={{ width: '100%', maxWidth: 460 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={3}>
            <SchoolIcon color="primary" />
            <Typography variant="h5" fontWeight={700}>
              Campus ResHub
            </Typography>
          </Stack>
          <Outlet />
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuthLayout
