import { CircularProgress, Box, Typography } from "@mui/material";


export const LoadingSpinner = ({ message, fullScreen = false }) => {
    const content = (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: fullScreen ? "100vh" : "100%",
                width: "100%",
                minHeight: fullScreen ? undefined : 200,
            }}
        >
            <CircularProgress />
            {message && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            )}
        </Box>
    );

    return content;
};
