import api from './api';

const resourceService = {
    getResources: async () => {
        return await api.get('/resources/');
    },
    getResourceById: async (id) => {
        return await api.get(`/resources/${id}/`);
    },
    createResource: async (data) => {
        return await api.post('/resources/', data);
    },
    updateResource: async (id, data) => {
        return await api.patch(`/resources/${id}/`, data);
    },
    deleteResource: async (id) => {
        return await api.delete(`/resources/${id}/`);
    },
};

export default resourceService;
