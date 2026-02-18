import { AppBar, Toolbar, IconButton, Typography, Box, Avatar, Menu, MenuItem, useTheme, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export const AppHeader = ({ onMenuClick }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleMenuClose();
        navigate("/profile");
    };

    const handleLogout = async () => {
        handleMenuClose();
        await logout();
        navigate("/login");
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'background.default', color: "text.primary" }} elevation={1}>
            <Toolbar>
                {isMobile && (
                    <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                )}

                <SchoolIcon color="primary" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }} />
                <Typography variant="h6" noWrap component="div" color="primary" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    Campus ResHub
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ThemeToggle />
                    <NotificationBell />

                    <Box sx={{ display: 'flex', alignItems: 'center', ml, cursor: 'pointer' }} onClick={handleMenuOpen}>
                        <Avatar sx={{ width: 32, height, bgcolor: 'background.default', fontSize: '1rem' }}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }} fontWeight="medium">
                            {user?.name}
                        </Typography>
                    </Box>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                    >
                        <MenuItem onClick={handleProfile}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};
