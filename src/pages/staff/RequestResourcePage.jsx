import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { createResourceRequest, getResourceRequests } from '../../services/resourceService'
import EmptyState from '../../components/common/EmptyState'
import { useSnackbar } from '../../hooks/useSnackbar'
import { formatDateTime } from '../../utils/formatters'

const initialForm = {
  proposed_name: '',
  proposed_type: 'LAB',
  proposed_capacity: 0,
  proposed_total_quantity: 1,
  proposed_location: '',
  proposed_description: '',
  proposed_approval_type: 'AUTO_APPROVE',
  justification: '',
}

function RequestResourcePage() {
  const [form, setForm] = useState(initialForm)
  const [requests, setRequests] = useState([])
  const showSnackbar = useSnackbar()

  const fetchRequests = async () => {
    const response = await getResourceRequests()
    setRequests(response?.data?.results || response?.results || [])
  }

  useEffect(() => { fetchRequests() }, [])

  const handleSubmit = async () => {
    try {
      await createResourceRequest(form)
      showSnackbar('Resource request submitted.', 'success')
      setForm(initialForm)
      fetchRequests()
    } catch (error) {
      showSnackbar(error.message || 'Failed to submit request.', 'error')
    }
  }

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>Submit New Request</Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth required label="Proposed Name" value={form.proposed_name} onChange={(e) => setForm((p) => ({ ...p, proposed_name: e.target.value }))} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth required label="Proposed Type" value={form.proposed_type} onChange={(e) => setForm((p) => ({ ...p, proposed_type: e.target.value }))}><MenuItem value="LAB">LAB</MenuItem><MenuItem value="CLASSROOM">CLASSROOM</MenuItem><MenuItem value="EVENT_HALL">EVENT_HALL</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth required type="number" inputProps={{ min: 0 }} label="Proposed Capacity" value={form.proposed_capacity} onChange={(e) => setForm((p) => ({ ...p, proposed_capacity: Number(e.target.value) }))} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth required type="number" inputProps={{ min: 1 }} label="Proposed Total Quantity" value={form.proposed_total_quantity} onChange={(e) => setForm((p) => ({ ...p, proposed_total_quantity: Number(e.target.value) }))} /></Grid>
          <Grid size={{ xs: 12 }}><TextField fullWidth label="Proposed Location" value={form.proposed_location} onChange={(e) => setForm((p) => ({ ...p, proposed_location: e.target.value }))} /></Grid>
          <Grid size={{ xs: 12 }}><TextField fullWidth multiline rows={3} label="Proposed Description" value={form.proposed_description} onChange={(e) => setForm((p) => ({ ...p, proposed_description: e.target.value }))} /></Grid>
          <Grid size={{ xs: 12, md: 6 }}><TextField select fullWidth label="Proposed Approval Type" value={form.proposed_approval_type} onChange={(e) => setForm((p) => ({ ...p, proposed_approval_type: e.target.value }))}><MenuItem value="AUTO_APPROVE">AUTO_APPROVE</MenuItem><MenuItem value="STAFF_APPROVE">STAFF_APPROVE</MenuItem><MenuItem value="ADMIN_APPROVE">ADMIN_APPROVE</MenuItem></TextField></Grid>
          <Grid size={{ xs: 12 }}><TextField fullWidth required multiline rows={4} label="Justification" value={form.justification} onChange={(e) => setForm((p) => ({ ...p, justification: e.target.value }))} /></Grid>
        </Grid>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleSubmit} disabled={!form.proposed_name || !form.justification.trim()}>Submit Request</Button>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>My Previous Requests</Typography>
        {!requests.length ? (
          <EmptyState title="You haven't submitted any resource requests yet." message="Your submitted requests will appear here." />
        ) : (
          <Table>
            <TableHead><TableRow><TableCell>Proposed Name</TableCell><TableCell>Type</TableCell><TableCell>Status</TableCell><TableCell>Rejection Reason</TableCell><TableCell>Submitted At</TableCell></TableRow></TableHead>
            <TableBody>
              {requests.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.proposed_name}</TableCell>
                  <TableCell>{item.proposed_type}</TableCell>
                  <TableCell><Chip size="small" label={item.status} color={item.status === 'APPROVED' ? 'success' : item.status === 'REJECTED' ? 'error' : 'warning'} /></TableCell>
                  <TableCell>{item.rejection_reason || '-'}</TableCell>
                  <TableCell>{formatDateTime(item.created_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  )
}

export default RequestResourcePage
