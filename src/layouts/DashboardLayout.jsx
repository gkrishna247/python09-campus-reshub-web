import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Toolbar } from "@mui/material";
import { AppHeader } from "../components/layout/AppHeader";
import { Sidebar } from "../components/layout/Sidebar";

const DRAWER_WIDTH = 260;

export const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Use the same breakpoint logic as sidebar to determine mode


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <AppHeader onMenuClick={handleDrawerToggle} />

            <Sidebar
                open={mobileOpen}
                onClose={handleDrawerToggle}
                width={DRAWER_WIDTH}
            />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
                    minHeight: "100vh",
                    bgcolor: "background.default",
                }}
            >
                <Toolbar /> {/* Spacer for AppHeader */}
                <Outlet />
            </Box>
        </Box>
    );
};
