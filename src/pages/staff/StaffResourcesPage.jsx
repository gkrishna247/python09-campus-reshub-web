import { useEffect, useState } from 'react'
import { Grid } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { getResources } from '../../services/resourceService'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import ResourceCard from '../../components/resources/ResourceCard'

function StaffResourcesPage() {
  const { user } = useAuth()
  const [resources, setResources] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const response = await getResources()
        const list = response?.data?.results || response?.results || []
        setResources(list.filter((item) => item.managed_by?.id === user.id))
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user])

  if (isLoading) return <LoadingSpinner text="Loading managed resources..." />

  if (!resources.length) {
    return (
      <EmptyState
        title="No resources are currently assigned to you."
        message="You can request a new resource to be added by an administrator."
        action={{ label: 'Request Resource Addition', to: '/staff/request-resource' }}
      />
    )
  }

  return (
    <Grid container spacing={2}>
      {resources.map((resource) => (
        <Grid key={resource.id} size={{ xs: 12, sm: 6, md: 4 }}>
          <ResourceCard resource={resource} />
        </Grid>
      ))}
    </Grid>
  )
}

export default StaffResourcesPage
