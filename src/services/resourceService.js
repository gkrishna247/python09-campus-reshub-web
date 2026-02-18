import api from "./api";

export const resourceService = {
    getResources: async (params?: { search?: string; type?: string; min_capacity?: number; page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<Resource>>>("/resources/", { params });
        return response.data;
    },

    getResourceById: async (id) => {
        const response = await api.get<ApiResponse<Resource>>(`/resources/${id}/`);
        return response.data;
    },

    createResource: async (data) => {
        const response = await api.post<ApiResponse<Resource>>("/resources/", data);
        return response.data;
    },

    updateResource: async (id, data) => {
        const response = await api.put<ApiResponse<Resource>>(`/resources/${id}/`, data);
        return response.data;
    },

    deleteResource: async (id) => {
        const response = await api.delete<ApiResponse<any>>(`/resources/${id}/`);
        return response.data;
    },

    getResourceSchedule: async (id) => {
        const response = await api.get<ApiResponse<WeeklySchedule[]>>(`/resources/${id}/schedule/`);
        return response.data;
    },

    updateResourceSchedule: async (id, data) => {
        const response = await api.put<ApiResponse<WeeklySchedule[]>>(`/resources/${id}/schedule/`, data);
        return response.data;
    },

    getResourceAvailability: async (id, date) => {
        const response = await api.get<ApiResponse<AvailabilityResponse>>(`/resources/${id}/availability/`, { params: { date } });
        return response.data;
    },

    getResourceRequests: async (params?: { page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<ResourceAdditionRequest>>>("/resource-requests/", { params });
        return response.data;
    },

    createResourceRequest: async (data) => {
        const response = await api.post<ApiResponse<ResourceAdditionRequest>>("/resource-requests/", data);
        return response.data;
    },

    approveResourceRequest: async (id) => {
        const response = await api.post<ApiResponse<any>>(`/resource-requests/${id}/approve/`);
        return response.data;
    },

    rejectResourceRequest: async (id, rejection_reason) => {
        const response = await api.post<ApiResponse<any>>(`/resource-requests/${id}/reject/`, { rejection_reason });
        return response.data;
    },

    getCalendarOverrides: async () => {
        const response = await api.get<ApiResponse<CalendarOverride[]>>("/calendar-overrides/");
        return response.data;
    },

    createCalendarOverride: async (data) => {
        const response = await api.post<ApiResponse<CalendarOverride>>("/calendar-overrides/", data);
        return response.data;
    },

    deleteCalendarOverride: async (id) => {
        const response = await api.delete<ApiResponse<any>>(`/calendar-overrides/${id}/`);
        return response.data;
    }
};
