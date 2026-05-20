import { Genre } from '@/types/category.types';
import { useQuery } from '@tanstack/react-query';

import { GenreService, GenresResponse } from '../../services/genre.service';

export const useGenreQuery = () => {
    return useQuery<Genre[]>({
        queryKey: ['genres'],
        queryFn: async () => {
            const data = await GenreService.getAdminGenre({ page: 1, limit: 100 });
            return data.categories ?? [];
        }
    });
};

export const useGenreListQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<GenresResponse>({
        queryKey: ['genres', 'list', page, limit, search],
        queryFn: () => GenreService.getAdminGenre({ page, limit, search }),
        placeholderData: (previousData) => previousData
    });
};

export const useDetailQuery = (id: string | null) => {
    return useQuery<Genre>({
        queryKey: ['genres', 'detail', id],
        queryFn: () => GenreService.getAdminGenreId(id!),
        enabled: !!id
    });
};
