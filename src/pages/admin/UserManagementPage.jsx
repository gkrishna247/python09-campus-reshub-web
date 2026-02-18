import { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'
import { deleteUser, getUsers } from '../../services/userService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { useSnackbar } from '../../hooks/useSnackbar'
import { formatDateTime } from '../../utils/formatters'

function UserManagementPage() {
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [filters, setFilters] = useState({ search: '', status: '', role: '' })
  const [confirmDelete, setConfirmDelete] = useState(null)
  const navigate = useNavigate()
  const showSnackbar = useSnackbar()

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await getUsers({ ...filters, page: page + 1 })
      const data = response?.data || response
      setUsers(data.results || [])
      setCount(data.count || 0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300)
    return () => clearTimeout(timer)
  }, [filters, page])

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDelete.id)
      showSnackbar('User deleted successfully.', 'success')
      setConfirmDelete(null)
      fetchUsers()
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete user.', 'error')
    }
  }

  if (isLoading) return <LoadingSpinner text="Loading users..." />

  return (
    <Box>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} mb={2}>
        <TextField
          fullWidth
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
        />
        <TextField select label="Account Status" value={filters.status} onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
        </TextField>
        <TextField select label="Role" value={filters.role} onChange={(event) => setFilters((prev) => ({ ...prev, role: event.target.value }))}>
          <MenuItem value="">All Roles</MenuItem>
          <MenuItem value="STUDENT">Student</MenuItem>
          <MenuItem value="FACULTY">Faculty</MenuItem>
          <MenuItem value="STAFF">Staff</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
        </TextField>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Account Status</TableCell>
              <TableCell>Approval Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell><Chip label={user.role} size="small" /></TableCell>
                <TableCell><Chip label={user.account_status} size="small" color={user.account_status === 'ACTIVE' ? 'success' : 'error'} /></TableCell>
                <TableCell><Chip label={user.approval_status} size="small" /></TableCell>
                <TableCell>{formatDateTime(user.created_at)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/admin/users/${user.id}`)}><VisibilityIcon /></IconButton>
                  <IconButton color="error" onClick={() => setConfirmDelete(user)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={10}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPageOptions={[10]}
      />

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        severity="error"
      />
    </Box>
  )
}

export default UserManagementPage
