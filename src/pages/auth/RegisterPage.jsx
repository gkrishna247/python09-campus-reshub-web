import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import PasswordChecklist from '../../components/common/PasswordChecklist'
import { validatePassword } from '../../utils/validators'

function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'STUDENT',
    password: '',
    confirm_password: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const checks = useMemo(() => validatePassword(form.password), [form.password])
  const passwordsMatch = Boolean(form.password && form.confirm_password && form.password === form.confirm_password)
  const canSubmit =
    form.name &&
    form.email &&
    form.role &&
    Object.values(checks).every(Boolean) &&
    passwordsMatch

  const onChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)
    try {
      const response = await auth.register(form)
      const approvalStatus = response?.data?.approval_status || response?.data?.data?.approval_status || 'PENDING'
      if (approvalStatus === 'APPROVED' || form.email.endsWith('@ksrct.net')) {
        setSuccess('Registration successful! Your account has been auto-approved. Redirecting to login...')
      } else {
        setSuccess('Registration successful! Your account is pending approval. Redirecting to login...')
      }
      setTimeout(() => navigate('/login'), 3000)
    } catch (apiError) {
      setError(apiError.message || 'Registration failed. Please check form values.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Create Account
      </Typography>
      <Stack spacing={2}>
        <TextField required label="Name" value={form.name} onChange={(event) => onChange('name', event.target.value)} />
        <TextField required type="email" label="Email" value={form.email} onChange={(event) => onChange('email', event.target.value)} />
        <TextField label="Phone" value={form.phone} onChange={(event) => onChange('phone', event.target.value)} />
        <TextField select required label="Role" value={form.role} onChange={(event) => onChange('role', event.target.value)}>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="FACULTY">Faculty</MenuItem>
          <MenuItem value="STAFF">Staff</MenuItem>
        </TextField>
        <TextField
          required
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={form.password}
          onChange={(event) => onChange('password', event.target.value)}
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
        <PasswordChecklist password={form.password} confirmPassword={form.confirm_password} />
        <TextField
          required
          type={showConfirmPassword ? 'text' : 'password'}
          label="Confirm Password"
          value={form.confirm_password}
          onChange={(event) => onChange('confirm_password', event.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword((prev) => !prev)}>
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button type="submit" fullWidth variant="contained" disabled={!canSubmit || isSubmitting}>
          {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Register'}
        </Button>
        {success ? <Alert severity="success">{success}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Typography variant="body2" textAlign="center">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login">
            Sign In
          </Link>
        </Typography>
      </Stack>
    </Box>
  )
}

export default RegisterPage
