'use client';

import { normalizeNewsResponse, type NewsItem } from '@/helpers/newsSection';
import { api } from '@/services/api';
import type { NewsItems, NewsResponse } from '@/types/news';
import { queryOptions, useQuery } from '@tanstack/react-query';

export type NewsDetailResponse = NewsItems & {
    content?: NewsItems['description'];
};

export const publicNewsQueryOptions = (page: number, search: string, limit: number) =>
    queryOptions({
        queryKey: ['public-news', page, search],
        queryFn: async (): Promise<NewsResponse> => {
            const response = await api.get('/news', {
                params: { active: true, page, limit, search }
            });
            return response.data.data;
        },
        placeholderData: (previousData) => previousData,
        staleTime: 5 * 60 * 1000
    });

export const usePublicNewsQuery = (page: number, search: string, limit: number) =>
    useQuery(publicNewsQueryOptions(page, search, limit));

export const useNewsDetailQuery = (slug: string) =>
    useQuery({
        queryKey: ['news', 'detail', slug],
        queryFn: async (): Promise<NewsDetailResponse> => {
            const response = await api.get(`/news/${slug}`);
            return response.data.data;
        },
        enabled: Boolean(slug)
    });

export const useNewsPreviewQuery = (limit: number) =>
    useQuery<NewsItem[]>({
        queryKey: ['public-news', 'preview', limit],
        queryFn: async ({ signal }) => {
            const response = await api.get('/news', {
                params: { active: true, page: 1, limit },
                signal
            });
            return normalizeNewsResponse(response.data);
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000
    });
