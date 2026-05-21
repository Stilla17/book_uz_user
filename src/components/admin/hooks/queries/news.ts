import { NewsItems, NewsResponse } from '@/types/news';
import { useQuery } from '@tanstack/react-query';

import { NewsService } from '../../services/news.service';

export const useNewsQuery = () => {
    return useQuery<NewsItems[]>({
        queryKey: ['news'],
        queryFn: async () => {
            const data = await NewsService.getAdminNews({ page: 1, limit: 100 });
            return data.news ?? [];
        }
    });
};

export const useNewsListQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<NewsResponse>({
        queryKey: ['news', 'list', page, limit, search],
        queryFn: () => NewsService.getAdminNews({ page, limit, search }),
        placeholderData: (previousData) => previousData
    });
};

export const useNewsDetailQuery = (id?: string | null) => {
    return useQuery<NewsItems | null>({
        queryKey: ['news', 'detail', id],
        queryFn: () => (id ? NewsService.getAdminNewsById(id) : null),
        enabled: Boolean(id)
    });
};
