import { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { cancelBooking } from '../../services/bookingService'
import { useSnackbar } from '../../hooks/useSnackbar'

function CancelBookingDialog({ open, onClose, bookingId, resourceName, date, onSuccess }) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const showSnackbar = useSnackbar()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await cancelBooking(bookingId, reason.trim())
      showSnackbar('Booking cancelled successfully.', 'success')
      setReason('')
      onClose()
      onSuccess()
    } catch (error) {
      showSnackbar(error.message || 'Failed to cancel booking.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cancel Booking</DialogTitle>
      <DialogContent>
        <Stack spacing={2} mt={1}>
          <Alert severity="warning">Are you sure you want to cancel this booking? This action cannot be undone.</Alert>
          <Typography variant="body2">Resource: {resourceName}</Typography>
          <Typography variant="body2">Date: {date}</Typography>
          <TextField
            required
            multiline
            rows={3}
            label="Cancellation Reason"
            placeholder="Please provide a reason for cancellation..."
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Keep Booking
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={!reason.trim() || isSubmitting}
          onClick={handleSubmit}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Confirm Cancellation
        </Button>
      </DialogActions>
    </Dialog>
  )
}

CancelBookingDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  bookingId: PropTypes.number,
  resourceName: PropTypes.string,
  date: PropTypes.string,
  onSuccess: PropTypes.func.isRequired,
}

CancelBookingDialog.defaultProps = {
  bookingId: null,
  resourceName: '',
  date: '',
}

export default CancelBookingDialog
