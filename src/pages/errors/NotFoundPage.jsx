import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
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
                <Typography variant="h1" color="primary" fontWeight="bold">
                    404
                </Typography>
                <Typography variant="h4" gutterBottom fontWeight="medium">
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    The page you're looking for doesn't exist or has been moved.
                </Typography>
                <Button variant="contained" size="large" onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                </Button>
            </Box>
        </Container>
    );
};
