import api from "./api";

export const bookingService = {
    getMyBookings: async (params?: { page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<Booking>>>("/bookings/", { params });
        return response.data;
    },

    getAllBookings: async (params?: { status?: string; resource_id?: number; user_id?: number; date_from?: string; date_to?: string; page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<Booking>>>("/bookings/all/", { params });
        return response.data;
    },

    getPendingBookings: async (params?: { page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<Booking>>>("/bookings/pending/", { params });
        return response.data;
    },

    createBooking: async (data) => {
        const response = await api.post<ApiResponse<Booking>>("/bookings/", data);
        return response.data;
    },

    approveBooking: async (id) => {
        const response = await api.post<ApiResponse<any>>(`/bookings/${id}/approve/`);
        return response.data;
    },

    rejectBooking: async (id, rejection_reason) => {
        const response = await api.post<ApiResponse<any>>(`/bookings/${id}/reject/`, { rejection_reason });
        return response.data;
    },

    cancelBooking: async (id, cancellation_reason) => {
        const response = await api.post<ApiResponse<any>>(`/bookings/${id}/cancel/`, { cancellation_reason });
        return response.data;
    },
};
