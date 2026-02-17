import api from './api';

const bookingService = {
    getBookings: async () => {
        return await api.get('/bookings/');
    },
    getBookingById: async (id) => {
        return await api.get(`/bookings/${id}/`);
    },
    createBooking: async (data) => {
        return await api.post('/bookings/', data);
    },
    updateBooking: async (id, data) => {
        return await api.patch(`/bookings/${id}/`, data);
    },
    deleteBooking: async (id) => {
        return await api.delete(`/bookings/${id}/`);
    },
};

export default bookingService;
