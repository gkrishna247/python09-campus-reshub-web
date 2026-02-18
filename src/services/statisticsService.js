import api from "./api";

export const statisticsService = {
    getStatistics: async (range) => {
        const response = await api.get("/statistics/", { params: { range } });
        return response.data;
    },
};
