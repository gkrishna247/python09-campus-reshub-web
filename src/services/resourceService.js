import api from "./api";

export const resourceService = {
    getResources: async (params) => {
        const response = await api.get("/resources/", { params });
        return response.data;
    },

    getResourceById: async (id) => {
        const response = await api.get(`/resources/${id}/`);
        return response.data;
    },

    createResource: async (data) => {
        const response = await api.post("/resources/", data);
        return response.data;
    },

    updateResource: async (id, data) => {
        const response = await api.put(`/resources/${id}/`, data);
        return response.data;
    },

    deleteResource: async (id) => {
        const response = await api.delete(`/resources/${id}/`);
        return response.data;
    },

    getResourceSchedule: async (id) => {
        const response = await api.get(`/resources/${id}/schedule/`);
        return response.data;
    },

    updateResourceSchedule: async (id, data) => {
        const response = await api.put(`/resources/${id}/schedule/`, data);
        return response.data;
    },

    getResourceAvailability: async (id, date) => {
        const response = await api.get(`/resources/${id}/availability/`, { params: { date } });
        return response.data;
    },

    getResourceRequests: async (params) => {
        const response = await api.get("/resource-requests/", { params });
        return response.data;
    },

    createResourceRequest: async (data) => {
        const response = await api.post("/resource-requests/", data);
        return response.data;
    },

    approveResourceRequest: async (id) => {
        const response = await api.post(`/resource-requests/${id}/approve/`);
        return response.data;
    },

    rejectResourceRequest: async (id, rejection_reason) => {
        const response = await api.post(`/resource-requests/${id}/reject/`, { rejection_reason });
        return response.data;
    },

    getCalendarOverrides: async () => {
        const response = await api.get("/calendar-overrides/");
        return response.data;
    },

    createCalendarOverride: async (data) => {
        const response = await api.post("/calendar-overrides/", data);
        return response.data;
    },

    deleteCalendarOverride: async (id) => {
        const response = await api.delete(`/calendar-overrides/${id}/`);
        return response.data;
    }
};
