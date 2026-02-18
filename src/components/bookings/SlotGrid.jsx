import { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import BookingCreateDialog from './BookingCreateDialog'
import SpecialRequestDialog from './SpecialRequestDialog'
import { useAuth } from '../../hooks/useAuth'

function SlotGrid({ slots, resourceId, resourceName, date, totalQuantity, isWorkingDay, onBookingCreated }) {
  const { user } = useAuth()
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [dialogType, setDialogType] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const canBook = useMemo(() => ['STUDENT', 'FACULTY', 'ADMIN'].includes(user?.role), [user?.role])

  const renderStatusChip = (status) => {
    if (status === 'AVAILABLE') return <Chip size="small" label="Available" color="success" />
    if (status === 'FULLY_BOOKED') return <Chip size="small" label="Fully Booked" color="error" />
    return <Chip size="small" label="Non-Working" color="default" />
  }

  const renderAction = (slot) => {
    if (!canBook) return null
    if (slot.status === 'AVAILABLE') {
      return (
        <Button size="small" variant="contained" onClick={() => { setSelectedSlot(slot); setDialogType('book') }}>
          Book
        </Button>
      )
    }
    if (slot.status === 'NON_WORKING') {
      return (
        <Button size="small" variant="outlined" onClick={() => { setSelectedSlot(slot); setDialogType('special') }}>
          Special Request
        </Button>
      )
    }
    return (
      <Typography variant="body2" color="text.secondary">
        Full
      </Typography>
    )
  }

  const slotsView = isMobile ? (
    <Stack spacing={1.5}>
      {slots.map((slot) => {
        const progress = ((slot.booked_quantity || 0) / (slot.total_quantity || totalQuantity || 1)) * 100
        return (
          <Card key={`${slot.start_time}-${slot.end_time}`} variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Typography fontWeight={700}>{`${slot.start_time} - ${slot.end_time}`}</Typography>
                {renderStatusChip(slot.status)}
                {slot.status === 'NON_WORKING' ? (
                  <Typography variant="body2">--</Typography>
                ) : (
                  <>
                    <Typography variant="body2">
                      {slot.available_quantity} / {slot.total_quantity} available
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} />
                  </>
                )}
                {renderAction(slot)}
              </Stack>
            </CardContent>
          </Card>
        )
      })}
    </Stack>
  ) : (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Time Slot</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Availability</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {slots.map((slot) => {
            const progress = ((slot.booked_quantity || 0) / (slot.total_quantity || totalQuantity || 1)) * 100
            return (
              <TableRow key={`${slot.start_time}-${slot.end_time}`}>
                <TableCell>{`${slot.start_time} - ${slot.end_time}`}</TableCell>
                <TableCell>{renderStatusChip(slot.status)}</TableCell>
                <TableCell>
                  {slot.status === 'NON_WORKING' ? (
                    '--'
                  ) : (
                    <Box>
                      <Typography variant="body2">
                        {slot.available_quantity} / {slot.total_quantity} available
                      </Typography>
                      <LinearProgress variant="determinate" value={progress} sx={{ mt: 1 }} />
                    </Box>
                  )}
                </TableCell>
                <TableCell>{renderAction(slot)}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )

  return (
    <>
      {!isWorkingDay ? (
        <Typography color="warning.main" mb={2}>
          Selected date is marked as non-working day.
        </Typography>
      ) : null}
      {slotsView}
      {selectedSlot && dialogType === 'book' ? (
        <BookingCreateDialog
          open
          onClose={() => {
            setSelectedSlot(null)
            setDialogType(null)
          }}
          resourceId={resourceId}
          resourceName={resourceName}
          date={date}
          startTime={selectedSlot.start_time}
          endTime={selectedSlot.end_time}
          availableQuantity={selectedSlot.available_quantity}
          onSuccess={onBookingCreated}
        />
      ) : null}
      {selectedSlot && dialogType === 'special' ? (
        <SpecialRequestDialog
          open
          onClose={() => {
            setSelectedSlot(null)
            setDialogType(null)
          }}
          resourceId={resourceId}
          resourceName={resourceName}
          date={date}
          startTime={selectedSlot.start_time}
          endTime={selectedSlot.end_time}
          availableQuantity={Math.max(selectedSlot.available_quantity || 1, 1)}
          onSuccess={onBookingCreated}
        />
      ) : null}
    </>
  )
}

SlotGrid.propTypes = {
  slots: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceId: PropTypes.number.isRequired,
  resourceName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  totalQuantity: PropTypes.number.isRequired,
  isWorkingDay: PropTypes.bool.isRequired,
  onBookingCreated: PropTypes.func.isRequired,
}

export default SlotGrid
