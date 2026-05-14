import { useQuery } from '@tanstack/react-query';

import { GenreService } from '../../services/genre.service';
import { Genre } from '@/types/category.types';

export const useGenreQuery = (keydown = '') => {
    const search = keydown.trim();

    return useQuery<Genre[]>({
        queryKey: ['genres', search],
        queryFn: GenreService.getAdminGenre
    });
};
