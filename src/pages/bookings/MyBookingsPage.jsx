import { useEffect, useState } from 'react'
import EventNoteIcon from '@mui/icons-material/EventNote'
import { Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { getMyBookings } from '../../services/bookingService'
import BookingCard from '../../components/bookings/BookingCard'
import CancelBookingDialog from '../../components/bookings/CancelBookingDialog'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

function MyBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const navigate = useNavigate()

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const response = await getMyBookings()
      setBookings(response?.data?.results || response?.results || [])
    } catch {
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  if (isLoading) return <LoadingSpinner text="Loading bookings..." />

  if (!bookings.length) {
    return (
      <EmptyState
        icon={<EventNoteIcon color="action" sx={{ fontSize: 54 }} />}
        title="No upcoming bookings"
        message="You currently have no upcoming bookings."
        action={{ label: 'Browse Resources', to: '/resources' }}
      />
    )
  }

  return (
    <>
      <Stack spacing={2}>
        {bookings.map((booking) => (
          <BookingCard key={booking.id} booking={booking} onCancel={setSelectedBooking} />
        ))}
      </Stack>
      {selectedBooking ? (
        <CancelBookingDialog
          open
          onClose={() => setSelectedBooking(null)}
          bookingId={selectedBooking.id}
          resourceName={selectedBooking.resource?.name}
          date={selectedBooking.booking_date}
          onSuccess={fetchBookings}
        />
      ) : null}
    </>
  )
}

export default MyBookingsPage
