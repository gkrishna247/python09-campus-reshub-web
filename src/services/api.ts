import axios, { AxiosError } from "axios";
import { ApiResponse, ApiError } from "../types";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Prevent infinite loops
        if (!originalRequest) {
            return Promise.reject(error);
        }

        // Check if 401 and not login/refresh endpoint
        if (
            error.response?.status === 401 &&
            !originalRequest.url?.includes("/auth/login/") &&
            !originalRequest.url?.includes("/auth/token/refresh/") &&
            !(originalRequest as any)._retry
        ) {
            (originalRequest as any)._retry = true;

            try {
                const refresh = localStorage.getItem("refresh_token");
                if (!refresh) {
                    throw new Error("No refresh token");
                }

                // Call refresh endpoint directly using axios to avoid interceptors if needed, 
                // or just use api (but be careful of loop if this fails with 401).
                // Since we checked url !includes refresh, it's safe to use api if api doesn't add other headers that break it.
                // Actually, better to use a clean axios call or api but we are inside api interceptor.

                const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/token/refresh/`, {
                    refresh,
                });

                const { access } = response.data.data || response.data; // adjust based on API shape
                // actually instructions say: "On success: extract access, refresh, user from response.data.data." for login.
                // For refresh: "Returns new access token."
                // Let's assume response.data.data.access or response.data.access.
                // The instructions say "extract access.. from response.data.data" for login. 
                // For refresh: "Return new access token." 
                // Usually DRF simplejwt returns { access: "..." }. 
                // But user said "api returns { status: 'success', data: ... }". 
                // So it's likely response.data.data.access.

                localStorage.setItem("access_token", access);

                // Update header
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return api(originalRequest);

            } catch (refreshError) {
                // Refresh failed, logout
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        // Normalize error
        if (error.response?.data) {
            return Promise.reject(error.response.data);
        }

        const networkError: ApiError = {
            status: "error",
            message: "Network error. Please check your connection.",
            errors: [],
        };
        return Promise.reject(networkError);
    }
);

export default api;
