import { api } from './api';

export const AdminService = {
    getAdminPublishers: async (params?: { page?: number; limit: number; search?: string }) => {
        const response = await api.get('/admin/publishers', { params });
        return response.data.data;
    },

    addAdminPublishers: async (formData: FormData) => {
        const response = await api.post('/admin/publishers', formData);
        return response.data;
    },

    getAdminPublisher: async (id: string) => {
        const response = await api.get(`/admin/publishers/${id}`);
        return response.data.data;
    },

    deleteAdminPublishers: async (id: string) => {
        const response = await api.delete(`/admin/publishers/${id}`);
        return response.data;
    },

    updateAdminPublishers: async (id: string, formData: FormData) => {
        const response = await api.patch(`/admin/publishers/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};
