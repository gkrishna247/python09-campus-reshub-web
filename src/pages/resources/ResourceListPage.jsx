import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  MenuItem,
  Skeleton,
  TablePagination,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '../../hooks/useAuth'
import { createResource, getResources } from '../../services/resourceService'
import { getUsers } from '../../services/userService'
import ResourceCard from '../../components/resources/ResourceCard'
import ResourceFilters from '../../components/resources/ResourceFilters'
import EmptyState from '../../components/common/EmptyState'
import { useSnackbar } from '../../hooks/useSnackbar'

const defaultForm = {
  name: '',
  type: 'LAB',
  capacity: 0,
  total_quantity: 1,
  location: '',
  description: '',
  resource_status: 'AVAILABLE',
  approval_type: 'AUTO_APPROVE',
  managed_by: '',
}

function ResourceListPage() {
  const { user } = useAuth()
  const showSnackbar = useSnackbar()
  const [filters, setFilters] = useState({ search: '', type: '', min_capacity: '' })
  const [page, setPage] = useState(0)
  const [rowsPerPage] = useState(10)
  const [resources, setResources] = useState([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)
  const [resourceForm, setResourceForm] = useState(defaultForm)
  const [staffUsers, setStaffUsers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const debouncedFilters = useMemo(() => filters, [filters])

  const fetchResources = async () => {
    setIsLoading(true)
    try {
      const response = await getResources({ ...debouncedFilters, page: page + 1 })
      const payload = response?.data || response
      setResources(payload?.results || [])
      setCount(payload?.count || 0)
    } catch {
      setResources([])
      setCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timeout = setTimeout(fetchResources, 300)
    return () => clearTimeout(timeout)
  }, [debouncedFilters, page])

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      getUsers({ role: 'STAFF' }).then((response) => setStaffUsers(response?.data?.results || response?.results || []))
    }
  }, [user])

  const onFilterChange = (field, value) => {
    setPage(0)
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleCreate = async () => {
    setIsSubmitting(true)
    try {
      await createResource({ ...resourceForm, managed_by: Number(resourceForm.managed_by) })
      showSnackbar('Resource created successfully.', 'success')
      setOpenCreate(false)
      setResourceForm(defaultForm)
      fetchResources()
    } catch (error) {
      showSnackbar(error.message || 'Failed to create resource.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box>
      <ResourceFilters filters={filters} onChange={onFilterChange} />

      {isLoading ? (
        <Grid container spacing={2}>
          {[...Array(6)].map((_, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Skeleton variant="rounded" height={220} />
            </Grid>
          ))}
        </Grid>
      ) : resources.length === 0 ? (
        <EmptyState title="No resources found." message="Try changing the search or filter values." />
      ) : (
        <Grid container spacing={2}>
          {resources.map((resource) => (
            <Grid key={resource.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ResourceCard resource={resource} />
            </Grid>
          ))}
        </Grid>
      )}

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[rowsPerPage]}
      />

      {user?.role === 'ADMIN' ? (
        <Fab
          color="primary"
          sx={{ position: 'fixed', right: 24, bottom: 24 }}
          onClick={() => setOpenCreate(true)}
        >
          <AddIcon />
        </Fab>
      ) : null}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="md">
        <DialogTitle>Create Resource</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Name" value={resourceForm.name} onChange={(e) => setResourceForm((p) => ({ ...p, name: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Type" value={resourceForm.type} onChange={(e) => setResourceForm((p) => ({ ...p, type: e.target.value }))}><MenuItem value="LAB">Lab</MenuItem><MenuItem value="CLASSROOM">Classroom</MenuItem><MenuItem value="EVENT_HALL">Event Hall</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth type="number" label="Capacity" value={resourceForm.capacity} onChange={(e) => setResourceForm((p) => ({ ...p, capacity: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth type="number" label="Total Quantity" value={resourceForm.total_quantity} onChange={(e) => setResourceForm((p) => ({ ...p, total_quantity: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Location" value={resourceForm.location} onChange={(e) => setResourceForm((p) => ({ ...p, location: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Description" value={resourceForm.description} onChange={(e) => setResourceForm((p) => ({ ...p, description: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Status" value={resourceForm.resource_status} onChange={(e) => setResourceForm((p) => ({ ...p, resource_status: e.target.value }))}><MenuItem value="AVAILABLE">AVAILABLE</MenuItem><MenuItem value="UNAVAILABLE">UNAVAILABLE</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Approval Type" value={resourceForm.approval_type} onChange={(e) => setResourceForm((p) => ({ ...p, approval_type: e.target.value }))}><MenuItem value="AUTO_APPROVE">AUTO_APPROVE</MenuItem><MenuItem value="STAFF_APPROVE">STAFF_APPROVE</MenuItem><MenuItem value="ADMIN_APPROVE">ADMIN_APPROVE</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12 }}><TextField select fullWidth label="Managed By (Staff)" value={resourceForm.managed_by} onChange={(e) => setResourceForm((p) => ({ ...p, managed_by: e.target.value }))}>{staffUsers.map((staff) => <MenuItem key={staff.id} value={staff.id}>{staff.name} ({staff.email})</MenuItem>)}</TextField></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={isSubmitting} startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ResourceListPage
