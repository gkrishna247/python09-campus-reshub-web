import { useEffect, useState } from 'react'
import {
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteUser, getUserById, updateUser } from '../../services/userService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import NotFoundPage from '../errors/NotFoundPage'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useSnackbar } from '../../hooks/useSnackbar'

function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showSnackbar = useSnackbar()
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const loadUser = async () => {
    setIsLoading(true)
    try {
      const response = await getUserById(id)
      const data = response?.data || response
      setUser(data)
      setForm(data)
    } catch (error) {
      if (error?.status === 404 || error?.status_code === 404) setNotFound(true)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUser()
  }, [id])

  if (notFound) return <NotFoundPage />
  if (isLoading || !form) return <LoadingSpinner text="Loading user details..." />

  const handleSave = async () => {
    try {
      await updateUser(id, {
        name: form.name,
        phone: form.phone,
        role: form.role,
        account_status: form.account_status,
        approval_status: form.approval_status,
        rejection_reason: form.approval_status === 'REJECTED' ? form.rejection_reason : null,
      })
      showSnackbar('User updated successfully.', 'success')
      loadUser()
    } catch (error) {
      showSnackbar(error.message || 'Failed to update user.', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUser(id)
      showSnackbar('User deleted successfully.', 'success')
      navigate('/admin/users')
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete user.', 'error')
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h6">User Details</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Email" value={form.email} InputProps={{ readOnly: true }} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Name" value={form.name || ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Phone" value={form.phone || ''} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Role" value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}><MenuItem value="STUDENT">STUDENT</MenuItem><MenuItem value="FACULTY">FACULTY</MenuItem><MenuItem value="STAFF">STAFF</MenuItem><MenuItem value="ADMIN">ADMIN</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Account Status" value={form.account_status} onChange={(e) => setForm((p) => ({ ...p, account_status: e.target.value }))}><MenuItem value="ACTIVE">ACTIVE</MenuItem><MenuItem value="INACTIVE">INACTIVE</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Approval Status" value={form.approval_status} onChange={(e) => setForm((p) => ({ ...p, approval_status: e.target.value }))}><MenuItem value="PENDING">PENDING</MenuItem><MenuItem value="APPROVED">APPROVED</MenuItem><MenuItem value="REJECTED">REJECTED</MenuItem></TextField></Grid>
          {form.approval_status === 'REJECTED' ? <Grid size={{ xs: 12 }}><TextField fullWidth label="Rejection Reason" value={form.rejection_reason || ''} onChange={(e) => setForm((p) => ({ ...p, rejection_reason: e.target.value }))} /></Grid> : null}
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Created At" value={form.created_at || ''} InputProps={{ readOnly: true }} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Updated At" value={form.updated_at || ''} InputProps={{ readOnly: true }} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Last Login" value={form.last_login || ''} InputProps={{ readOnly: true }} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Email Verified" value={String(form.is_email_verified)} InputProps={{ readOnly: true }} /></Grid>
        </Grid>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={handleSave}>Save Changes</Button>
          <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)}>Delete User</Button>
          <Button variant="outlined" onClick={() => navigate('/admin/users')}>Back</Button>
        </Stack>
      </Stack>
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        severity="error"
      />
    </Paper>
  )
}

export default UserDetailPage
