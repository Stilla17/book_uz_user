import { api } from './api';

export const NewsService = {
    getAdminNews: async (params?: { page?: number; limit: number; search?: string }) => {
        const response = await api.get('/admin/news', { params });
        return response.data.data;
    },

    getAdminNewsById: async (id: string) => {
        const response = await api.get(`/admin/news/${id}`);
        return response.data.data;
    },

    addAdminNews: async (formData: FormData) => {
        const response = await api.post('/admin/news', formData);
        return response.data;
    },

    updateAdminNews: async (id: string, formData: FormData) => {
        const response = await api.patch(`/admin/news/${id}`, formData);
        return response.data;
    },

    deleteAdminNews: async (id: string) => {
        const response = await api.delete(`/admin/news/${id}`);
        return response.data;
    }
};
