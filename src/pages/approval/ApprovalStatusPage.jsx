import { useEffect, useState } from 'react'
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getApprovalStatus } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function ApprovalStatusPage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { logout } = useAuth()

  const fetchStatus = async () => {
    setIsLoading(true)
    setError('')
    try {
      const response = await getApprovalStatus()
      setData(response?.data || response)
    } catch (apiError) {
      setError(apiError.message || 'Unable to load approval status.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  if (isLoading) return <LoadingSpinner text="Fetching approval status..." />

  const status = data?.approval_status

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={700}>
            Approval Status
          </Typography>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Chip
            label={status}
            color={status === 'APPROVED' ? 'success' : status === 'REJECTED' ? 'error' : 'warning'}
            sx={{ width: 'fit-content' }}
          />
          <Typography>Name: {data?.name}</Typography>
          <Typography>Email: {data?.email}</Typography>
          <Typography>Role: {data?.role}</Typography>

          {status === 'PENDING' ? (
            <>
              <Typography>
                Your registration is pending approval. An authorized user will review your application shortly.
                Please check back later.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={fetchStatus}>
                  Refresh Status
                </Button>
                <Button variant="outlined" onClick={logout}>
                  Logout
                </Button>
              </Stack>
            </>
          ) : null}

          {status === 'APPROVED' ? (
            <>
              <Typography>Your account has been approved! You now have full access to the system.</Typography>
              <Button variant="contained" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
            </>
          ) : null}

          {status === 'REJECTED' ? (
            <>
              <Typography>Your registration was rejected.</Typography>
              <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                <Typography variant="body2">{data?.rejection_reason || 'No reason provided.'}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Contact Administrator if you need further assistance.
              </Typography>
              <Button variant="outlined" onClick={logout}>
                Logout
              </Button>
            </>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default ApprovalStatusPage
