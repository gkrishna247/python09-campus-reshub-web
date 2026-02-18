import PropTypes from 'prop-types'
import { Card, CardActions, CardContent, Button, Chip, Stack, Typography } from '@mui/material'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import { useNavigate } from 'react-router-dom'

const typeColor = {
  LAB: 'primary',
  CLASSROOM: 'success',
  EVENT_HALL: 'secondary',
}

function ResourceCard({ resource }) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {resource.name}
        </Typography>
        <Stack direction="row" spacing={1} mb={1} flexWrap="wrap" useFlexGap>
          <Chip label={resource.type} color={typeColor[resource.type] || 'default'} size="small" />
          <Chip label={resource.resource_status} color={resource.resource_status === 'AVAILABLE' ? 'success' : 'error'} size="small" />
          <Chip label={resource.approval_type} size="small" />
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <PeopleAltIcon fontSize="small" />
          <Typography variant="body2">Capacity: {resource.capacity}</Typography>
        </Stack>
        <Typography variant="body2">Total Quantity: {resource.total_quantity}</Typography>
        <Typography variant="body2" color="text.secondary">
          Location: {resource.location || 'N/A'}
        </Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth onClick={() => navigate(`/resources/${resource.id}`)}>
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}

ResourceCard.propTypes = {
  resource: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    capacity: PropTypes.number.isRequired,
    total_quantity: PropTypes.number.isRequired,
    location: PropTypes.string,
    resource_status: PropTypes.string.isRequired,
    approval_type: PropTypes.string.isRequired,
  }).isRequired,
}

export default ResourceCard
