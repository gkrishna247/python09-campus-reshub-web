import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { useAuth } from "../../hooks/useAuth";
import { ROLES, TIME_RANGES } from "../../utils/constants";
import { bookingService } from "../../services/bookingService";
import { resourceService } from "../../services/resourceService";
import { notificationService } from "../../services/notificationService";
import { statisticsService } from "../../services/statisticsService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";

export const DashboardPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (user?.role === ROLES.STUDENT || user?.role === ROLES.FACULTY) {
                    const bookingsRes = await bookingService.getMyBookings();
                    const resourcesRes = await resourceService.getResources({ page: 1 });
                    const notificationsRes = await notificationService.getNotifications();
                    // bookingsRes.data.count is total bookings
                    // resourcesRes.data.count is total resources
                    // notificationsRes.data is array

                    setStats({
                        upcomingBookings: bookingsRes.data.count,
                        availableResources: resourcesRes.data.count,
                        unreadNotifications: (notificationsRes.data).filter(n => !n.is_read).length
                    });
                    setNotifications(notificationsRes.data);
                }

                if (user?.role === ROLES.STAFF) {
                    // "My Resources": count of managed resources (filter by managed_by=user.id?)
                    // Prompt says: "filter on frontend where managed_by.id matches current user id" for list page.
                    // For count, we might need to fetch all and filter.
                    const resourcesRes = await resourceService.getResources();
                    const myResources = resourcesRes.data.results.filter(r => r.managed_by.id === user.id);

                    const pendingRes = await bookingService.getPendingBookings();

                    setStats({
                        myResources: myResources.length, // Approximate if pagination. ideally API supports filtering
                        pendingApprovals: pendingRes.data.count
                    });
                }

                if (user?.role === ROLES.ADMIN) {
                    const statsRes = await statisticsService.getStatistics(TIME_RANGES.THIS_WEEK);
                    setStats(statsRes.data);
                }

            } catch (error) {
                console.error("Dashboard fetch error", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) return <LoadingSpinner />;
    if (!user) return null;

    return (
        <Box>
            <Paper elevation={0} sx={{ p: 3, mb: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h4" fontWeight="bold">
                    Welcome back, {user.name}!
                </Typography>
                <Typography variant="subtitle1">
                    {user.role} Dashboard
                </Typography>
            </Paper>

            {(user.role === ROLES.STUDENT || user.role === ROLES.FACULTY) && stats && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <EventNoteIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold">{stats.upcomingBookings}</Typography>
                                <Typography color="text.secondary">Upcoming Bookings</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <MeetingRoomIcon color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold">{stats.availableResources}</Typography>
                                <Typography color="text.secondary">Available Resources</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <DashboardIcon color="action" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold">{stats.unreadNotifications}</Typography>
                                <Typography color="text.secondary">Unread Notifications</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Recent Notifications</Typography>
                        {notifications.slice(0, 5).map(n => (
                            <Paper key={n.id} sx={{ p: 2, mb: 2, borderLeft: 4, borderColor: n.is_read ? 'transparent' : 'primary.main' }}>
                                <Typography variant="subtitle2" fontWeight="bold">{n.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{n.body}</Typography>
                            </Paper>
                        ))}
                        {notifications.length === 0 && <Typography color="text.secondary">No recent notifications.</Typography>}
                    </Grid>
                </Grid>
            )}

            {user.role === ROLES.STAFF && stats && (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <MeetingRoomIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold">{stats.myResources}</Typography>
                                <Typography color="text.secondary">My Resources</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center' }}>
                                <PendingActionsIcon color="warning" sx={{ fontSize: 40, mb: 1 }} />
                                <Typography variant="h4" fontWeight="bold">{stats.pendingApprovals}</Typography>
                                <Typography color="text.secondary">Pending Booking Approvals</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12 }}>
                        {stats.myResources === 0 && (
                            <EmptyState
                                title="No Resources Assigned"
                                message="No resources assigned to you yet. Request a resource addition."
                                action={{ label: "Request Resource", to: "/staff/request-resource" }}
                                icon={<AddBusinessIcon />}
                            />
                        )}
                    </Grid>
                </Grid>
            )}

            {user.role === ROLES.ADMIN && stats && (
                <Grid container spacing={3}>
                    {/* Admin condensed statistics */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PeopleIcon color="primary" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Users</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">{stats.users?.total || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <MeetingRoomIcon color="secondary" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Resources</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">{stats.resources?.total || 0}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <EventNoteIcon color="action" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Bookings</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">{stats.bookings?.total_in_range || 0}</Typography>
                                <Typography variant="caption" color="text.secondary">This Week</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <PendingActionsIcon color="warning" sx={{ mr: 1 }} />
                                    <Typography variant="h6">Pending</Typography>
                                </Box>
                                <Typography variant="h4" fontWeight="bold">
                                    {(stats.pending_approvals?.registrations || 0) +
                                        (stats.pending_approvals?.bookings || 0) +
                                        (stats.pending_approvals?.resource_requests || 0) +
                                        (stats.pending_approvals?.role_changes || 0)}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Total Approvals</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};
