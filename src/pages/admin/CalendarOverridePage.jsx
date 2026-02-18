import { useState, useEffect } from "react";
import { Box, Typography, Paper, Button, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, ListItemSecondaryAction } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { resourceService } from "../../services/resourceService";
import { useSnackbar } from "../../hooks/useSnackbar";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export const CalendarOverridePage = () => {
    const { showSnackbar } = useSnackbar();
    const [overrides, setOverrides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openAdd, setOpenAdd] = useState(false);

    // Form
    const [formDate, setFormDate] = useState(null);
    const [formReason, setFormReason] = useState("");

    const fetchOverrides = async () => {
        setLoading(true);
        try {
            const res = await resourceService.getCalendarOverrides();
            setOverrides(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverrides();
    }, []);

    const handleAdd = async () => {
        if (!formDate || !formReason) return;
        try {
            await resourceService.createCalendarOverride({
                override_date: formDate.format("YYYY-MM-DD"),
                override_type: "HOLIDAY",
                description: formReason
            });
            showSnackbar("Override added", "success");
            setOpenAdd(false);
            setFormDate(null);
            setFormReason("");
            fetchOverrides();
        } catch (error) {
            showSnackbar(error.message || "Failed to add override", "error");
        }
    };

    const handleDelete = async (id) => {
        try {
            await resourceService.deleteCalendarOverride(id);
            showSnackbar("Override removed", "success");
            fetchOverrides();
        } catch (error) {
            showSnackbar(error.message || "Failed to remove override", "error");
        }
    };

    return (
        <Box maxWidth="md">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Calendar Overrides</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
                    Add Holiday / Closure
                </Button>
            </Box>

            <Paper>
                {loading ? <LoadingSpinner /> : (
                    <List>
                        {overrides.length === 0 ? (
                            <Typography sx={{ p: 2, textAlign, color: 'text.secondary' }}>No overrides configured.</Typography>
                        ) : overrides.map((item) => (
                            <ListItem key={item.id} divider>
                                <ListItemText
                                    primary={dayjs(item.date).format("MMMM D, YYYY")}
                                    secondary={item.reason}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" color="error" onClick={() => handleDelete(item.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>

            <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
                <DialogTitle>Add Calendar Override</DialogTitle>
                <DialogContent sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 1, minWidth: 300 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date"
                            value={formDate}
                            onChange={(n) => setFormDate(n)}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Reason (e.g. Public Holiday)"
                        value={formReason}
                        onChange={(e) => setFormReason(e.target.value)}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAdd} disabled={!formDate || !formReason}>Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
