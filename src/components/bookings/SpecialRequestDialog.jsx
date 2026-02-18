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
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { createBooking } from '../../services/bookingService'
import { useSnackbar } from '../../hooks/useSnackbar'

function SpecialRequestDialog({
  open,
  onClose,
  resourceId,
  resourceName,
  date,
  startTime,
  endTime,
  availableQuantity,
  onSuccess,
}) {
  const [quantity, setQuantity] = useState(1)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const showSnackbar = useSnackbar()

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const result = await createBooking({
        resource_id: resourceId,
        booking_date: date,
        start_time: startTime,
        quantity_requested: Number(quantity),
        is_special_request: true,
        special_request_reason: reason.trim(),
      })
      const bookingStatus = result?.data?.status || result?.data?.booking?.status || result?.status
      showSnackbar(
        bookingStatus === 'APPROVED' ? 'Booking confirmed!' : 'Booking submitted for approval.',
        'success',
      )
      onClose()
      onSuccess()
    } catch (error) {
      if (error?.status_code === 409 || error?.status === 409) {
        showSnackbar('This slot is no longer available. Please refresh and try again.', 'error')
        onClose()
        onSuccess()
      } else {
        showSnackbar(error?.message || 'Failed to create booking.', 'error')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
      <DialogTitle>Book Resource</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          This is a non-working period. A special request with justification is required.
        </Alert>
        <Typography variant="body2">Resource: {resourceName}</Typography>
        <Typography variant="body2">Date: {date}</Typography>
        <Typography variant="body2" mb={2}>
          Time: {startTime} - {endTime}
        </Typography>
        <TextField
          fullWidth
          type="number"
          label="Quantity"
          inputProps={{ min: 1, max: availableQuantity }}
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          required
          multiline
          rows={3}
          label="Reason for special request"
          helperText="Explain why you need this resource during non-working hours/days."
          value={reason}
          onChange={(event) => setReason(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!reason.trim() || isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Confirm Booking
        </Button>
      </DialogActions>
    </Dialog>
  )
}

SpecialRequestDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  resourceId: PropTypes.number.isRequired,
  resourceName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  availableQuantity: PropTypes.number.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

export default SpecialRequestDialog
