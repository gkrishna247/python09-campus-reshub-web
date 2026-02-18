import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useAuth } from '../../hooks/useAuth'
import { changePassword, getMyRoleChangeRequests, requestRoleChange, updateProfile } from '../../services/userService'
import PasswordChecklist from '../../components/common/PasswordChecklist'
import { isPasswordValid } from '../../utils/validators'
import { useSnackbar } from '../../hooks/useSnackbar'
import { formatDateTime } from '../../utils/formatters'

function ProfilePage() {
  const { user, setUser } = useAuth()
  const showSnackbar = useSnackbar()
  const [isEditing, setIsEditing] = useState(false)
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', confirm_password: '' })
  const [roleRequests, setRoleRequests] = useState([])
  const [requestedRole, setRequestedRole] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.approval_status === 'APPROVED' && user?.role !== 'ADMIN') {
      getMyRoleChangeRequests()
        .then((response) => setRoleRequests(response?.data?.results || response?.data || []))
        .catch(() => setRoleRequests([]))
    }
  }, [user])

  const availableRoleOptions = useMemo(
    () => ['STUDENT', 'FACULTY', 'STAFF'].filter((role) => role !== user?.role),
    [user?.role],
  )

  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name: profileForm.name, phone: profileForm.phone })
      setUser((prev) => ({ ...prev, ...profileForm }))
      setIsEditing(false)
      showSnackbar('Profile updated.', 'success')
    } catch (apiError) {
      showSnackbar(apiError.message || 'Failed to update profile.', 'error')
    }
  }

  const handleChangePassword = async () => {
    try {
      await changePassword(passwordForm)
      setPasswordForm({ current_password: '', new_password: '', confirm_password: '' })
      showSnackbar('Password changed.', 'success')
    } catch (apiError) {
      showSnackbar(apiError.message || 'Failed to change password.', 'error')
    }
  }

  const handleRequestRole = async () => {
    try {
      await requestRoleChange(requestedRole)
      const refreshed = await getMyRoleChangeRequests()
      setRoleRequests(refreshed?.data?.results || refreshed?.data || [])
      setRequestedRole('')
      showSnackbar('Role change request submitted.', 'success')
    } catch (apiError) {
      showSnackbar(apiError.message || 'Failed to request role change.', 'error')
    }
  }

  return (
    <Stack spacing={3}>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6">Profile Information</Typography>
          <TextField
            label="Name"
            value={profileForm.name}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
            InputProps={{ readOnly: !isEditing || user.approval_status !== 'APPROVED' }}
          />
          <Tooltip title="Email cannot be changed">
            <TextField
              label="Email"
              value={user.email}
              InputProps={{ readOnly: true, endAdornment: <LockIcon color="disabled" fontSize="small" /> }}
            />
          </Tooltip>
          <TextField
            label="Phone"
            value={profileForm.phone || ''}
            onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
            InputProps={{ readOnly: !isEditing || user.approval_status !== 'APPROVED' }}
          />
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip label={`Role: ${user.role}`} />
            <Chip label={`Account: ${user.account_status}`} color={user.account_status === 'ACTIVE' ? 'success' : 'error'} />
            <Chip label={`Approval: ${user.approval_status}`} color={user.approval_status === 'APPROVED' ? 'success' : user.approval_status === 'REJECTED' ? 'error' : 'warning'} />
          </Stack>
          {user.approval_status === 'APPROVED' ? (
            <Stack direction="row" spacing={1}>
              {!isEditing ? (
                <Button variant="outlined" onClick={() => setIsEditing(true)}>Edit</Button>
              ) : (
                <>
                  <Button variant="contained" onClick={handleSaveProfile}>Save</Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsEditing(false)
                      setProfileForm({ name: user.name, phone: user.phone || '' })
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Stack>
          ) : null}
        </Stack>
      </Paper>

      {user.approval_status === 'APPROVED' ? (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Change Password</Typography>
            <TextField
              type="password"
              label="Current Password"
              value={passwordForm.current_password}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, current_password: event.target.value }))
              }
            />
            <TextField
              type="password"
              label="New Password"
              value={passwordForm.new_password}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, new_password: event.target.value }))}
            />
            <PasswordChecklist
              password={passwordForm.new_password}
              confirmPassword={passwordForm.confirm_password}
            />
            <TextField
              type="password"
              label="Confirm Password"
              value={passwordForm.confirm_password}
              onChange={(event) =>
                setPasswordForm((prev) => ({ ...prev, confirm_password: event.target.value }))
              }
            />
            <Button
              variant="contained"
              onClick={handleChangePassword}
              disabled={
                !passwordForm.current_password ||
                !isPasswordValid(passwordForm.new_password) ||
                passwordForm.new_password !== passwordForm.confirm_password
              }
            >
              Change Password
            </Button>
          </Stack>
        </Paper>
      ) : null}

      {user.approval_status === 'APPROVED' && user.role !== 'ADMIN' ? (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h6">Role Change Request</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <TextField
                select
                label="Requested Role"
                value={requestedRole}
                onChange={(event) => setRequestedRole(event.target.value)}
                fullWidth
              >
                {availableRoleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="contained" onClick={handleRequestRole} disabled={!requestedRole}>
                Request Role Change
              </Button>
            </Stack>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Current Role</TableCell>
                  <TableCell>Requested Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Rejection Reason</TableCell>
                  <TableCell>Requested At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roleRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{request.current_role}</TableCell>
                    <TableCell>{request.requested_role}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.status}
                        color={
                          request.status === 'APPROVED'
                            ? 'success'
                            : request.status === 'REJECTED'
                              ? 'error'
                              : 'warning'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{request.rejection_reason || '-'}</TableCell>
                    <TableCell>{formatDateTime(request.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  )
}

export default ProfilePage
