import api from "./api";

export const userService = {
    getUsers: async (params?: { status?: string; role?: string; search?: string; page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<User>>>("/users/", { params });
        return response.data;
    },

    getUserById: async (id) => {
        const response = await api.get<ApiResponse<User>>(`/users/${id}/`);
        return response.data;
    },

    updateUser: async (id, data) => {
        const response = await api.put<ApiResponse<User>>(`/users/${id}/`, data);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete<ApiResponse<any>>(`/users/${id}/`);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get<ApiResponse<User>>("/profile/");
        return response.data;
    },

    updateProfile: async (data: { name?: string; phone?: string }) => {
        const response = await api.patch<ApiResponse<User>>("/profile/", data);
        return response.data;
    },

    changePassword: async (data) => {
        const response = await api.post<ApiResponse<any>>("/profile/change-password/", data);
        return response.data;
    },

    getPendingRegistrations: async (params?: { page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<User>>>("/approvals/registrations/", { params });
        return response.data;
    },

    approveRegistration: async (id) => {
        const response = await api.post<ApiResponse<any>>(`/approvals/registrations/${id}/approve/`);
        return response.data;
    },

    rejectRegistration: async (id, rejection_reason) => {
        const response = await api.post<ApiResponse<any>>(`/approvals/registrations/${id}/reject/`, { rejection_reason });
        return response.data;
    },

    getRoleChangeRequests: async (params?: { page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<RoleChangeRequest>>>("/role-changes/", { params });
        return response.data;
    },

    getMyRoleChangeRequests: async () => {
        const response = await api.get<ApiResponse<RoleChangeRequest[]>>("/role-changes/my/");
        return response.data;
    },

    requestRoleChange: async (requested_role) => {
        const response = await api.post<ApiResponse<RoleChangeRequest>>("/role-changes/", { requested_role });
        return response.data;
    },

    approveRoleChange: async (id) => {
        const response = await api.post<ApiResponse<any>>(`/role-changes/${id}/approve/`);
        return response.data;
    },

    rejectRoleChange: async (id, rejection_reason) => {
        const response = await api.post<ApiResponse<any>>(`/role-changes/${id}/reject/`, { rejection_reason });
        return response.data;
    },
};
