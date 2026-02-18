import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import { approveBooking, getPendingBookings, rejectBooking } from '../../services/bookingService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import { useSnackbar } from '../../hooks/useSnackbar'

function StaffBookingApprovalsPage() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [rejectDialog, setRejectDialog] = useState({ open: false, id: null, reason: '' })
  const showSnackbar = useSnackbar()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await getPendingBookings()
      setBookings(response?.data?.results || response?.results || [])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const onApprove = async (id) => {
    await approveBooking(id)
    showSnackbar('Booking approved.', 'success')
    fetchData()
  }

  const onReject = async () => {
    await rejectBooking(rejectDialog.id, rejectDialog.reason)
    showSnackbar('Booking rejected.', 'success')
    setRejectDialog({ open: false, id: null, reason: '' })
    fetchData()
  }

  if (isLoading) return <LoadingSpinner text="Loading pending bookings..." />

  if (!bookings.length) return <EmptyState title="No pending booking approvals." message="All booking requests are processed." />

  return (
    <Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booked By</TableCell><TableCell>Resource Name</TableCell><TableCell>Date</TableCell><TableCell>Time Slot</TableCell><TableCell>Quantity</TableCell><TableCell>Requested At</TableCell><TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.user?.name}</TableCell>
              <TableCell>{booking.resource?.name}</TableCell>
              <TableCell>{booking.booking_date}</TableCell>
              <TableCell>{booking.start_time} - {booking.end_time}</TableCell>
              <TableCell>{booking.quantity_requested}</TableCell>
              <TableCell>{booking.created_at}</TableCell>
              <TableCell>
                <Button size="small" variant="contained" color="success" onClick={() => onApprove(booking.id)}>Approve</Button>
                <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => setRejectDialog({ open: true, id: booking.id, reason: '' })}>Reject</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog((prev) => ({ ...prev, open: false }))} fullWidth maxWidth="sm">
        <DialogTitle>Reject Booking</DialogTitle>
        <DialogContent>
          <TextField fullWidth required multiline rows={3} label="Rejection Reason" value={rejectDialog.reason} onChange={(e) => setRejectDialog((prev) => ({ ...prev, reason: e.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setRejectDialog((prev) => ({ ...prev, open: false }))}>Cancel</Button>
          <Button variant="contained" color="error" onClick={onReject} disabled={!rejectDialog.reason.trim()}>Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StaffBookingApprovalsPage
