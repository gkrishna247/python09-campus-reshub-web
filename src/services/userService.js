import api from './api';

const userService = {
    getUsers: async (status) => {
        const params = status && status !== 'ALL' ? { status } : {};
        return await api.get('/users/', { params });
    },
    getUserById: async (id) => {
        return await api.get(`/users/${id}/`);
    },
    createUser: async (data) => {
        return await api.post('/users/', data);
    },
    updateUser: async (id, data) => {
        return await api.patch(`/users/${id}/`, data);
    },
    deleteUser: async (id) => {
        return await api.delete(`/users/${id}/`);
    },
};

export default userService;
