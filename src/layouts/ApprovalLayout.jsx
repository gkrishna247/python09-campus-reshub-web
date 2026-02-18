import { Outlet, useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../hooks/useAuth";

export const ApprovalLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: 'background.default', display: 'flex', flexDirection: "column" }}>
            <AppBar position="static" color="default" elevation={1}>
                <Toolbar>
                    <SchoolIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" color="primary" fontWeight="bold" sx={{ flexGrow: 1 }}>
                        Campus ResHub
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Container maxWidth="sm" sx={{ mt: 8, flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: "center" }}>
                <Outlet />
            </Container>
        </Box>
    );
};
