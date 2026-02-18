import api from "./api";

export const statisticsService = {
    getStatistics: async (range?: string) => {
        const response = await api.get<ApiResponse<StatisticsResponse>>("/statistics/", { params: { range } });
        return response.data;
    },
};
