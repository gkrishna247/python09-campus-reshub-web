import PropTypes from 'prop-types'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { IconButton, Tooltip } from '@mui/material'

function ThemeToggle({ mode, onToggle }) {
  return (
    <Tooltip title="Toggle theme">
      <IconButton color="inherit" onClick={onToggle}>
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}

ThemeToggle.propTypes = {
  mode: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggle: PropTypes.func.isRequired,
}

export default ThemeToggle
