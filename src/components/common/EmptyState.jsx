import { Box, Typography, Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";


export const EmptyState = ({ icon, title, message, action }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
                textAlign: "center",
                height: "100%",
                minHeight: 300,
            }}
        >
            {icon && (
                <Box sx={{ mb: 2, color, fontSize, "& svg": { fontSize: 60 } }}>
                    {icon}
                </Box>
            )}
            <Typography variant="h6" gutterBottom color="text.primary">
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
                {message}
            </Typography>
            {action && (
                action.to ? (
                    <Button variant="contained" component={RouterLink} to={action.to}>
                        {action.label}
                    </Button>
                ) : (
                    <Button variant="contained" onClick={action.onClick}>
                        {action.label}
                    </Button>
                )
            )}
        </Box>
    );
};
