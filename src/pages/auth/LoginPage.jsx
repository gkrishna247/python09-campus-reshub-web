import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const user = await auth.login(email, password)
      if (user.approval_status === 'APPROVED') {
        navigate('/dashboard')
      } else {
        navigate('/approval-status')
      }
    } catch (apiError) {
      const message = apiError.message || ''
      if (message.toLowerCase().includes('inactive')) {
        setError('Account is inactive')
      } else {
        setError('Invalid email or password.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Sign In
      </Typography>
      <Stack spacing={2}>
        <TextField required type="email" label="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
        <TextField
          required
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword((prev) => !prev)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
        </Button>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Typography variant="body2" textAlign="center">
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/register">
            Register
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}

export default LoginPage
