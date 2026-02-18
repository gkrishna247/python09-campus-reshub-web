import { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Grid, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch, Divider } from "@mui/material";
import { resourceService } from "../../services/resourceService";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

export const ScheduleManagementPage = () => {
    const { showSnackbar } = useSnackbar();
    const [resources, setResources] = useState([]);
    const [selectedResourceId, setSelectedResourceId] = useState("");
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        resourceService.getResources({ page: 1 }).then(res => {
            // Fetch all? Only first page. For admin MVP okay.
            setResources(res.data.results);
        });
    }, []);

    useEffect(() => {
        if (!selectedResourceId) return;
        setLoading(true);
        resourceService.getResourceSchedule(parseInt(selectedResourceId)).then(res => {
            // Ensure 7 days
            const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            // API returns array. Map or fill missing.
            let fullSchedule = days.map(day => {
                const existing = res.data.find((s) => s.day_of_week === day);
                return existing ? { ...existing, is_working: existing.is_working ?? true } : { day_of_week: day, start_time: "08:00:00", end_time: "18:00:00", is_working: true };
            });
            setSchedule(fullSchedule);
            setLoading(false);
        });
    }, [selectedResourceId]);

    const handleSave = async () => {
        if (!selectedResourceId) return;
        try {
            await resourceService.updateResourceSchedule(parseInt(selectedResourceId), schedule);
            showSnackbar("Schedule updated", "success");
        } catch (error) {
            showSnackbar("Failed to update schedule", "error");
        }
    };

    const updateDay = (index, field, value) => {
        const newSchedule = [...schedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSchedule(newSchedule);
    };

    return (
        <Box maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom>Schedule Management</Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <FormControl fullWidth>
                    <InputLabel>Select Resource</InputLabel>
                    <Select
                        value={selectedResourceId}
                        label="Select Resource"
                        onChange={(e) => setSelectedResourceId(e.target.value)}
                    >
                        {resources.map(r => <MenuItem key={r.id} value={r.id.toString()}>{r.name} ({r.type})</MenuItem>)}
                    </Select>
                </FormControl>
            </Paper>

            {selectedResourceId && (
                <Paper sx={{ p: 3 }}>
                    {loading ? <LoadingSpinner /> : (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <Grid container spacing={2}>
                                {schedule.map((day, index) => (
                                    <Grid size={{ xs: 12 }} key={day.day_of_week}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography sx={{ width: 100, fontWeight: 'bold' }}>{day.day_of_week}</Typography>

                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={!day.is_working}
                                                        onChange={(e) => updateDay(index, 'is_working', !e.target.checked)}
                                                    />
                                                }
                                                label="Closed"
                                            />

                                            {day.is_working && (
                                                <>
                                                    <TimePicker
                                                        label="Open"
                                                        value={dayjs(`2000-01-01T${day.start_time}`)}
                                                        onChange={(v) => v && updateDay(index, 'start_time', v.format("HH:mm:ss"))}
                                                        slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                                                    />
                                                    <Typography>-</Typography>
                                                    <TimePicker
                                                        label="Close"
                                                        value={dayjs(`2000-01-01T${day.end_time}`)}
                                                        onChange={(v) => v && updateDay(index, 'end_time', v.format("HH:mm:ss"))}
                                                        slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                                                    />
                                                </>
                                            )}
                                        </Box>
                                        <Divider sx={{ my: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button variant="contained" onClick={handleSave}>Save Schedule</Button>
                            </Box>
                        </LocalizationProvider>
                    )}
                </Paper>
            )}
        </Box>
    );
};
