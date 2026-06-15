import type { AdminUsersResponse } from '@/types/admin-users';
import { useQuery } from '@tanstack/react-query';

import { UsersService } from '../../services/users.service';

export const usersKeys = {
    all: ['admin-users'] as const,
    list: (page: number, limit: number, search: string) =>
        [...usersKeys.all, 'list', page, limit, search] as const
};

export const useAdminUsersQuery = (page: number, limit: number, keyword = '') => {
    const search = keyword.trim();

    return useQuery<AdminUsersResponse>({
        queryKey: usersKeys.list(page, limit, search),
        queryFn: () => UsersService.getAdminUsers({ page, limit, search }),
        placeholderData: (previousData) => previousData
    });
};
