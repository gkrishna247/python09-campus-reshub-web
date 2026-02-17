import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import bookingService from '../../services/bookingService';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';

const BookingList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await bookingService.getBookings();
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDeleteClick = (id) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        try {
            await bookingService.deleteBooking(deleteId);
            toast.success("Booking deleted successfully");
            fetchBookings();
        } catch (error) {
            console.error("Failed to delete booking", error);
        } finally {
            setDeleteId(null);
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await bookingService.updateBooking(id, { status });
            toast.success(`Booking ${status.toLowerCase()} successfully`);
            fetchBookings();
        } catch (error) {
            console.error(`Failed to ${status.toLowerCase()} booking`, error);
        }
    };

    return (
        <div className="container">
            <div className="justify-between mb-3">
                <h1>Bookings</h1>
                <Link to="/bookings/new" className="btn btn-primary">New Booking</Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Resource</th>
                                <th>Date</th>
                                <th>Time Slot</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking.id}>
                                    <td>{booking.user ? booking.user.name : 'Unknown'}</td>
                                    <td>{booking.resource ? booking.resource.name : 'Unknown'}</td>
                                    <td>{new Date(booking.booking_date).toLocaleDateString()}</td>
                                    <td>{booking.time_slot}</td>
                                    <td><StatusBadge status={booking.status} /></td>
                                    <td>
                                        {booking.status === 'PENDING' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(booking.id, 'APPROVED')}
                                                    className="btn btn-sm btn-success mr-2"
                                                    style={{ backgroundColor: 'var(--success-color)', color: 'white' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(booking.id, 'REJECTED')}
                                                    className="btn btn-sm btn-warning mr-2"
                                                    style={{ backgroundColor: 'var(--danger-color)', color: 'white', borderColor: 'var(--danger-color)' }}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => handleDeleteClick(booking.id)}
                                            className="btn btn-sm btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteId}
                title="Delete Booking"
                message="Are you sure you want to delete this booking?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default BookingList;
