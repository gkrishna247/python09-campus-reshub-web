import { useState, useEffect } from "react";
import { Box, Typography, Grid, Paper, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { statisticsService } from "../../services/statisticsService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { TIME_RANGES, RESOURCE_TYPES } from "../../utils/constants";


export const StatisticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState(TIME_RANGES.THIS_MONTH);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await statisticsService.getStatistics(range);
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch statistics", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [range]);

    if (loading) return <LoadingSpinner />;
    if (!stats) return <Typography>No data available</Typography>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">System Statistics</Typography>
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Time Range</InputLabel>
                    <Select value={range} label="Time Range" onChange={(e) => setRange(e.target.value)}>
                        {Object.values(TIME_RANGES).map(r => <MenuItem key={r} value={r}>{r.replace('_', ' ')}</MenuItem>)}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {/* Core Metrics */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Total Bookings</Typography>
                            <Typography variant="h4">{stats.bookings?.total_in_range || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Active Users</Typography>
                            <Typography variant="h4">{stats.users?.total || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Resources</Typography>
                            <Typography variant="h4">{stats.resources?.total || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Utilization</Typography>
                            <Typography variant="h4">{Math.round(stats.utilization?.overall_rate || 0)}%</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Breakdown */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Bookings by Status</Typography>
                        <Box sx={{ mt: 2 }}>
                            {Object.entries(stats.bookings?.by_status || {}).map(([status, count]) => (
                                <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                                    <Typography>{status}</Typography>
                                    <Typography fontWeight="bold">{count}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>Resource Utilization (Hours)</Typography>
                        <Box sx={{ mt: 2 }}>
                            {/* Make a simple text bar chart */}
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Labs</Typography>
                                    <Typography variant="body2">{stats.utilization?.by_type[RESOURCE_TYPES.LAB] || 0} hrs</Typography>
                                </Box>
                                <Box sx={{ width: '100%', bgcolor: 'background.default', height: 8, borderRadius: 1 }}>
                                    <Box sx={{ width: `${Math.min((stats.utilization?.by_type[RESOURCE_TYPES.LAB] || 0) / 10, 100)}%`, bgcolor: 'primary.main', height: '100%', borderRadius: 1 }} />
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Classrooms</Typography>
                                    <Typography variant="body2">{stats.utilization?.by_type[RESOURCE_TYPES.CLASSROOM] || 0} hrs</Typography>
                                </Box>
                                <Box sx={{ width: '100%', bgcolor: 'background.default', height: 8, borderRadius: 1 }}>
                                    <Box sx={{ width: `${Math.min((stats.utilization?.by_type[RESOURCE_TYPES.CLASSROOM] || 0) / 10, 100)}%`, bgcolor: 'secondary.main', height: '100%', borderRadius: 1 }} />
                                </Box>
                            </Box>

                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Event Halls</Typography>
                                    <Typography variant="body2">{stats.utilization?.by_type[RESOURCE_TYPES.EVENT_HALL] || 0} hrs</Typography>
                                </Box>
                                <Box sx={{ width: '100%', bgcolor: 'background.default', height: 8, borderRadius: 1 }}>
                                    <Box sx={{ width: `${Math.min((stats.utilization?.by_type[RESOURCE_TYPES.EVENT_HALL] || 0) / 10, 100)}%`, bgcolor: 'info.main', height: '100%', borderRadius: 1 }} />
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
