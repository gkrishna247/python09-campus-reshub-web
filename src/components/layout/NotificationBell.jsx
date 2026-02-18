import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import EventBusyIcon from '@mui/icons-material/EventBusy'
import WarningIcon from '@mui/icons-material/Warning'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import InfoIcon from '@mui/icons-material/Info'
import { getNotifications, markAllAsRead, markAsRead } from '../../services/notificationService'
import { formatRelativeTime } from '../../utils/formatters'
import { useNotifications } from '../../hooks/useNotifications'

const iconByType = {
  BOOKING_APPROVED: <CheckCircleIcon color="success" />,
  BOOKING_REJECTED: <CancelIcon color="error" />,
  BOOKING_CANCELLED: <EventBusyIcon color="warning" />,
  BOOKING_AUTO_CANCELLED: <WarningIcon color="warning" />,
  REGISTRATION_APPROVED: <HowToRegIcon color="success" />,
  REGISTRATION_REJECTED: <PersonOffIcon color="error" />,
  ROLE_CHANGE_APPROVED: <SwapHorizIcon color="success" />,
  ROLE_CHANGE_REJECTED: <SwapHorizIcon color="error" />,
  GENERAL: <InfoIcon color="primary" />,
}

function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null)
  const { notifications, setNotifications } = useNotifications()

  const fetchData = useCallback(async () => {
    try {
      const data = await getNotifications()
      setNotifications(data?.data?.results || data?.data || data?.results || data || [])
    } catch {
      setNotifications([])
    }
  }, [setNotifications])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [fetchData])

  const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications])

  const handleOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const handleMarkAll = async () => {
    await markAllAsRead()
    await fetchData()
  }

  const handleMarkRead = async (id) => {
    await markAsRead(id)
    await fetchData()
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge color="error" badgeContent={unreadCount} invisible={unreadCount === 0}>
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Box width={380} maxWidth="90vw" p={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="h6">Notifications</Typography>
            <Button size="small" onClick={handleMarkAll}>
              Mark all read
            </Button>
          </Box>

          {notifications.length === 0 ? (
            <Box py={4} textAlign="center">
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : (
            <List sx={{ maxHeight: 420, overflowY: 'auto' }}>
              {notifications.slice(0, 20).map((notification) => (
                <ListItemButton
                  key={notification.id}
                  onClick={() => handleMarkRead(notification.id)}
                  sx={{
                    borderRadius: 1,
                    bgcolor: notification.is_read ? 'transparent' : 'action.hover',
                    alignItems: 'flex-start',
                  }}
                >
                  <ListItemIcon>{iconByType[notification.message_type] || iconByType.GENERAL}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography fontWeight={notification.is_read ? 400 : 700}>{notification.title}</Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {notification.body}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatRelativeTime(notification.created_at)}
                        </Typography>
                      </>
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Popover>
    </>
  )
}

export default NotificationBell
