import React, { createContext, useState, useEffect } from "react";
import { authService } from "../services/authService";


export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access_token"));
    const [refreshTokenState, setRefreshTokenState] = useState(localStorage.getItem("refresh_token"));
    const [isLoading, setIsLoading] = useState(true);

    console.log("AuthProvider mounted");

    const decodeToken = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Failed to decode token", e);
            return null;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const storedAccess = localStorage.getItem("access_token");
            const storedRefresh = localStorage.getItem("refresh_token");

            if (storedAccess) {
                const payload = decodeToken(storedAccess);
                const currentTime = Date.now() / 1000;

                if (payload && payload.exp > currentTime) {
                    // Token valid, set user from payload (which might not have full details, but has ID/Role)
                    // Ideally fetch full profile, but instructions say "set user state from decoded payload" or wait.
                    // Instructions: "If valid, set user state from decoded payload."
                    // Payload has: user_id, email, role, account_status, approval_status.
                    // User interface expects full User object. We mock the missing fields or fetch?
                    // Instructions say: "Set user state from decoded payload."
                    // So we construct a partial User or cast it.
                    // Let's create a User object from payload.
                    setUser({
                        id: payload.user_id,
                        email: payload.email,
                        name: payload.name || "", // Payload might not have name? Instructions say "extract: user_id, email, role, account_status, approval_status"
                        role: payload.role,
                        account_status: payload.account_status,
                        approval_status: payload.approval_status,
                        phone: null, // missing
                        rejection_reason: null,
                        is_email_verified: true, // assume
                        created_at: "",
                        updated_at: "",
                        last_login: null
                    });
                    setAccessToken(storedAccess);
                    setRefreshTokenState(storedRefresh);
                } else if (storedRefresh) {
                    // Token expired, try refresh
                    try {
                        const newAccess = await refreshAccessToken();
                        if (!newAccess) {
                            throw new Error("Refresh failed");
                        }
                    } catch (e) {
                        // Failed, clear everything
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");
                        setUser(null);
                        setAccessToken(null);
                        setRefreshTokenState(null);
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        // POST /auth/login/
        const response = await authService.login(email, password);
        // On success: extract access, refresh, user from response.data (ApiResponse<AuthResponse> -> data has access, refresh, user)
        const { user: userMinimal } = response.data;

        // Wait, response.data is AuthResponse? 
        // API returns { status: "success", data, refresh, user } }
        // authService.login returns response.data which is ApiResponse<AuthResponse>
        // So response.data.data is the AuthResponse.

        // Check authService implementation:
        // return response.data; -> returns ApiResponse object.

        const authData = response.data;

        localStorage.setItem("access_token", authData.access);
        localStorage.setItem("refresh_token", authData.refresh);

        setAccessToken(authData.access);
        setRefreshTokenState(authData.refresh);

        // User minimal is returned. We might need full user?
        // "Set user state from the user object in response."
        // We can cast minimal to User or we should fetch profile?
        // Let's use what we have, padding missing fields.
        setUser({
            ...userMinimal,
            phone: null,
            rejection_reason: null,
            is_email_verified: true,
            created_at: "",
            updated_at: "",
            last_login: null
        });

        return {
            ...userMinimal,
            phone: null,
            rejection_reason: null,
            is_email_verified: true,
            created_at: "",
            updated_at: "",
            last_login: null
        };
    };

    const register = async (data) => {
        return authService.register(data);
    };

    const logout = async () => {
        const refresh = localStorage.getItem("refresh_token");
        if (refresh) {
            await authService.logout(refresh);
        }
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setUser(null);
        setAccessToken(null);
        setRefreshTokenState(null);
        window.location.href = "/login";
    };

    const refreshAccessToken = async () => {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) return null;

        try {
            const response = await authService.refreshToken(refresh);
            // response is ApiResponse<{ access: string }>
            // data is { access: "..." }
            const newAccess = response.data.access;

            localStorage.setItem("access_token", newAccess);
            setAccessToken(newAccess);

            // Decode and update user if needed
            const payload = decodeToken(newAccess);
            if (payload) {
                setUser(prev => prev ? {
                    ...prev,
                    role: payload.role,
                    account_status: payload.account_status,
                    approval_status: payload.approval_status
                } : null);
            }

            return newAccess;
        } catch (error) {
            await logout();
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            accessToken,
            refreshToken: refreshTokenState,
            isLoading,
            isAuthenticated: !!user && !!accessToken,
            login,
            register,
            logout,
            refreshAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
};
