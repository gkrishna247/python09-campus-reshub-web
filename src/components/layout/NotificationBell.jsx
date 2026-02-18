import React, { useState, useEffect } from "react";
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Button,
    Divider,
    useTheme,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import WarningIcon from "@mui/icons-material/Warning";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InfoIcon from "@mui/icons-material/Info";
import { notificationService } from "../../services/notificationService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getNotifications();
            if (res.data && Array.isArray(res.data)) {
                setNotifications(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error("Failed to mark all read", error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            // Optimistic update
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
            );
        } catch (error) {
            console.error("Failed to mark read", error);
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;
    const open = Boolean(anchorEl);

    const getIcon = (type) => {
        switch (type) {
            case "BOOKING_APPROVED":
                return <CheckCircleIcon color="success" />;
            case "BOOKING_REJECTED":
                return <CancelIcon color="error" />;
            case "BOOKING_CANCELLED":
                return <EventBusyIcon color="warning" />; // Using warning color for orange
            case "BOOKING_AUTO_CANCELLED":
                return <WarningIcon color="warning" />;
            case "REGISTRATION_APPROVED":
                return <HowToRegIcon color="success" />;
            case "REGISTRATION_REJECTED":
                return <PersonOffIcon color="error" />;
            case "ROLE_CHANGE_APPROVED":
                return <SwapHorizIcon color="success" />;
            case "ROLE_CHANGE_REJECTED":
                return <SwapHorizIcon color="error" />;
            default:
                return <InfoIcon color="info" />;
        }
    };

    return (
        <>
            <IconButton color="inherit" onClick={handleClick}>
                <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                PaperProps={{
                    sx: { width: 360, maxHeight, display, flexDirection: 'column' }
                }}
            >
                <Box sx={{ p: 2, display, justifyContent: "space-between", alignItems, borderBottom, borderColor: "divider" }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Notifications
                    </Typography>
                    {unreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAllRead}>
                            Mark all read
                        </Button>
                    )}
                </Box>
                <List sx={{ flexGrow: 1, overflow, p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: "center" }}>
                            <Typography variant="body2" color="text.secondary">
                                No notifications
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notification) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    alignItems="flex-start"
                                    onClick={() => !notification.is_read && handleMarkRead(notification.id)}
                                    sx={{
                                        bgcolor: notification.is_read ? "transparent" : (theme.palette.mode === 'light' ? 'rgba(63, 81, 181, 0.08)' : 'rgba(92, 107, 192, 0.12)'),
                                        cursor: "pointer",
                                        "&:hover": { bgcolor: theme.palette.action.hover },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: "transparent" }}>
                                            {getIcon(notification.message_type)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="body2"
                                                fontWeight={notification.is_read ? "normal" : "bold"}
                                                component="span"
                                            >
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5, mb: 0.5 }}>
                                                    {notification.body}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                    {dayjs(notification.created_at).fromNow()}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Popover>
        </>
    );
};
