import { createContext, useCallback, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import { Alert, Snackbar } from '@mui/material'

export const SnackbarContext = createContext({
  showSnackbar: () => {},
})

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity })
  }, [])

  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }))
  }, [])

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar])

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  )
}

SnackbarProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
