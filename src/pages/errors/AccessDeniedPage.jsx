import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

export const AccessDeniedPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "80vh",
                    textAlign: "center",
                }}
            >
                <LockIcon sx={{ fontSize: 100, color, mb: 2 }} />
                <Typography variant="h1" color="error" fontWeight="bold">
                    403
                </Typography>
                <Typography variant="h4" gutterBottom fontWeight="medium">
                    Access Denied
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    You don't have permission to access this page.
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                </Button>
            </Box>
        </Container>
    );
};
