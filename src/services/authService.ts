import api from "./api";
import { RegisterData, ApiResponse, AuthResponse } from "../types";

export const authService = {
    login: async (email: string, password: string) => {
        const response = await api.post<ApiResponse<AuthResponse>>("/auth/login/", { email, password });
        return response.data;
    },

    register: async (data: RegisterData) => {
        const response = await api.post<ApiResponse<any>>("/auth/register/", data);
        return response.data;
    },

    logout: async (refresh: string) => {
        try {
            await api.post("/auth/logout/", { refresh });
        } catch (error) {
            console.error("Logout failed", error);
        }
    },

    refreshToken: async (refresh: string) => {
        const response = await api.post<ApiResponse<{ access: string }>>("/auth/token/refresh/", { refresh });
        return response.data;
    },

    getApprovalStatus: async () => {
        const response = await api.get<ApiResponse<any>>("/auth/approval-status/");
        return response.data;
    },
};
