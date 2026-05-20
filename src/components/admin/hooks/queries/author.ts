import { AuthorItems, AuthorResponse } from '@/types/author.types';
import { useQuery } from '@tanstack/react-query';

import { AuthorService } from '../../services/author.service';

export const useAuthorQuery = () => {
    return useQuery<AuthorResponse>({
        queryKey: ['authors'],
        queryFn: async () => {
            const data = await AuthorService.getAdminAuthor({ page: 1, limit: 100 });
            return data.authors ?? [];
        }
    });
};

export const useAuthorListQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<AuthorResponse>({
        queryKey: ['authors', 'list', page, limit, search],
        queryFn: () => AuthorService.getAdminAuthor({ page, limit, search }),
        placeholderData: (previousData) => previousData
    });
};

export const useAuthorDetailQuery = (id: string | null) => {
    return useQuery<AuthorItems>({
        queryKey: ['authors', 'detail', id],
        queryFn: () => AuthorService.getAdminAuthorId(id!),
        enabled: !!id
    });
};
