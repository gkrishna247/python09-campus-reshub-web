import api from "./api";

export const authService = {
    login: async (email, password) => {
        const response = await api.post("/auth/login/", { email, password });
        return response.data;
    },

    register: async (data) => {
        const response = await api.post("/auth/register/", data);
        return response.data;
    },

    logout: async (refresh) => {
        try {
            await api.post("/auth/logout/", { refresh });
        } catch (error) {
            console.error("Logout failed", error);
        }
    },

    refreshToken: async (refresh) => {
        const response = await api.post("/auth/token/refresh/", { refresh });
        return response.data;
    },

    getApprovalStatus: async () => {
        const response = await api.get("/auth/approval-status/");
        return response.data;
    },
};
