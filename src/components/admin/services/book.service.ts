import { api } from './api';

export const BookService = {
    getAdminBook: async (params?: { page: number; limit?: number; search?: string }) => {
        const response = await api.get('/admin/products', { params });
        return response.data.data;
    },

    addAdminBook: async (book: FormData) => {
        const response = await api.post('/admin/products', book, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    deleteAdminBook: async (id: string) => {
        const response = await api.delete(`/admin/products/${id}`);
        return response.data;
    },

    updateAdminBook: async (id: string, book: FormData) => {
        const response = await api.patch(`/admin/products/${id}`, book, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    getAdminBookId: async (id: string) => {
        const response = await api.get(`/admin/products/${id}`);
        const data = response.data.data;
        if (Array.isArray(data.products)) return data.products[0];
        return data.product ?? data.products ?? data;
    }
};
