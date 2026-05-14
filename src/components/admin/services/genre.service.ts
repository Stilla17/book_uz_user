import { Genre } from '@/types/category.types';

import { api } from './api';

export const GenreService = {
    getAdminGenre: async (): Promise<Genre[]> => {
        const response = await api.get('/admin/categories');
        return response.data.data;
    }
};
