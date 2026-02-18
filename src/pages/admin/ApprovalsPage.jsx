import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
} from '@mui/material'
import {
  approveRegistration,
  approveRoleChange,
  getPendingRegistrations,
  getRoleChangeRequests,
  rejectRegistration,
  rejectRoleChange,
} from '../../services/userService'
import EmptyState from '../../components/common/EmptyState'
import { useSnackbar } from '../../hooks/useSnackbar'

function ApprovalsPage() {
  const [tab, setTab] = useState(0)
  const [registrations, setRegistrations] = useState([])
  const [roleChanges, setRoleChanges] = useState([])
  const [rejectDialog, setRejectDialog] = useState({ open: false, type: '', id: null, reason: '' })
  const showSnackbar = useSnackbar()

  const loadRegistrations = async () => {
    const response = await getPendingRegistrations()
    setRegistrations(response?.data?.results || response?.results || [])
  }

  const loadRoleChanges = async () => {
    const response = await getRoleChangeRequests()
    setRoleChanges(response?.data?.results || response?.results || [])
  }

  useEffect(() => {
    if (tab === 0) loadRegistrations()
    else loadRoleChanges()
  }, [tab])

  const handleApprove = async (type, id) => {
    if (type === 'registration') await approveRegistration(id)
    else await approveRoleChange(id)
    showSnackbar('Request approved.', 'success')
    if (type === 'registration') loadRegistrations()
    else loadRoleChanges()
  }

  const handleReject = async () => {
    if (rejectDialog.type === 'registration') await rejectRegistration(rejectDialog.id, rejectDialog.reason)
    else await rejectRoleChange(rejectDialog.id, rejectDialog.reason)
    showSnackbar('Request rejected.', 'success')
    setRejectDialog({ open: false, type: '', id: null, reason: '' })
    if (rejectDialog.type === 'registration') loadRegistrations()
    else loadRoleChanges()
  }

  return (
    <Box>
      <Tabs value={tab} onChange={(_, value) => setTab(value)} sx={{ mb: 2 }}>
        <Tab label="Registration Approvals" />
        <Tab label="Role Change Requests" />
      </Tabs>

      {tab === 0 ? (
        registrations.length === 0 ? (
          <EmptyState title="No pending registration approvals." message="Everything is up to date." />
        ) : (
          <Table>
            <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Email</TableCell><TableCell>Role Requested</TableCell><TableCell>Registered At</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
            <TableBody>
              {registrations.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell><Chip size="small" label={item.role} /></TableCell>
                  <TableCell>{item.created_at}</TableCell>
                  <TableCell>
                    <Button size="small" variant="contained" color="success" onClick={() => handleApprove('registration', item.id)}>Approve</Button>
                    <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => setRejectDialog({ open: true, type: 'registration', id: item.id, reason: '' })}>Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
      ) : roleChanges.length === 0 ? (
        <EmptyState title="No pending role change requests." message="Everything is up to date." />
      ) : (
        <Table>
          <TableHead><TableRow><TableCell>User Name</TableCell><TableCell>Email</TableCell><TableCell>Current Role</TableCell><TableCell>Requested Role</TableCell><TableCell>Requested At</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {roleChanges.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.user?.name}</TableCell>
                <TableCell>{item.user?.email}</TableCell>
                <TableCell><Chip size="small" label={item.current_role} /></TableCell>
                <TableCell><Chip size="small" label={item.requested_role} /></TableCell>
                <TableCell>{item.created_at}</TableCell>
                <TableCell>
                  <Button size="small" variant="contained" color="success" onClick={() => handleApprove('role', item.id)}>Approve</Button>
                  <Button size="small" variant="outlined" color="error" sx={{ ml: 1 }} onClick={() => setRejectDialog({ open: true, type: 'role', id: item.id, reason: '' })}>Reject</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog((prev) => ({ ...prev, open: false }))} fullWidth maxWidth="sm">
        <DialogTitle>Reject Request</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={3} required label="Rejection Reason" value={rejectDialog.reason} onChange={(event) => setRejectDialog((prev) => ({ ...prev, reason: event.target.value }))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog((prev) => ({ ...prev, open: false }))} variant="outlined">Cancel</Button>
          <Button onClick={handleReject} variant="contained" color="error" disabled={!rejectDialog.reason.trim()}>Reject</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApprovalsPage
