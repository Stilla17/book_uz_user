import type { StockFilter } from '@/helpers/admin/newBook';
import { BookStats } from '@/types/book';

import { api } from './api';

type BookPaginationParams = {
    page: number;
    limit?: number;
    search?: string;
    sortBy?: 'price' | 'title';
    sortOrder?: 'asc' | 'desc';
    stockFilter?: StockFilter;
};

const getProductFromResponse = (responseData: any) => {
    const data = responseData?.data;
    if (Array.isArray(data?.products)) return data.products[0];
    return data?.product ?? data?.products ?? data;
};

export const BookService = {
    getAdminBook: async (params?: BookPaginationParams, signal?: AbortSignal) => {
        const response = await api.get('/admin/products', { params, signal });
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
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };

        const response = await api.patch(`/admin/products/${id}`, book, config).catch((error) => {
            const status = error.response?.status;

            if (status === 404 || status === 405) {
                return api.put(`/admin/products/${id}`, book, config);
            }

            throw error;
        });

        return response.data;
    },

    getAdminBookId: async (id: string) => {
        try {
            const response = await api.get(`/admin/products/${id}`);
            return getProductFromResponse(response.data);
        } catch (error: any) {
            if (error.response?.status !== 404) {
                throw error;
            }

            const listResponse = await api.get('/admin/products', {
                params: { page: 1, limit: 1, search: id }
            });
            const products = listResponse.data?.data?.products ?? [];
            const product = products.find((item: any) => item?._id === id || item?.id === id) ?? products[0];

            if (!product) {
                throw error;
            }

            return product;
        }
    },

    getAdminBookStats: async (signal?: AbortSignal) => {
        const response = await api.get<{ data: BookStats }>('/admin/products/stats', { signal });
        return response.data.data;
    }
};
