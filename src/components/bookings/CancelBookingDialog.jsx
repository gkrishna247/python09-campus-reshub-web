import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography } from "@mui/material";


export const CancelBookingDialog = ({
    open,
    onClose,
    onConfirm,
}) => {
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        onConfirm(reason);
        setReason("");
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Are you sure you want to cancel this booking?
                </Typography>
                <TextField
                    label="Reason for Cancellation"
                    fullWidth
                    multiline
                    rows={2}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Keep Booking</Button>
                <Button onClick={handleConfirm} variant="contained" color="error" disabled={!reason}>
                    Cancel Booking
                </Button>
            </DialogActions>
        </Dialog>
    );
};
