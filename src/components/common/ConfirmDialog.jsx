import PropTypes from 'prop-types'
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  severity,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Alert severity={severity}>{message}</Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} variant="contained" color={severity === 'error' ? 'error' : 'warning'}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  severity: PropTypes.string,
}

ConfirmDialog.defaultProps = {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  severity: 'warning',
}

export default ConfirmDialog
