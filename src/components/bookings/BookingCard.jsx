import PropTypes from 'prop-types'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import { formatDate, formatTime, formatDateTime } from '../../utils/formatters'

function BookingCard({ booking, onCancel }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700}>
          {booking.resource?.name}
        </Typography>
        <Stack direction="row" spacing={1} mt={1} mb={1}>
          <Chip label={booking.resource?.type} size="small" />
          <Chip
            icon={booking.status === 'PENDING' ? <HourglassEmptyIcon /> : <CheckCircleIcon />}
            label={booking.status}
            color={booking.status === 'PENDING' ? 'warning' : 'success'}
            size="small"
          />
        </Stack>
        <Typography variant="body2">Date: {formatDate(booking.booking_date)}</Typography>
        <Typography variant="body2">
          Time: {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
        </Typography>
        <Typography variant="body2">Quantity: {booking.quantity_requested}</Typography>
        <Typography variant="caption" color="text.secondary">
          Created at: {formatDateTime(booking.created_at)}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="outlined" color="error" onClick={() => onCancel(booking)}>
          Cancel Booking
        </Button>
      </CardActions>
    </Card>
  )
}

BookingCard.propTypes = {
  booking: PropTypes.shape({
    id: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    booking_date: PropTypes.string.isRequired,
    start_time: PropTypes.string.isRequired,
    end_time: PropTypes.string.isRequired,
    quantity_requested: PropTypes.number.isRequired,
    created_at: PropTypes.string.isRequired,
    resource: PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default BookingCard
