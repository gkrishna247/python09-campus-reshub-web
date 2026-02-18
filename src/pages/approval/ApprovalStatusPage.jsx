import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, Chip, CircularProgress, Alert } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { APPROVAL_STATUSES } from "../../utils/constants";

export const ApprovalStatusPage = () => {
    const { user, logout, refreshAccessToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [statusData, setStatusData] = useState(null);

    const fetchStatus = async () => {
        setLoading(true);
        try {
            const response = await authService.getApprovalStatus();
            // response.data holds the status info
            setStatusData(response.data);

            // If approved, update token logic might be needed if roles changed or strict checks.
            // But mostly just navigation.
            if (response.data.approval_status === APPROVAL_STATUSES.APPROVED) {
                // Force token refresh to update claims if needed
                await refreshAccessToken();
            }
        } catch (error) {
            console.error("Failed to fetch approval status", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const status = statusData?.approval_status || user?.approval_status;

    const renderContent = () => {
        if (status === APPROVAL_STATUSES.PENDING) {
            return (
                <Paper elevation={3} sx={{ p: 4, textAlign, maxWidth: 600 }}>
                    <Chip label="Pending Approval" color="warning" sx={{ mb: 2, fontSize, px, py: 0.5 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Application Under Review
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Your registration is pending approval. An authorized user will review your application shortly.
                        Please check back later.
                    </Typography>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={fetchStatus}
                            disabled={loading}
                        >
                            Refresh Status
                        </Button>
                        <Button variant="text" color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </Paper>
            );
        }

        if (status === APPROVAL_STATUSES.APPROVED) {
            return (
                <Paper elevation={3} sx={{ p: 4, textAlign, maxWidth: 600 }}>
                    <Chip label="Account Approved" color="success" sx={{ mb: 2, fontSize, px, py: 0.5 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Welcome to Campus ResHub!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Your account has been approved! You now have full access to the system.
                    </Typography>

                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => navigate("/dashboard")}
                        >
                            Go to Dashboard
                        </Button>
                    </Box>
                </Paper>
            );
        }

        if (status === APPROVAL_STATUSES.REJECTED) {
            return (
                <Paper elevation={3} sx={{ p: 4, textAlign, maxWidth: 600 }}>
                    <Chip label="Registration Rejected" color="error" sx={{ mb: 2, fontSize, px, py: 0.5 }} />
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Application Rejected
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Your registration was rejected.
                    </Typography>

                    {statusData?.rejection_reason && (
                        <Alert severity="error" variant="outlined" sx={{ mt: 2, mb, textAlign: 'left' }}>
                            <strong>Reason:</strong> {statusData.rejection_reason}
                        </Alert>
                    )}

                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button variant="outlined" color="primary" onClick={handleLogout}>
                            Logout
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            Please contact the administrator for more information.
                        </Typography>
                    </Box>
                </Paper>
            );
        }

        return <CircularProgress />;
    };

    return (
        <Box sx={{ width: "100%", display: 'flex', justifyContent: "center" }}>
            {renderContent()}
        </Box>
    );
};
