import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid, Paper, Chip, Divider, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

import { resourceService } from "../../services/resourceService";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { SlotGrid } from "../../components/bookings/SlotGrid";
import { BookingCreateDialog } from "../../pages/bookings/BookingCreateDialog";
import { SpecialRequestDialog } from "../../components/bookings/SpecialRequestDialog";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../utils/constants";

export const ResourceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dialog States
    const [openBooking, setOpenBooking] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    const [openSpecial, setOpenSpecial] = useState(false);

    useEffect(() => {
        const fetchResource = async () => {
            try {
                if (!id) return;
                const data = await resourceService.getResourceById(parseInt(id));
                setResource(data.data);
            } catch (error) {
                console.error("Failed to fetch resource", error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [id]);

    const handleSlotClick = (slot, date) => {
        setSelectedSlot(slot);
        setSelectedDate(date);
        setOpenBooking(true);
    };

    if (loading) return <LoadingSpinner fullScreen />;
    if (!resource) return <Typography>Resource not found</Typography>;

    const isStaffManaged = user?.role === ROLES.STAFF && resource.managed_by.id === user.id;
    const isAdmin = user?.role === ROLES.ADMIN;
    const canEdit = isAdmin || isStaffManaged;

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/resources")} sx={{ mb: 2 }}>
                Back to Resources
            </Button>

            <Grid container spacing={4}>
                {/* Left Column: Details */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h4" fontWeight="bold">{resource.name}</Typography>
                            {canEdit && (
                                <IconButton color="primary" onClick={() => navigate(`/admin/resources/${resource.id}/edit`)}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </Box>

                        <Box sx={{ mb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={resource.type.replace('_', ' ')} color="primary" variant="outlined" />
                            <Chip
                                label={resource.resource_status}
                                color={resource.resource_status === 'AVAILABLE' ? "success" : "error"}
                            />
                        </Box>

                        <Typography variant="body1" paragraph>
                            {resource.description || "No description provided."}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', alignItems: 'center', mb, color: 'text.secondary' }}>
                            <PeopleIcon sx={{ mr: 1 }} />
                            <Typography>Capacity: {resource.capacity} people</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb, color: 'text.secondary' }}>
                            <LocationOnIcon sx={{ mr: 1 }} />
                            <Typography>Location: {resource.location || "N/A"}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb, color: 'text.secondary' }}>
                            <AccessTimeIcon sx={{ mr: 1 }} />
                            <Typography>Max Duration: {resource.max_booking_duration_hours || 2} hours</Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<EventAvailableIcon />}
                            onClick={() => setOpenSpecial(true)}
                        >
                            Special Request
                        </Button>
                    </Paper>
                </Grid>

                {/* Right Column: Calendar / Slots */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <SlotGrid resourceId={resource.id} onSlotClick={handleSlotClick} />
                </Grid>
            </Grid>

            {/* Dialogs */}
            <BookingCreateDialog
                open={openBooking}
                onClose={() => setOpenBooking(false)}
                resource={resource}
                date={selectedDate}
                slot={selectedSlot}
                onSuccess={() => {/* Maybe refresh slots? */ }}
            />

            <SpecialRequestDialog
                open={openSpecial}
                onClose={() => setOpenSpecial(false)}
                resource={resource}
                onSuccess={() => {/* Show success message */ }}
            />
        </Box>
    );
};
