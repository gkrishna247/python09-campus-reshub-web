import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, TextField, Button, FormControl, InputLabel, Select, MenuItem, Grid } from "@mui/material";
import { resourceService } from "../../services/resourceService";
import { useSnackbar } from "../../hooks/useSnackbar";
import { RESOURCE_TYPES } from "../../utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const RequestResourcePage = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: RESOURCE_TYPES.LAB,
        capacity: "30",
        description: "",
        reason: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as string]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await resourceService.createResourceRequest({
                proposed_name: formData.name,
                proposed_type: formData.type,
                proposed_capacity: parseInt(formData.capacity),
                proposed_total_quantity: 1,
                proposed_description: formData.description,
                justification: formData.reason,
                proposed_approval_type: "ADMIN_APPROVE"
            });
            showSnackbar("Resource request submitted successfully.", "success");
            navigate("/staff/resources");
        } catch (error) {
            showSnackbar(error.message || "Failed to submit request.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/staff/resources")} sx={{ mb: 2 }}>
                Back to My Resources
            </Button>

            <Paper sx={{ p: 4, maxWidth, mx: "auto" }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Request New Resource
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                    Submit a request to add a new resource to the system. An administrator will review your request.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, display, flexDirection, gap: 3 }}>
                    <TextField
                        label="Resource Name"
                        name="name"
                        required
                        fullWidth
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    label="Type"
                                    name="type"
                                    value={formData.type}
                                    onChange={(e) => handleChange(e)}
                                >
                                    <MenuItem value={RESOURCE_TYPES.LAB}>Lab</MenuItem>
                                    <MenuItem value={RESOURCE_TYPES.CLASSROOM}>Classroom</MenuItem>
                                    <MenuItem value={RESOURCE_TYPES.EVENT_HALL}>Event Hall</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Capacity"
                                name="capacity"
                                type="number"
                                required
                                fullWidth
                                value={formData.capacity}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        label="Description"
                        name="description"
                        multiline
                        rows={3}
                        fullWidth
                        value={formData.description}
                        onChange={handleChange}
                    />

                    <TextField
                        label="Reason for Addition"
                        name="reason"
                        required
                        multiline
                        rows={3}
                        fullWidth
                        helperText="Why is this resource needed?"
                        value={formData.reason}
                        onChange={handleChange}
                    />

                    <Box sx={{ display: 'flex', gap, justifyContent: 'flex-end' }}>
                        <Button onClick={() => navigate("/staff/resources")}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};
