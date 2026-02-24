import { useEffect, useState } from 'react'
import { Alert, Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import { useAuth } from '../../hooks/useAuth'
import { getMyBookings, getPendingBookings } from '../../services/bookingService'
import { getResources } from '../../services/resourceService'
import { getStatistics } from '../../services/statisticsService'
import { getNotifications } from '../../services/notificationService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'

function StatCard({ title, value, subtext }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
      {subtext ? <Typography variant="caption">{subtext}</Typography> : null}
    </Paper>
  )
}

function DashboardPage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState({})

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        if (['STUDENT', 'FACULTY'].includes(user.role)) {
          const [bookings, resources, notifications] = await Promise.all([
            getMyBookings(),
            getResources(),
            getNotifications(),
          ])
          const list = notifications?.data?.results || notifications?.data || []
          setData({
            upcoming: (bookings?.data?.results || bookings?.results || []).length,
            resources: resources?.data?.count || resources?.count || (resources?.data?.results || []).length,
            unread: list.filter((n) => !n.is_read).length,
            notifications: list.slice(0, 5),
          })
        } else if (user.role === 'STAFF') {
          const [resources, pending] = await Promise.all([getResources(), getPendingBookings()])
          const mine = (resources?.data?.results || resources?.results || []).filter(
            (resource) => resource.managed_by?.id === user.id,
          )
          setData({
            myResources: mine.length,
            pendingApprovals: (pending?.data?.results || pending?.results || []).length,
            noResources: mine.length === 0,
          })
        } else {
          const stats = await getStatistics('THIS_WEEK')
          const statData = stats?.data || stats
          setData(statData)
        }
      } catch (apiError) {
        setError(apiError.message || 'Failed to load dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user])

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />

  return (
    <Stack spacing={3}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Welcome back, {user.name}!
        </Typography>
        <Chip label={user.role} sx={{ mt: 1 }} />
      </Paper>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {['STUDENT', 'FACULTY'].includes(user.role) ? (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}><StatCard title="Upcoming Bookings" value={data.upcoming || 0} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><StatCard title="Available Resources" value={data.resources || 0} /></Grid>
            <Grid size={{ xs: 12, md: 4 }}><StatCard title="Notifications" value={data.unread || 0} /></Grid>
          </Grid>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" mb={1}>Recent Notifications</Typography>
            {(data.notifications || []).map((notification) => (
              <Typography key={notification.id} variant="body2" color="text.secondary">
                • {notification.title}
              </Typography>
            ))}
          </Paper>
        </>
      ) : null}

      {user.role === 'STAFF' ? (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}><StatCard title="My Resources" value={data.myResources || 0} /></Grid>
            <Grid size={{ xs: 12, md: 6 }}><StatCard title="Pending Approvals" value={data.pendingApprovals || 0} /></Grid>
          </Grid>
          {data.noResources ? (
            <EmptyState
              title="No resources assigned to you yet. Request a resource addition."
              message="You can submit a request from the staff request page."
            />
          ) : null}
        </>
      ) : null}

      {user.role === 'ADMIN' ? (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3 }}><StatCard title="Total Users" value={data?.users?.total || 0} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><StatCard title="Total Resources" value={data?.resources?.total || 0} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><StatCard title="Bookings This Week" value={data?.bookings?.total || 0} /></Grid>
          <Grid size={{ xs: 12, md: 3 }}><StatCard title="Pending Approvals" value={Object.values(data?.pending_approvals || {}).reduce((sum, count) => sum + count, 0)} /></Grid>
        </Grid>
      ) : null}
    </Stack>
  )
}

export default DashboardPage
