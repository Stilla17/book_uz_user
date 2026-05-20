import { api } from './api';

export const AuthorService = {
    getAdminAuthor: async (params?: { page: number; limit?: number; search?: string }) => {
        const response = await api.get('/admin/authors', { params });
        return response.data.data;
    },

    addAdminAuthor: async (author: FormData) => {
        const response = await api.post('/admin/authors', author);
        return response.data;
    },

    deleteAdminAuthor: async (id: string) => {
        const response = await api.delete(`/admin/authors/${id}`);
        return response.data;
    },

    updateAdminAuthor: async (id: string, author: FormData) => {
        const response = await api.patch(`/admin/authors/${id}`, author, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getAdminAuthorId: async (id: string) => {
        const response = await api.get(`/admin/authors/${id}`);
        const data = response.data.data;
        return data.author ?? data;
    }
};
