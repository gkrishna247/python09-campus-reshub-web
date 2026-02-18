import api from "./api";

export const auditService = {
    getAuditLogs: async (params?: { action?: string; actor_id?: number; target_entity_type?: string; from_date?: string; to_date?: string; search?: string; page?: number }) => {
        const response = await api.get<ApiResponse<PaginatedData<AuditLog>>>("/audit-logs/", { params });
        return response.data;
    },
};
