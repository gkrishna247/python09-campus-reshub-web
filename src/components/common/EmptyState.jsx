import PropTypes from 'prop-types'
import { Box, Button, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

function EmptyState({ icon, title, message, action }) {
  const renderAction = () => {
    if (!action) return null
    if (action.to) {
      return (
        <Button component={RouterLink} to={action.to} variant="contained">
          {action.label}
        </Button>
      )
    }
    return (
      <Button variant="contained" onClick={action.onClick}>
        {action.label}
      </Button>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" py={6} gap={2}>
      {icon}
      <Typography variant="h6">{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
      {renderAction()}
    </Box>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.element,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  action: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    to: PropTypes.string,
  }),
}

EmptyState.defaultProps = {
  icon: null,
  action: null,
}

export default EmptyState
