import { useEffect, useState } from 'react'
import {
  Chip,
  Grid,
  Paper,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import EventNoteIcon from '@mui/icons-material/EventNote'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import StarIcon from '@mui/icons-material/Star'
import { getStatistics } from '../../services/statisticsService'
import LoadingSpinner from '../../components/common/LoadingSpinner'

function MetricCard({ title, icon, children }) {
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6">{title}</Typography>
      </Stack>
      {children}
    </Paper>
  )
}

function StatisticsPage() {
  const [range, setRange] = useState('THIS_WEEK')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async (nextRange) => {
    setIsLoading(true)
    const response = await getStatistics(nextRange)
    setData(response?.data || response)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData(range)
  }, [range])

  if (isLoading || !data) return <LoadingSpinner text="Loading statistics..." />

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup value={range} exclusive onChange={(_, value) => value && setRange(value)}>
        <ToggleButton value="TODAY">Today</ToggleButton>
        <ToggleButton value="THIS_WEEK">This Week</ToggleButton>
        <ToggleButton value="THIS_MONTH">This Month</ToggleButton>
        <ToggleButton value="ALL_TIME">All Time</ToggleButton>
      </ToggleButtonGroup>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard title="Total Users" icon={<PeopleIcon />}>
            <Typography variant="h3" fontWeight={700}>{data.users?.total || 0}</Typography>
            <Typography variant="body2">{data.users?.by_role?.STUDENT || 0} Students, {data.users?.by_role?.FACULTY || 0} Faculty, {data.users?.by_role?.STAFF || 0} Staff, {data.users?.by_role?.ADMIN || 0} Admin</Typography>
          </MetricCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard title="User Status" icon={<PeopleIcon />}>
            <Typography color="success.main">Active: {data.users?.active || 0}</Typography>
            <Typography color="error.main">Inactive: {data.users?.inactive || 0}</Typography>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard title="Total Resources" icon={<MeetingRoomIcon />}>
            <Typography variant="h3" fontWeight={700}>{data.resources?.total || 0}</Typography>
            <Typography variant="body2">{data.resources?.by_type?.LAB || 0} Labs, {data.resources?.by_type?.CLASSROOM || 0} Classrooms, {data.resources?.by_type?.EVENT_HALL || 0} Event Halls</Typography>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard title="Bookings" icon={<EventNoteIcon />}>
            <Typography variant="h3" fontWeight={700}>{data.bookings?.total_in_range || 0}</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip label={`Pending (${data.bookings?.pending || 0})`} color="warning" size="small" />
              <Chip label={`Approved (${data.bookings?.approved || 0})`} color="success" size="small" />
              <Chip label={`Rejected (${data.bookings?.rejected || 0})`} color="error" size="small" />
              <Chip label={`Cancelled (${data.bookings?.cancelled || 0})`} size="small" />
            </Stack>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard title="Pending Approvals" icon={<PendingActionsIcon />}>
            <Typography>Registrations: {data.pending_approvals?.registrations || 0}</Typography>
            <Typography>Bookings: {data.pending_approvals?.bookings || 0}</Typography>
            <Typography>Resource Requests: {data.pending_approvals?.resource_requests || 0}</Typography>
            <Typography>Role Changes: {data.pending_approvals?.role_changes || 0}</Typography>
          </MetricCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MetricCard title="Most Booked Resources" icon={<StarIcon />}>
            {data.most_booked_resources?.length ? data.most_booked_resources.slice(0, 5).map((item, index) => (
              <Typography key={item.id}>{index + 1}. {item.name} ({item.booking_count} bookings)</Typography>
            )) : <Typography>No bookings in this period.</Typography>}
          </MetricCard>
        </Grid>
      </Grid>
    </Stack>
  )
}

export default StatisticsPage
