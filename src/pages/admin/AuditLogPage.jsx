import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { getAuditLogs } from '../../services/auditService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { formatDateTime } from '../../utils/formatters'

function JsonBlock({ title, value }) {
  return (
    <Box>
      <Typography variant="subtitle2" mb={0.5}>
        {title}
      </Typography>
      <Paper sx={{ p: 1.5, bgcolor: 'action.hover', fontFamily: 'monospace', whiteSpace: 'pre-wrap', fontSize: 12 }}>
        {JSON.stringify(value ?? {}, null, 2)}
      </Paper>
    </Box>
  )
}

function AuditLogPage() {
  const [logs, setLogs] = useState([])
  const [page, setPage] = useState(0)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({ action: '', actor_id: '', target_entity_type: '', from_date: '', to_date: '', search: '' })

  const fetchLogs = async () => {
    setIsLoading(true)
    try {
      const response = await getAuditLogs({ ...filters, page: page + 1 })
      const data = response?.data || response
      setLogs(data.results || [])
      setCount(data.count || 0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

  const clearFilters = () => {
    setFilters({ action: '', actor_id: '', target_entity_type: '', from_date: '', to_date: '', search: '' })
    setPage(0)
    setTimeout(fetchLogs, 0)
  }

  if (isLoading) return <LoadingSpinner text="Loading audit logs..." />

  return (
    <Box>
      <Accordion defaultExpanded sx={{ mb: 2 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Filter logs</AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth label="Action" value={filters.action} onChange={(e) => setFilters((p) => ({ ...p, action: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth label="Actor (email)" value={filters.search} onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth label="Target Type" value={filters.target_entity_type} onChange={(e) => setFilters((p) => ({ ...p, target_entity_type: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth type="date" label="From Date" InputLabelProps={{ shrink: true }} value={filters.from_date} onChange={(e) => setFilters((p) => ({ ...p, from_date: e.target.value }))} /></Grid>
            <Grid size={{ xs: 12, md: 3 }}><TextField fullWidth type="date" label="To Date" InputLabelProps={{ shrink: true }} value={filters.to_date} onChange={(e) => setFilters((p) => ({ ...p, to_date: e.target.value }))} /></Grid>
          </Grid>
          <Box mt={2}>
            <Button variant="contained" onClick={() => { setPage(0); fetchLogs() }}>Apply Filters</Button>
            <Button variant="outlined" sx={{ ml: 1 }} onClick={clearFilters}>Clear</Button>
          </Box>
        </AccordionDetails>
      </Accordion>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp (IST)</TableCell>
              <TableCell>Actor Email</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Target Type</TableCell>
              <TableCell>Target ID</TableCell>
              <TableCell>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  <Accordion disableGutters>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      {formatDateTime(log.timestamp)}
                    </AccordionSummary>
                    <AccordionDetails>
                      <JsonBlock title="Previous State" value={log.previous_state} />
                      <Box mt={1.5} />
                      <JsonBlock title="New State" value={log.new_state} />
                      <Box mt={1.5} />
                      <JsonBlock title="Metadata" value={log.metadata} />
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell>{log.actor_email || '-'}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.target_entity_type}</TableCell>
                <TableCell>{log.target_entity_id || '-'}</TableCell>
                <TableCell>{log.ip_address || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={count}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={10}
        rowsPerPageOptions={[10]}
      />
    </Box>
  )
}

export default AuditLogPage
