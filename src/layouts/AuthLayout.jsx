import { Outlet } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

export const AuthLayout = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "background.default", // Uses theme background
                p: 2,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems, mb: 3 }}>
                        <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 1 }} />
                        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                            Campus ResHub
                        </Typography>
                    </Box>
                    <Box sx={{ width: "100%" }}>
                        <Outlet />
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};
