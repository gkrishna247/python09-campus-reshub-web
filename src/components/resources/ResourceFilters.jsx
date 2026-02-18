import PropTypes from 'prop-types'
import SearchIcon from '@mui/icons-material/Search'
import { Grid, InputAdornment, MenuItem, TextField } from '@mui/material'

function ResourceFilters({ filters, onChange }) {
  return (
    <Grid container spacing={2} mb={3}>
      <Grid size={{ xs: 12, md: 5 }}>
        <TextField
          fullWidth
          placeholder="Search by name or location..."
          value={filters.search}
          onChange={(event) => onChange('search', event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField select fullWidth label="Type" value={filters.type} onChange={(event) => onChange('type', event.target.value)}>
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="LAB">Lab</MenuItem>
          <MenuItem value="CLASSROOM">Classroom</MenuItem>
          <MenuItem value="EVENT_HALL">Event Hall</MenuItem>
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField
          fullWidth
          label="Min capacity"
          type="number"
          value={filters.min_capacity}
          onChange={(event) => onChange('min_capacity', event.target.value)}
        />
      </Grid>
    </Grid>
  )
}

ResourceFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    type: PropTypes.string,
    min_capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default ResourceFilters
