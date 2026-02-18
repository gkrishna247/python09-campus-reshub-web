import { useNavigate, useLocation } from "react-router-dom";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, useMediaQuery, useTheme, Box } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonIcon from "@mui/icons-material/Person";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import InsightsIcon from "@mui/icons-material/Insights";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";


export const Sidebar = ({ open, onClose, width }) => {
    const { user } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const navigate = useNavigate();
    const location = useLocation();

    if (!user) return null;

    const menuItems = [];

    // STUDENT
    if (user.role === ROLES.STUDENT) {
        menuItems.push(
            { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            { label: "Resources", icon: <MeetingRoomIcon />, path: "/resources" },
            { label: "My Bookings", icon: <EventNoteIcon />, path: "/bookings" },
            { label: "Profile", icon: <PersonIcon />, path: "/profile" }
        );
    }

    // FACULTY
    if (user.role === ROLES.FACULTY) {
        menuItems.push(
            { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            { label: "Resources", icon: <MeetingRoomIcon />, path: "/resources" },
            { label: "My Bookings", icon: <EventNoteIcon />, path: "/bookings" },
            { label: "Approvals", icon: <HowToRegIcon />, path: "/admin/approvals" },
            { label: "Profile", icon: <PersonIcon />, path: "/profile" }
        );
    }

    // STAFF
    if (user.role === ROLES.STAFF) {
        menuItems.push(
            { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            { label: "My Resources", icon: <MeetingRoomIcon />, path: "/staff/resources" },
            { label: "Booking Approvals", icon: <FactCheckIcon />, path: "/staff/bookings" },
            { label: "Request Resource", icon: <AddBusinessIcon />, path: "/staff/request-resource" },
            { label: "Profile", icon: <PersonIcon />, path: "/profile" }
        );
    }

    // ADMIN
    if (user.role === ROLES.ADMIN) {
        menuItems.push(
            { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
            { label: "Users", icon: <PeopleIcon />, path: "/admin/users" },
            { label: "Resources", icon: <MeetingRoomIcon />, path: "/resources" },
            { label: "All Bookings", icon: <EventNoteIcon />, path: "/bookings" },
            { label: "Approvals", icon: <HowToRegIcon />, path: "/admin/approvals" },
            { label: "Calendar", icon: <CalendarMonthIcon />, path: "/admin/calendar" },
            { label: "Audit Logs", icon: <ReceiptLongIcon />, path: "/admin/audit-logs" },
            { label: "Statistics", icon: <InsightsIcon />, path: "/admin/statistics" },
            { label: "Profile", icon: <PersonIcon />, path: "/profile" }
        );
    }

    const drawerContent = (
        <div>
            <Toolbar /> {/* Spacer for AppHeader */}
            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path + '/'));
                    return (
                        <ListItem key={item.label} disablePadding>
                            <ListItemButton
                                selected={isActive}
                                onClick={() => {
                                    navigate(item.path);
                                    if (isMobile) onClose();
                                }}
                                sx={{
                                    borderRadius: 1,
                                    mx: 1,
                                    mb: 0.5,
                                    "&.Mui-selected": {
                                        bgcolor: "primary.light",
                                        color: "primary.contrastText",
                                        "& .MuiListItemIcon-root": {
                                            color: "primary.contrastText",
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? "inherit" : "inherit" }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </div>
    );

    return (
        <Box component="nav" sx={{ width: { lg: width }, flexShrink: { lg: 0 } }}>
            {/* Temporary drawer for mobile/tablet */}
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", lg: "none" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box", width: width,
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Permanent drawer for desktop */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: "none", lg: "block" },
                    "& .MuiDrawer-paper": {
                        boxSizing: "border-box", width: width,
                    },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};
