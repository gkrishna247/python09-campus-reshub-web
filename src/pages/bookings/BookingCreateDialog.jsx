import { useNavigate } from 'react-router-dom'
import { Card, CardContent, Typography } from '@mui/material'

function BookingCreateDialogPage() {
  const navigate = useNavigate()

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Booking flow
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select a resource slot from Resource Details page to create a booking.
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 2, color: 'primary.main', cursor: 'pointer' }}
          onClick={() => navigate('/resources')}
        >
          Go to Resources
        </Typography>
      </CardContent>
    </Card>
  )
}

export default BookingCreateDialogPage
