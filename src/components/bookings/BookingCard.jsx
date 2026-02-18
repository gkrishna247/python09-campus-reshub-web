import { Card, CardContent, Typography, Box, Chip, Button } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PlaceIcon from "@mui/icons-material/Place";
import { BOOKING_STATUSES } from "../../utils/constants";
import dayjs from "dayjs";


export const BookingCard = ({ booking, onCancel }) => {
    const isPending = booking.status === BOOKING_STATUSES.PENDING;
    const isApproved = booking.status === BOOKING_STATUSES.APPROVED;


    const getStatusColor = (status) => {
        switch (status) {
            case BOOKING_STATUSES.APPROVED: return "success";
            case BOOKING_STATUSES.PENDING: return "warning";
            case BOOKING_STATUSES.REJECTED: return "error";
            case BOOKING_STATUSES.CANCELLED: return "default";
            case BOOKING_STATUSES.AUTO_CANCELLED: return "default";
            case BOOKING_STATUSES.COMPLETED: return "info";
            default: return "default";
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                        {booking.resource.name}
                    </Typography>
                    <Chip
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {booking.title}
                </Typography>

                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <EventIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            {dayjs(booking.start_time).format("MMM D, YYYY")}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            {dayjs(booking.start_time).format("h:mm A")} - {dayjs(booking.end_time).format("h:mm A")}
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <PlaceIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                            {booking.resource.location || booking.resource.name}
                        </Typography>
                    </Box>
                </Box>

                {(isPending || isApproved) && onCancel && (
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => onCancel(booking.id)}
                    >
                        Cancel Booking
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
