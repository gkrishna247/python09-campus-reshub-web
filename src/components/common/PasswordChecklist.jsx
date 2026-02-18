import PropTypes from 'prop-types'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import { Box, Stack, Typography } from '@mui/material'
import { validatePassword } from '../../utils/validators'

function Rule({ ok, text }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {ok ? <CheckCircleIcon color="success" fontSize="small" /> : <CancelIcon color="error" fontSize="small" />}
      <Typography variant="body2">{text}</Typography>
    </Stack>
  )
}

Rule.propTypes = {
  ok: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
}

function PasswordChecklist({ password, confirmPassword }) {
  const checks = validatePassword(password)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  return (
    <Box mt={1}>
      <Rule ok={checks.hasMinLength} text="At least 8 characters" />
      <Rule ok={checks.hasUppercase} text="At least 1 uppercase letter" />
      <Rule ok={checks.hasLowercase} text="At least 1 lowercase letter" />
      <Rule ok={checks.hasDigit} text="At least 1 digit" />
      <Rule ok={checks.hasSpecialChar} text="At least 1 special character (!@#$%^&* etc.)" />
      <Rule ok={Boolean(passwordsMatch)} text="Passwords match" />
    </Box>
  )
}

PasswordChecklist.propTypes = {
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string,
}

PasswordChecklist.defaultProps = {
  confirmPassword: '',
}

export default PasswordChecklist
