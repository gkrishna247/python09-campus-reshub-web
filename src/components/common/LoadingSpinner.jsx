import PropTypes from 'prop-types'
import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingSpinner({ text }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px" gap={2}>
      <CircularProgress />
      {text ? <Typography variant="body2">{text}</Typography> : null}
    </Box>
  )
}

LoadingSpinner.propTypes = {
  text: PropTypes.string,
}

LoadingSpinner.defaultProps = {
  text: '',
}

export default LoadingSpinner
