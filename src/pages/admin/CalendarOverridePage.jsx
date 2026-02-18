import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { createCalendarOverride, deleteCalendarOverride, getCalendarOverrides } from '../../services/resourceService'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import EmptyState from '../../components/common/EmptyState'
import { useSnackbar } from '../../hooks/useSnackbar'
import { formatDate } from '../../utils/formatters'

function CalendarOverridePage() {
  const [items, setItems] = useState([])
  const [openCreate, setOpenCreate] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [form, setForm] = useState({ override_date: '', override_type: 'HOLIDAY', description: '' })
  const showSnackbar = useSnackbar()

  const fetchData = async () => {
    const response = await getCalendarOverrides()
    setItems(response?.data?.results || response?.data || response?.results || [])
  }

  useEffect(() => { fetchData() }, [])

  const today = new Date().toISOString().slice(0, 10)

  const handleCreate = async () => {
    try {
      await createCalendarOverride(form)
      setOpenCreate(false)
      setForm({ override_date: '', override_type: 'HOLIDAY', description: '' })
      showSnackbar('Override created.', 'success')
      fetchData()
    } catch (error) {
      showSnackbar(error.message || 'Failed to create override.', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCalendarOverride(confirmDelete.id)
      showSnackbar('Override deleted.', 'success')
      setConfirmDelete(null)
      fetchData()
    } catch (error) {
      showSnackbar(error.message || 'Failed to delete override.', 'error')
    }
  }

  return (
    <Box>
      <Button variant="contained" onClick={() => setOpenCreate(true)} sx={{ mb: 2 }}>Add Override</Button>

      {!items.length ? <EmptyState title="No calendar overrides configured." message="Create one to customize working days." /> : (
        <Table>
          <TableHead><TableRow><TableCell>Date</TableCell><TableCell>Type</TableCell><TableCell>Description</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.override_date)}</TableCell>
                <TableCell><Chip size="small" label={item.override_type} color={item.override_type === 'HOLIDAY' ? 'error' : 'success'} /></TableCell>
                <TableCell>{item.description || '-'}</TableCell>
                <TableCell><IconButton color="error" onClick={() => setConfirmDelete(item)}><DeleteIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Override</DialogTitle>
        <DialogContent>
          <TextField fullWidth type="date" label="Date" InputLabelProps={{ shrink: true }} inputProps={{ min: today }} value={form.override_date} onChange={(e) => setForm((p) => ({ ...p, override_date: e.target.value }))} sx={{ mt: 1 }} />
          <TextField select fullWidth label="Override Type" value={form.override_type} onChange={(e) => setForm((p) => ({ ...p, override_type: e.target.value }))} sx={{ mt: 2 }}>
            <MenuItem value="HOLIDAY">HOLIDAY</MenuItem>
            <MenuItem value="WORKING_DAY">WORKING_DAY</MenuItem>
          </TextField>
          <TextField fullWidth label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        title="Delete Override"
        message="Are you sure you want to delete this calendar override?"
        confirmText="Delete"
        severity="error"
      />
    </Box>
  )
}

export default CalendarOverridePage
