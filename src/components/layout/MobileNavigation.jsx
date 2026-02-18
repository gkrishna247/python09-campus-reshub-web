import PropTypes from 'prop-types'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'

function MobileNavigation({ items, value, onChange }) {
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={value} onChange={onChange}>
        {items.map((item) => (
          <BottomNavigationAction key={item.path} label={item.label} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  )
}

MobileNavigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
    }),
  ).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default MobileNavigation
