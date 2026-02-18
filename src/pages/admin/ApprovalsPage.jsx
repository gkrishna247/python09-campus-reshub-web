import { useState, useEffect } from "react";
import { Box, Typography, Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { userService } from "../../services/userService";
import { bookingService } from "../../services/bookingService";
import { resourceService } from "../../services/resourceService";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ROLES } from "../../utils/constants";
import dayjs from "dayjs";

// Helper for rejection dialog
const RejectionDialog = ({ open, onClose, onConfirm }) => {
    const [reason, setReason] = useState("");
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogContent>
                <TextField
                    label="Reason" fullWidth multiline rows={3} required margin="dense"
                    value={reason} onChange={(e) => setReason(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onConfirm(reason)} variant="contained" color="error" disabled={!reason}>Reject</Button>
            </DialogActions>
        </Dialog>
    );
};

export const ApprovalsPage = () => {
    const { user } = useAuth();
    const { showSnackbar } = useSnackbar();
    const [tab, setTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    // Rejection State
    const [rejectId, setRejectId] = useState(null);
    const [rejectType, setRejectType] = useState(""); // 'REGISTRATION', 'ROLE', 'BOOKING', 'RESOURCE'

    const isAdmin = user?.role === ROLES.ADMIN;
    // FACULTY/STAFF also access this for their approvals?
    // Prompt says: FACULTY: "Approvals" -> "/admin/approvals".
    // Booking Approvals is mainly for Staff/Faculty (who manage resources).
    // Admin sees all?
    // Let's implement tabs based on role.

    const fetchItems = async () => {
        setLoading(true);
        try {
            let data = [];
            // Tab mapping depends on role
            if (isAdmin) {
                if (tab === 0) data = (await userService.getPendingRegistrations()).data.results;
                if (tab === 1) data = (await userService.getRoleChangeRequests()).data.results;
                if (tab === 2) data = (await resourceService.getResourceRequests()).data.results;
                // Admin might not see booking approvals here effectively if they are per-resource-manager.
                // But let's assume Admin can see all "Pending" bookings?
                // Prompt 6.3 Admin menu: "Approvals".
                // Let's add Bookings tab for Admin too.
                if (tab === 3) data = (await bookingService.getPendingBookings()).data.results;
            } else {
                // Staff/Faculty
                // They see Booking Approvals.
                if (tab === 0) data = (await bookingService.getPendingBookings()).data.results;
            }
            setItems(data);
        } catch (error) {
            console.error("Fetch error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [tab, user]);

    const handleApprove = async (id) => {
        try {
            if (isAdmin) {
                if (tab === 0) await userService.approveRegistration(id);
                if (tab === 1) await userService.approveRoleChange(id);
                if (tab === 2) await resourceService.approveResourceRequest(id);
                if (tab === 3) await bookingService.approveBooking(id);
            } else {
                if (tab === 0) await bookingService.approveBooking(id);
            }
            showSnackbar("Approved successfully", "success");
            fetchItems();
        } catch (error) {
            showSnackbar(error.message || "Failed to approve", "error");
        }
    };

    const handleRejectClick = (id) => {
        setRejectId(id);
        // Determine type based on tab
        if (isAdmin) {
            if (tab === 0) setRejectType('REGISTRATION');
            if (tab === 1) setRejectType('ROLE');
            if (tab === 2) setRejectType('RESOURCE');
            if (tab === 3) setRejectType('BOOKING');
        } else {
            setRejectType('BOOKING');
        }
    };

    const handleRejectConfirm = async (reason) => {
        if (!rejectId) return;
        try {
            if (rejectType === 'REGISTRATION') await userService.rejectRegistration(rejectId, reason);
            if (rejectType === 'ROLE') await userService.rejectRoleChange(rejectId, reason);
            if (rejectType === 'RESOURCE') await resourceService.rejectResourceRequest(rejectId, reason);
            if (rejectType === 'BOOKING') await bookingService.rejectBooking(rejectId, reason);

            showSnackbar("Rejected successfully", "success");
            setRejectId(null);
            fetchItems();
        } catch (error) {
            showSnackbar(error.message || "Failed to reject", "error");
        }
    };

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>Approvals</Typography>

            <Box sx={{ borderBottom: 1, borderColor, mb: 3 }}>
                <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
                    {isAdmin && <Tab label="Registrations" />}
                    {isAdmin && <Tab label="Role Changes" />}
                    {isAdmin && <Tab label="Resource Requests" />}
                    <Tab label="Bookings" />
                </Tabs>
            </Box>

            {loading ? <LoadingSpinner /> : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Request Details</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.length === 0 ? (
                                    <TableRow><TableCell colSpan={4} align="center">No pending requests</TableCell></TableRow>
                                ) : items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            {/* Content varies by type */}
                                            {isAdmin && tab === 0 && (
                                                <Box>
                                                    <Typography variant="subtitle2">{item.name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{item.email} ({item.role})</Typography>
                                                </Box>
                                            )}
                                            {isAdmin && tab === 1 && (
                                                <Box>
                                                    <Typography variant="subtitle2">User: {item.user_name || item.user}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{item.current_role} → {item.requested_role}</Typography>
                                                </Box>
                                            )}
                                            {isAdmin && tab === 2 && (
                                                <Box>
                                                    <Typography variant="subtitle2">Resource: {item.resource_name}</Typography>
                                                    <Typography variant="body2" color="text.secondary">By: {item.requester_name}</Typography>
                                                </Box>
                                            )}
                                            {((isAdmin && tab === 3) || (!isAdmin && tab === 0)) && (
                                                <Box>
                                                    <Typography variant="subtitle2">{item.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{item.resource_name}</Typography>
                                                    <Typography variant="caption">{dayjs(item.start_time).format("MMM D HH:mm")} - {dayjs(item.end_time).format("HH:mm")}</Typography>
                                                </Box>
                                            )}
                                        </TableCell>
                                        <TableCell>{dayjs(item.created_at).format("MMM D, YYYY")}</TableCell>
                                        <TableCell><Chip label="Pending" color="warning" size="small" /></TableCell>
                                        <TableCell align="right">
                                            <Button size="small" color="success" onClick={() => handleApprove(item.id)}>Approve</Button>
                                            <Button size="small" color="error" onClick={() => handleRejectClick(item.id)}>Reject</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            <RejectionDialog
                open={!!rejectId}
                onClose={() => setRejectId(null)}
                onConfirm={handleRejectConfirm}
            />
        </Box>
    );
};
