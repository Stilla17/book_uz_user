'use client';

import { api } from '@/services/api';
import type { AuthorResponse } from '@/types/author.types';
import { useQuery } from '@tanstack/react-query';

const normalizeAuthorsResponse = (response: unknown, page: number, limit: number): AuthorResponse => {
    const source = response as { data?: { data?: unknown } | unknown };
    const data = (source?.data as { data?: unknown })?.data ?? source?.data ?? {};
    const payload = data as {
        authors?: AuthorResponse['authors'];
        pagination?: Partial<AuthorResponse['pagination']>;
        page?: number;
        currentPage?: number;
        limit?: number;
        total?: number;
        totalItems?: number;
        pages?: number;
        totalPages?: number;
    };
    const authors = Array.isArray(data) ? data : (payload.authors ?? []);
    const pagination = (payload.pagination ?? payload) as Partial<AuthorResponse['pagination']> & {
        currentPage?: number;
        totalItems?: number;
        totalPages?: number;
    };

    return {
        authors,
        pagination: {
            page: Number(pagination.page ?? pagination.currentPage ?? page),
            limit: Number(pagination.limit ?? limit),
            total: Number(pagination.total ?? pagination.totalItems ?? authors.length),
            pages: Number(pagination.pages ?? pagination.totalPages ?? 1)
        }
    };
};

const getAuthorsPage = async (page: number, limit: number, signal: AbortSignal) => {
    const response = await api.get('/authors', { params: { page, limit, sort: 'books_count_desc' }, signal });
    return normalizeAuthorsResponse(response, page, limit);
};

export const useAuthorsQuery = (page: number, limit: number) =>
    useQuery({
        queryKey: ['authors', 'list', 'books-count-desc', page, limit],
        queryFn: ({ signal }) => getAuthorsPage(page, limit, signal),
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

export const useTopAuthorsQuery = (limit: number) =>
    useQuery({
        queryKey: ['authors-preview', 'top', limit],
        queryFn: async () => {
            const response = await api.get('/authors/top', { params: { limit } });
            return response.data?.data as { authors?: AuthorResponse['authors']; pagination?: AuthorResponse['pagination'] };
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnWindowFocus: false
    });
