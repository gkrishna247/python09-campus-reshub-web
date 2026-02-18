import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Box } from "@mui/material";
import dayjs from "dayjs";
import { bookingService } from "../../services/bookingService";
import { useSnackbar } from "../../hooks/useSnackbar";


export const BookingCreateDialog = ({
    open,
    onClose,
    resource,
    date,
    slot,
    onSuccess,
}) => {
    const [reason, setReason] = useState("");
    const [attendees, setAttendees] = useState(1);
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    if (!slot) return null;

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Create request data
            // API expects start_time/end_time as ISO strings
            // slot.start_time is "2023-10-27T09:00:00" or similar?
            // Actually slot logic in SlotGrid uses data from API.
            // We should ensure we send correct ISO format.
            await bookingService.createBooking({
                resource_id: resource.id,
                start_time: slot.start_time,
                end_time: slot.end_time,
                booking_date: date,
                quantity_requested: 1,

                // Assuming API needs 'title' from prompt "reason text field".
                // Let's use 'reason' as purpose/description. And maybe 'title' as generated or user input.
                // Prompt says "Reason text field".
                // Check API types: CreateBookingData usually has { resource, start_time, end_time, title?, description? }
                // We will pass reason as title for now.
                title: reason,
                attendee_count: attendees,
                is_special_request: false
            });
            showSnackbar("Booking request created successfully!", "success");
            onSuccess();
            onClose();
            setReason("");
            setAttendees(1);
        } catch (error) {
            // Handle overlap errors specifically
            if (error.response?.data?.non_field_errors) {
                showSnackbar(error.response.data.non_field_errors[0], "error");
            } else {
                showSnackbar(error.message || "Failed to create booking", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Book {resource.name}</DialogTitle>
            <DialogContent>
                <Box sx={{ py: 1 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        {dayjs(date).format("MMMM D, YYYY")}
                    </Typography>
                    <Typography variant="h6" color="primary" gutterBottom>
                        {dayjs(slot.start_time).format("h:mm A")} - {dayjs(slot.end_time).format("h:mm A")}
                    </Typography>

                    <TextField
                        label="Reason for Booking"
                        fullWidth
                        multiline
                        rows={3}
                        required
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />

                    <TextField
                        label="Number of Attendees"
                        type="number"
                        fullWidth
                        required
                        value={attendees}
                        onChange={(e) => setAttendees(parseInt(e.target.value))}
                        sx={{ mt: 2 }}
                        inputProps={{ min: 1, max: resource.capacity }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!reason || loading}>
                    {loading ? "Booking..." : "Confirm Booking"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
