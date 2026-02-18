import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import SlotGrid from '../../components/bookings/SlotGrid'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import NotFoundPage from '../errors/NotFoundPage'
import { deleteResource, getResourceAvailability, getResourceById, updateResource } from '../../services/resourceService'
import { useAuth } from '../../hooks/useAuth'
import { useSnackbar } from '../../hooks/useSnackbar'

function ResourceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const showSnackbar = useSnackbar()
  const [resource, setResource] = useState(null)
  const [availability, setAvailability] = useState({ slots: [], is_working_day: true })
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10))
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [form, setForm] = useState(null)

  const loadResource = async () => {
    try {
      const response = await getResourceById(id)
      const data = response?.data || response
      setResource(data)
      setForm(data)
    } catch (error) {
      if (error?.status_code === 404 || error?.status === 404) setNotFound(true)
    }
  }

  const loadAvailability = async (dateValue) => {
    try {
      const response = await getResourceAvailability(id, dateValue)
      setAvailability(response?.data || response)
    } catch {
      setAvailability({ slots: [], is_working_day: false })
    }
  }

  useEffect(() => {
    setIsLoading(true)
    Promise.all([loadResource(), loadAvailability(selectedDate)]).finally(() => setIsLoading(false))
  }, [id])

  useEffect(() => {
    loadAvailability(selectedDate)
  }, [selectedDate])

  if (notFound) return <NotFoundPage />
  if (isLoading || !resource) return <LoadingSpinner text="Loading resource details..." />

  const handleUpdate = async () => {
    try {
      await updateResource(id, form)
      showSnackbar('Resource updated successfully.', 'success')
      setOpenEdit(false)
      await loadResource()
    } catch (error) {
      showSnackbar(error.message || 'Failed to update resource.', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteResource(id)
      showSnackbar('Resource deleted successfully.', 'success')
      navigate('/resources')
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete resource.', 'error')
    }
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={1}>{resource.name}</Typography>
          <Stack direction="row" spacing={1} mb={2} flexWrap="wrap" useFlexGap>
            <Chip label={resource.type} />
            <Chip label={resource.resource_status} color={resource.resource_status === 'AVAILABLE' ? 'success' : 'error'} />
            <Chip label={resource.approval_type} />
          </Stack>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}><Typography>Capacity: {resource.capacity}</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Typography>Total Quantity: {resource.total_quantity}</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Typography>Location: {resource.location || 'N/A'}</Typography></Grid>
            <Grid size={{ xs: 12, sm: 6 }}><Typography>Managed By: {resource.managed_by?.name || 'N/A'}</Typography></Grid>
            <Grid size={{ xs: 12 }}><Typography>Description: {resource.description || 'N/A'}</Typography></Grid>
          </Grid>
          {user.role === 'ADMIN' ? (
            <Stack direction="row" spacing={1} mt={2}>
              <Button variant="outlined" onClick={() => setOpenEdit(true)}>Edit Resource</Button>
              <Button variant="outlined" color="error" onClick={() => setOpenDelete(true)}>Delete Resource</Button>
              <Button variant="contained" onClick={() => navigate(`/admin/schedule/${resource.id}`)}>Manage Schedule</Button>
            </Stack>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <Box mt={2}>
            <SlotGrid
              slots={availability.slots || []}
              resourceId={resource.id}
              resourceName={resource.name}
              date={selectedDate}
              totalQuantity={resource.total_quantity}
              isWorkingDay={Boolean(availability.is_working_day)}
              onBookingCreated={() => loadAvailability(selectedDate)}
            />
          </Box>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="md">
        <DialogTitle>Edit Resource</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} mt={0.5}>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="Name" value={form?.name || ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Type" value={form?.type || 'LAB'} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}><MenuItem value="LAB">LAB</MenuItem><MenuItem value="CLASSROOM">CLASSROOM</MenuItem><MenuItem value="EVENT_HALL">EVENT_HALL</MenuItem></TextField></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth type="number" label="Capacity" value={form?.capacity || 0} onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth type="number" label="Total Quantity" value={form?.total_quantity || 1} onChange={(e) => setForm((p) => ({ ...p, total_quantity: Number(e.target.value) }))} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Location" value={form?.location || ''} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12 }}><TextField fullWidth label="Description" value={form?.description || ''} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? All future bookings will be automatically cancelled."
        confirmText="Delete"
        severity="error"
      />
    </Stack>
  )
}

export default ResourceDetailPage
