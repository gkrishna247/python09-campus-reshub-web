import api from "./api";

export const notificationService = {
    getNotifications: async () => {
        const response = await api.get<ApiResponse<UserNotification[]>>("/notifications/");
        return response.data;
    },

    markAsRead: async (id) => {
        const response = await api.patch<ApiResponse<any>>(`/notifications/${id}/read/`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.post<ApiResponse<any>>("/notifications/mark-all-read/");
        return response.data;
    },
};
