import { useState, useEffect } from "react";
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    FormControl, InputLabel, Select, MenuItem, TablePagination, Chip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { userService } from "../../services/userService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { useSnackbar } from "../../hooks/useSnackbar";
import { ROLES, ACCOUNT_STATUSES } from "../../utils/constants";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";

export const UserManagementPage = () => {
    const { showSnackbar } = useSnackbar();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [search, setSearch] = useState("");

    // Edit Dialog
    const [editUser, setEditUser] = useState(null);
    const [editData, setEditData] = useState({});

    // Delete Dialog
    const [deleteId, setDeleteId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userService.getUsers({
                page: page + 1,
                search: search || undefined
            });
            setUsers(res.data.results);
            setTotalCount(res.data.count);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleEditClick = (user) => {
        setEditUser(user);
        setEditData({ role: user.role, account_status: user.account_status });
    };

    const handleEditSave = async () => {
        if (!editUser) return;
        try {
            await userService.updateUser(editUser.id, editData);
            showSnackbar("User updated successfully", "success");
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            showSnackbar(error.message || "Failed to update user", "error");
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await userService.deleteUser(deleteId);
            showSnackbar("User deleted successfully", "success");
            setDeleteId(null);
            fetchUsers();
        } catch (error) {
            showSnackbar(error.message || "Failed to delete user", "error");
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">User Management</Typography>
                <TextField
                    placeholder="Search users..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>

            {loading ? <LoadingSpinner /> : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Approval</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell><Chip label={user.role} size="small" /></TableCell>
                                        <TableCell>
                                            <Chip
                                                label={user.account_status}
                                                color={user.account_status === 'ACTIVE' ? "success" : "error"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>{user.approval_status}</TableCell>
                                        <TableCell>
                                            <IconButton size="small" onClick={() => handleEditClick(user)}><EditIcon /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => setDeleteId(user.id)}><DeleteIcon /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={totalCount}
                        page={page}
                        onPageChange={(_e, p) => setPage(p)}
                        rowsPerPage={10}
                        rowsPerPageOptions={[]}
                    />
                </Paper>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="xs" fullWidth>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={editData.role || ""}
                                label="Role"
                                onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                            >
                                {Object.values(ROLES).map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={editData.account_status || ""}
                                label="Status"
                                onChange={(e) => setEditData({ ...editData, account_status: e.target.value })}
                            >
                                {Object.values(ACCOUNT_STATUSES).map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditUser(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditSave}>Save</Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <ConfirmDialog
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText="Delete"
                severity="error"
            />
        </Box>
    );
};
