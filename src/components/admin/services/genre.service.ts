import { OtherPagination } from '@/services/api';
import { CreateGenreData, Genre } from '@/types/category.types';

import { api } from './api';

export type GenresResponse = {
    categories: Genre[];
    pagination: OtherPagination;
};

type GenrePaginationParams = {
    page?: number;
    limit?: number;
    search?: string;
};

export const GenreService = {
    getAdminGenre: async (params?: GenrePaginationParams): Promise<GenresResponse> => {
        const response = await api.get('/admin/categories', { params });
        return response.data.data;
    },

    addAdminGenre: async (genre: CreateGenreData) => {
        const response = await api.post('/admin/categories', genre);
        return response.data;
    },

    deleteAdminGenre: async (id: string) => {
        const response = await api.delete(`/admin/categories/${id}`);
        return response.data;
    },

    getAdminGenreId: async (id: string): Promise<Genre> => {
        const response = await api.get(`/admin/categories/${id}`);
        return response.data.data;
    },

    updateAdminGenre: async (id: string, genre: CreateGenreData) => {
        const response = await api.patch(`/admin/categories/${id}`, genre);
        return response.data;
    }
};
