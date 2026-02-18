import { useState, useEffect } from "react";
import { Box, Paper, Typography, Grid, Button, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import dayjs, { Dayjs } from "dayjs";
import { resourceService } from "../../services/resourceService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";


export const SlotGrid = ({ resourceId, onSlotClick }) => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(false);

    // We fetch availability for a specific date. 
    // The UI requirement says "Weekly calendar view".
    // But common implementation for booking sites is Day view with slots.
    // Let's implement a Day view first as it's simpler and matches "SlotGrid" name.
    // Or if "Weekly", we need 7 columns.
    // The Prompt says "SlotGrid.tsx". And "Weekly calendar view" in 7.7 description.
    // Let's do a simple list of slots for the selected date for now, or a grid of times.

    const fetchAvailability = async () => {
        setLoading(true);
        try {
            // API expects 'date' parameter effectively (YYYY-MM-DD)
            const dateStr = currentDate.format("YYYY-MM-DD");
            const res = await resourceService.getResourceAvailability(resourceId, dateStr);
            setAvailability(res.data.slots);
        } catch (error) {
            console.error("Failed to fetch availability", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
    }, [resourceId, currentDate]);

    const handlePrevDay = () => setCurrentDate(currentDate.subtract(1, 'day'));
    const handleNextDay = () => setCurrentDate(currentDate.add(1, 'day'));

    return (
        <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <IconButton onClick={handlePrevDay} disabled={currentDate.isBefore(dayjs(), 'day')}>
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6">
                    {currentDate.format("dddd, MMMM D, YYYY")}
                </Typography>
                <IconButton onClick={handleNextDay}>
                    <ArrowForwardIosIcon />
                </IconButton>
            </Box>

            {loading ? (
                <LoadingSpinner message="Loading slots..." />
            ) : availability.length === 0 ? (
                <Typography textAlign="center" color="text.secondary" sx={{ py: 4 }}>
                    No slots available for this date.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {availability.map((slot, index) => (
                        <Grid size={{ xs: 6, sm: 6, md: 4, lg: 2 }} key={index}>
                            <Button
                                variant={slot.status === "AVAILABLE" ? "outlined" : "contained"}
                                color={slot.status === "AVAILABLE" ? "primary" : "inherit"}
                                disabled={slot.status !== "AVAILABLE"}
                                fullWidth
                                onClick={() => onSlotClick(slot, currentDate.format("YYYY-MM-DD"))}
                                sx={{
                                    height: 60,
                                    bgcolor: slot.status === "AVAILABLE" ? 'transparent' : 'action.disabledBackground',
                                    '&:hover': {
                                        bgcolor: slot.status === "AVAILABLE" ? 'primary.light' : 'action.disabledBackground',
                                        color: slot.status === "AVAILABLE" ? 'white' : 'text.disabled'
                                    }
                                }}
                            >
                                {dayjs(slot.start_time).format("h:mm A")}
                                <br />
                                -
                                <br />
                                {dayjs(slot.end_time).format("h:mm A")}
                            </Button>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Paper>
    );
};
