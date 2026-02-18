import { useEffect, useState } from "react";
import {
    Box, Typography, Paper, Grid, TextField, Button, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    FormControl, InputLabel, Select, MenuItem, Tooltip
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";
import { userService } from "../../services/userService";
import { PasswordChecklist } from "../../components/common/PasswordChecklist";
import { isPasswordValid } from "../../utils/validators";
import { APPROVAL_STATUSES, ROLES } from "../../utils/constants";

export const ProfilePage = () => {
    const { user, refreshAccessToken } = useAuth();
    const { showSnackbar } = useSnackbar();

    // Profile Form State
    const [profileData, setProfileData] = useState({ name: "", phone: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Password Form State
    const [passData, setPassData] = useState({ current: "", new: "", confirm: "" });
    const [loadingPass, setLoadingPass] = useState(false);

    // Role Request State
    const [roleRequests, setRoleRequests] = useState([]);
    const [requestedRole, setRequestedRole] = useState("");
    const [loadingRole, setLoadingRole] = useState(false);

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name, phone: user.phone || "" });
            if (user.approval_status === APPROVAL_STATUSES.APPROVED && user.role !== ROLES.ADMIN) {
                fetchRoleRequests();
            }
        }
    }, [user]);

    const fetchRoleRequests = async () => {
        try {
            const res = await userService.getMyRoleChangeRequests();
            if (Array.isArray(res.data)) {
                setRoleRequests(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch role requests", error);
        }
    };

    const handleProfileUpdate = async () => {
        setLoadingProfile(true);
        try {
            await userService.updateProfile({ name: profileData.name, phone: profileData.phone });
            await refreshAccessToken(); // Refresh to update user context
            setIsEditing(false);
            showSnackbar("Profile updated successfully.", "success");
        } catch (error) {
            showSnackbar(error.message || "Failed to update profile.", "error");
        } finally {
            setLoadingProfile(false);
        }
    };

    const handlePasswordChange = async () => {
        setLoadingPass(true);
        try {
            await userService.changePassword({
                current_password: passData.current,
                new_password: passData.new,
                confirm_password: passData.confirm
            });
            setPassData({ current: "", new: "", confirm: "" });
            showSnackbar("Password changed successfully.", "success");
        } catch (error) {
            showSnackbar(error.message || "Failed to change password.", "error");
        } finally {
            setLoadingPass(false);
        }
    };

    const handleRoleRequest = async () => {
        if (!requestedRole) return;
        setLoadingRole(true);
        try {
            await userService.requestRoleChange(requestedRole);
            showSnackbar("Role change request submitted.", "success");
            setRequestedRole("");
            fetchRoleRequests();
        } catch (error) {
            showSnackbar(error.message || "Failed to request role change.", "error");
        } finally {
            setLoadingRole(false);
        }
    };

    if (!user) return null;

    const isApproved = user.approval_status === APPROVAL_STATUSES.APPROVED;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Profile
            </Typography>

            {/* Section 1: Profile Information */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Profile Information</Typography>
                    {isApproved && !isEditing && (
                        <Button variant="outlined" onClick={() => setIsEditing(true)}>Edit</Button>
                    )}
                </Box>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Name"
                            value={isEditing ? profileData.name : user.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            InputProps={{ readOnly: !isEditing }}
                            variant={isEditing ? "outlined" : "filled"}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={user.email}
                            InputProps={{
                                readOnly: true,
                                endAdornment: <Tooltip title="Email cannot be changed"><LockIcon color="action" /></Tooltip>
                            }}
                            variant="filled"
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone"
                            value={isEditing ? profileData.phone : (user.phone || "")}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            InputProps={{ readOnly: !isEditing }}
                            variant={isEditing ? "outlined" : "filled"}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Chip label={`Role: ${user.role}`} color="primary" variant="outlined" />
                        <Chip label={`Status: ${user.account_status}`} color={user.account_status === 'ACTIVE' ? "success" : "error"} variant="outlined" />
                        <Chip label={`Approval: ${user.approval_status}`} color={user.approval_status === 'APPROVED' ? "success" : "warning"} variant="outlined" />
                    </Grid>
                </Grid>
                {isEditing && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                        <Button variant="contained" onClick={handleProfileUpdate} disabled={loadingProfile}>Save</Button>
                        <Button variant="outlined" onClick={() => { setIsEditing(false); setProfileData({ name: user.name, phone: user.phone || "" }); }}>Cancel</Button>
                    </Box>
                )}
            </Paper>

            {/* Section 2: Change Password */}
            {isApproved && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Change Password</Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth type="password" label="Current Password"
                                value={passData.current} onChange={(e) => setPassData({ ...passData, current: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth type="password" label="New Password"
                                value={passData.new} onChange={(e) => setPassData({ ...passData, new: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth type="password" label="Confirm Password"
                                value={passData.confirm} onChange={(e) => setPassData({ ...passData, confirm: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                    <Box sx={{ maxWidth: 400 }}>
                        <PasswordChecklist password={passData.new} confirmPassword={passData.confirm} />
                    </Box>
                    <Button
                        variant="contained" sx={{ mt: 2 }}
                        onClick={handlePasswordChange}
                        disabled={loadingPass || !passData.current || !isPasswordValid(passData.new) || passData.new !== passData.confirm}
                    >
                        Change Password
                    </Button>
                </Paper>
            )}

            {/* Section 3: Role Change Request */}
            {isApproved && user.role !== ROLES.ADMIN && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Role Change Request</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3 }}>
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Request New Role</InputLabel>
                            <Select
                                value={requestedRole}
                                label="Request New Role"
                                onChange={(e) => setRequestedRole(e.target.value)}
                            >
                                {Object.values(ROLES).filter(r => r !== ROLES.ADMIN && r !== user.role).map(role => (
                                    <MenuItem key={role} value={role}>{role}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleRoleRequest} disabled={!requestedRole || loadingRole}>
                            Request Role Change
                        </Button>
                    </Box>

                    <Typography variant="subtitle2" gutterBottom>My Requests</Typography>
                    {roleRequests.length > 0 ? (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Requested Role</TableCell>
                                        <TableCell>Current Role</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Reason</TableCell>
                                        <TableCell>Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roleRequests.map((req) => (
                                        <TableRow key={req.id}>
                                            <TableCell>{req.requested_role}</TableCell>
                                            <TableCell>{req.current_role}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={req.status}
                                                    size="small"
                                                    color={req.status === 'APPROVED' ? 'success' : req.status === 'REJECTED' ? 'error' : 'warning'}
                                                />
                                            </TableCell>
                                            <TableCell>{req.rejection_reason || '-'}</TableCell>
                                            <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography color="text.secondary">No role change requests found.</Typography>
                    )}
                </Paper>
            )}
        </Box>
    );
};
