'use client';

import { api } from '@/services/api';
import type { AuthorResponse } from '@/types/author.types';
import { fetchAllAndSortByCount } from '@/utils/paginated-collection';
import { useQuery } from '@tanstack/react-query';

const AUTHORS_FETCH_LIMIT = 100;

const normalizeAuthorsResponse = (response: unknown, page: number): AuthorResponse => {
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
            limit: Number(pagination.limit ?? AUTHORS_FETCH_LIMIT),
            total: Number(pagination.total ?? pagination.totalItems ?? authors.length),
            pages: Number(pagination.pages ?? pagination.totalPages ?? 1)
        }
    };
};

const getAuthorsPage = async (page: number, limit = AUTHORS_FETCH_LIMIT) => {
    const response = await api.get('/authors', { params: { page, limit } });
    return normalizeAuthorsResponse(response, page);
};

const getAllAuthors = () =>
    fetchAllAndSortByCount({
        fetchPage: getAuthorsPage,
        getItems: (response) => response.authors,
        getTotalPages: (response) => response.pagination.pages,
        getCount: (author) => author.booksCount,
        getName: (author) => author.name,
        fetchLimit: AUTHORS_FETCH_LIMIT
    });

export const useAllAuthorsQuery = () =>
    useQuery({
        queryKey: ['authors', 'books-count-desc'],
        queryFn: getAllAuthors,
        staleTime: 5 * 60 * 1000
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
