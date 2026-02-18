import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getResourceById, getResourceSchedule, updateResourceSchedule } from '../../services/resourceService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useSnackbar } from '../../hooks/useSnackbar'

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function ScheduleManagementPage() {
  const { resourceId } = useParams()
  const navigate = useNavigate()
  const showSnackbar = useSnackbar()
  const [resource, setResource] = useState(null)
  const [rows, setRows] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      const [resourceResponse, scheduleResponse] = await Promise.all([
        getResourceById(resourceId),
        getResourceSchedule(resourceId),
      ])
      setResource(resourceResponse?.data || resourceResponse)
      const scheduleRows = scheduleResponse?.data?.results || scheduleResponse?.data || scheduleResponse || []
      const normalized = dayOrder.map((day, index) => {
        const existing = scheduleRows.find((item) => item.day_of_week === index + 1 || item.day_name === day)
        return (
          existing || {
            day_of_week: index + 1,
            day_name: day,
            start_time: '08:00',
            end_time: '18:00',
            is_working: day !== 'Sunday',
          }
        )
      })
      setRows(normalized)
      setIsLoading(false)
    }
    load()
  }, [resourceId])

  if (isLoading || !resource) return <LoadingSpinner text="Loading schedule..." />

  const handleSave = async () => {
    try {
      await updateResourceSchedule(resourceId, rows.map((row) => ({
        day_of_week: row.day_of_week,
        start_time: row.start_time,
        end_time: row.end_time,
        is_working: row.is_working,
      })))
      showSnackbar('Schedule updated successfully.', 'success')
    } catch (error) {
      showSnackbar(error.message || 'Failed to update schedule.', 'error')
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>Schedule for {resource.name}</Typography>
      <Table>
        <TableHead>
          <TableRow><TableCell>Day</TableCell><TableCell>Start Time</TableCell><TableCell>End Time</TableCell><TableCell>Working Day</TableCell></TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.day_of_week}>
              <TableCell>{row.day_name || dayOrder[index]}</TableCell>
              <TableCell><TextField type="time" value={(row.start_time || '08:00').slice(0, 5)} onChange={(e) => setRows((prev) => prev.map((item, rowIndex) => rowIndex === index ? { ...item, start_time: e.target.value } : item))} /></TableCell>
              <TableCell><TextField type="time" value={(row.end_time || '18:00').slice(0, 5)} onChange={(e) => setRows((prev) => prev.map((item, rowIndex) => rowIndex === index ? { ...item, end_time: e.target.value } : item))} /></TableCell>
              <TableCell><Switch checked={Boolean(row.is_working)} onChange={(e) => setRows((prev) => prev.map((item, rowIndex) => rowIndex === index ? { ...item, is_working: e.target.checked } : item))} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Stack direction="row" spacing={1} mt={2}>
        <Button variant="contained" onClick={handleSave}>Save All Changes</Button>
        <Button variant="outlined" onClick={() => navigate(`/resources/${resourceId}`)}>Back to Resource</Button>
      </Stack>
    </Paper>
  )
}

export default ScheduleManagementPage
