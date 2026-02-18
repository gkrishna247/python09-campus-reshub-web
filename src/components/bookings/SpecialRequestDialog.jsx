import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from "@mui/material";

// Section 7.10 says "SpecialRequestDialog". "Use resourceService.createRequest".
// Wait, createRequest in resourceService is for "ResourceAdditionRequest".
// Is "Special Request" about adding a resource or requesting a booing outside rules?
// The prompt says "Request Resource Page" (7.22) is for Staff.
// Section 7.10 "SpecialRequestDialog" -> "Form to submit special requests for resources (e.g. override rules)".
// This sounds like an Admin/Staff feature or a student requesting exemption.
// Let's assume it calls `bookingService.createBooking` with a flag or `resourceService.createCalendarOverride`?
// Or maybe it is sending a message?
// Actually, re-reading Section 7.6 logic: "ADMIN: show FAB...".
// Section 7.10 description: "Fields: Resource (pre-selected), Date, Time, Reason."
// This looks like a generic "Request Booking" dialog but maybe for restricted resources?
// Or maybe it maps to "ResourceAdditionRequest" if it means "I want a new resource"?
// No, "Fields: Resource (pre-selected)..." implies existing resource.
// So it is likely a Booking Request for a resource that requires special approval?
// I'll stick to `bookingService.createBooking` but maybe setting a type or just standard booking flow for "Special" resources.
// Or maybe "Special Request" refers to `calendar-overrides`?
// Let's implement it as a Booking Request dialog that allows custom times (not just slots).
// "Fields: Start Time, End Time, Reason".

import { bookingService } from "../../services/bookingService";
import { useSnackbar } from "../../hooks/useSnackbar";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";


export const SpecialRequestDialog = ({
    open,
    onClose,
    resource,
    onSuccess,
}) => {
    const [startTime, setStartTime] = useState(dayjs());
    const [endTime, setEndTime] = useState(dayjs().add(1, 'hour'));
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    const handleSubmit = async () => {
        if (!startTime || !endTime) return;

        setLoading(true);
        try {
            await bookingService.createBooking({
                resource_id: resource.id,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                title: reason,
                attendee_count: 1, // Default
                booking_date: startTime.format("YYYY-MM-DD"),
                quantity_requested: 1,
                is_special_request: true,
                special_request_reason: reason
            });
            showSnackbar("Special request submitted successfully!", "success");
            onSuccess();
            onClose();
        } catch (error) {
            showSnackbar(error.message || "Failed to submit request", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Special Request for {resource.name}</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ py: 2, display, flexDirection, gap: 3 }}>
                        <DateTimePicker
                            label="Start Time"
                            value={startTime}
                            onChange={(newValue) => setStartTime(newValue)}
                            sx={{ width: '100%' }}
                        />
                        <DateTimePicker
                            label="End Time"
                            value={endTime}
                            onChange={(newValue) => setEndTime(newValue)}
                            sx={{ width: '100%' }}
                        />
                        <TextField
                            label="Reason / Details"
                            fullWidth
                            multiline
                            rows={4}
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!reason || !startTime || !endTime || loading}>
                    {loading ? "Submitting..." : "Submit Request"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
