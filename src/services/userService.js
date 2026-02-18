import api from "./api";

export const userService = {
    getUsers: async (params) => {
        const response = await api.get("/users/", { params });
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get(`/users/${id}/`);
        return response.data;
    },

    updateUser: async (id, data) => {
        const response = await api.put(`/users/${id}/`, data);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}/`);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get("/profile/");
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await api.patch("/profile/", data);
        return response.data;
    },

    changePassword: async (data) => {
        const response = await api.post("/profile/change-password/", data);
        return response.data;
    },

    getPendingRegistrations: async (params) => {
        const response = await api.get("/approvals/registrations/", { params });
        return response.data;
    },

    approveRegistration: async (id) => {
        const response = await api.post(`/approvals/registrations/${id}/approve/`);
        return response.data;
    },

    rejectRegistration: async (id, rejection_reason) => {
        const response = await api.post(`/approvals/registrations/${id}/reject/`, { rejection_reason });
        return response.data;
    },

    getRoleChangeRequests: async (params) => {
        const response = await api.get("/role-changes/", { params });
        return response.data;
    },

    getMyRoleChangeRequests: async () => {
        const response = await api.get("/role-changes/my/");
        return response.data;
    },

    requestRoleChange: async (requested_role) => {
        const response = await api.post("/role-changes/", { requested_role });
        return response.data;
    },

    approveRoleChange: async (id) => {
        const response = await api.post(`/role-changes/${id}/approve/`);
        return response.data;
    },

    rejectRoleChange: async (id, rejection_reason) => {
        const response = await api.post(`/role-changes/${id}/reject/`, { rejection_reason });
        return response.data;
    },
};
