import { createContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'

export const NotificationContext = createContext({
  notifications: [],
  setNotifications: () => {},
})

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const value = useMemo(
    () => ({
      notifications,
      setNotifications,
    }),
    [notifications],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
