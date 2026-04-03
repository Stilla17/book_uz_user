'use client';

import { useQuery } from '@tanstack/react-query';

import { categoryService } from '@/services/category.service';

export const publicCategoriesQueryKey = ['categories', 'public'] as const;

export const usePublicCategoriesQuery = () =>
    useQuery({
        queryKey: publicCategoriesQueryKey,
        queryFn: () => categoryService.getAllCategoriesPublic()
    });
