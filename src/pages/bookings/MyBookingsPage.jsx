import { useState, useEffect } from "react";
import { Box, Typography, Grid, Tabs, Tab, Container } from "@mui/material";
import { BookingCard } from "../../components/bookings/BookingCard";
import { CancelBookingDialog } from "../../components/bookings/CancelBookingDialog";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { EmptyState } from "../../components/common/EmptyState";
import { bookingService } from "../../services/bookingService";
import { useSnackbar } from "../../hooks/useSnackbar";

export const MyBookingsPage = () => {
    const { showSnackbar } = useSnackbar();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0); // 0: Upcoming, 1: Past

    // Cancel Dialog
    const [cancelId, setCancelId] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            // Use getMyBookings. It returns paginated data.
            // For simplicity in "My Bookings", we might fetch page 1 size 100 or implement pagination.
            // Let's assume pagination is handled or we just show recent.
            const res = await bookingService.getMyBookings();
            setBookings(res.data.results);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancelClick = (id) => {
        setCancelId(id);
    };

    const handleCancelConfirm = async (reason) => {
        if (!cancelId) return;
        try {
            await bookingService.cancelBooking(cancelId, reason);
            showSnackbar("Booking cancelled successfully", "success");
            fetchBookings(); // Refresh
            setCancelId(null);
        } catch (error) {
            showSnackbar(error.message || "Failed to cancel booking", "error");
        }
    };

    // Filter based on tab
    // Disclaimer: Backend might handle "Upcoming" vs "Past". Current API `getMyBookings` returns all mixed (ordered by date desc usually).
    // We can filter client side for now.
    const now = new Date();
    const upcoming = bookings.filter(b => new Date(b.end_time) >= now);
    const past = bookings.filter(b => new Date(b.end_time) < now);

    const displayedBookings = tab === 0 ? upcoming : past;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Bookings
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor, mb: 3 }}>
                <Tabs value={tab} onChange={(_e, v) => setTab(v)}>
                    <Tab label="Upcoming" />
                    <Tab label="History" />
                </Tabs>
            </Box>

            {loading ? (
                <LoadingSpinner />
            ) : displayedBookings.length === 0 ? (
                <EmptyState
                    title={tab === 0 ? "No upcoming bookings" : "No booking history"}
                    message={tab === 0 ? "You don't have any upcoming bookings. Go to Resources to book one." : ""}
                    action={tab === 0 ? { label: "Browse Resources", to: "/resources" } : undefined}
                />
            ) : (
                <Grid container spacing={3}>
                    {displayedBookings.map((booking) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={booking.id}>
                            <BookingCard booking={booking} onCancel={handleCancelClick} />
                        </Grid>
                    ))}
                </Grid>
            )}

            <CancelBookingDialog
                open={!!cancelId}
                onClose={() => setCancelId(null)}
                onConfirm={handleCancelConfirm}
                bookingId={cancelId}
            />
        </Container>
    );
};
