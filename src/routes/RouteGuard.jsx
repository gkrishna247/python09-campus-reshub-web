import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CircularProgress, Box } from "@mui/material";


export const RouteGuard = ({ requireApproved = true }) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <Box sx={{ display: "flex", justifyContent, alignItems, height: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Account status check
    if (user.account_status !== "ACTIVE") {
        // Ideally user is logged out or shown a specific "Account Inactive" page.
        // Instructions say: "If user.account_status !== 'ACTIVE': redirect to /login"
        return <Navigate to="/login" replace />;
    }

    // Approval status check
    if (requireApproved && user.approval_status !== "APPROVED") {
        // Build allow-list for pending users
        const allowedPaths = ["/approval-status", "/profile"];
        // Check if current path starts with allowed paths, or exactly matches
        const isAllowed = allowedPaths.some(path => location.pathname.startsWith(path));

        if (!isAllowed) {
            return <Navigate to="/approval-status" replace />;
        }
    }

    return <Outlet />;
};
