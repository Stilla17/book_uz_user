'use client';

import { UserService } from '@/services/user.service';
import { useQuery } from '@tanstack/react-query';

export const useBookCommentsQuery = (bookId: string | undefined, enabled = true) =>
    useQuery({
        queryKey: ['comments', bookId],
        queryFn: () => UserService.getComments(bookId!),
        enabled: Boolean(bookId) && enabled,
        staleTime: 5 * 60 * 1000
    });
