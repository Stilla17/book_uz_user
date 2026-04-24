'use client';

import { categoryService } from '@/services/category.service';
import { useQuery } from '@tanstack/react-query';

export const publicCategoriesQueryKey = ['categories', 'public'] as const;

export const usePublicCategoriesQuery = () =>
    useQuery({
        queryKey: publicCategoriesQueryKey,
        queryFn: () => categoryService.getAllCategoriesPublic()
    });
