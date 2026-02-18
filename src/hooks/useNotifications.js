import { useContext } from 'react'
import { NotificationContext } from '../store/NotificationContext'

export function useNotifications() {
  return useContext(NotificationContext)
}
