import api from "./api";

export const bookingService = {
    getMyBookings: async (params) => {
        const response = await api.get("/bookings/", { params });
        return response.data;
    },

    getAllBookings: async (params) => {
        const response = await api.get("/bookings/all/", { params });
        return response.data;
    },

    getPendingBookings: async (params) => {
        const response = await api.get("/bookings/pending/", { params });
        return response.data;
    },

    createBooking: async (data) => {
        const response = await api.post("/bookings/", data);
        return response.data;
    },

    approveBooking: async (id) => {
        const response = await api.post(`/bookings/${id}/approve/`);
        return response.data;
    },

    rejectBooking: async (id, rejection_reason) => {
        const response = await api.post(`/bookings/${id}/reject/`, { rejection_reason });
        return response.data;
    },

    cancelBooking: async (id, cancellation_reason) => {
        const response = await api.post(`/bookings/${id}/cancel/`, { cancellation_reason });
        return response.data;
    },
};
