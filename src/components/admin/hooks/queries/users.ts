import type { AdminUsersResponse } from '@/types/admin-users';
import type { AdminSortKey, AdminSortOrder } from '@/hooks/useAdminSort';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { ManualOrderPayload, UpdateAdminUserPayload, UsersService } from '../../services/users.service';

type UserSortKey = 'name' | 'phone' | 'source' | 'orders' | 'registeredAt' | 'birthDate';

export const usersKeys = {
    all: ['admin-users'] as const,
    list: (
        page: number,
        limit: number,
        search: string,
        sortKey: AdminSortKey<UserSortKey>,
        sortOrder: AdminSortOrder
    ) => [...usersKeys.all, 'list', page, limit, search, sortKey, sortOrder] as const
};

export const useAdminUsersQuery = (
    page: number,
    limit: number,
    keyword = '',
    sortKey: AdminSortKey<UserSortKey> = 'default',
    sortOrder: AdminSortOrder = 'asc'
) => {
    const search = keyword.trim();

    return useQuery<AdminUsersResponse>({
        queryKey: usersKeys.list(page, limit, search, sortKey, sortOrder),
        queryFn: () => UsersService.getAdminUsers({ page, limit, search, sortKey, sortOrder }),
        placeholderData: (previousData) => previousData
    });
};

export const useCreateAdminUsersQuery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ManualOrderPayload) => UsersService.createUserForAdmin(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: usersKeys.all
            });
        }
    });
};

export const useUpdateAdminUserQuery = (id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateAdminUserPayload) => UsersService.updateAdminUser(id, data),
        onSuccess: async (data) => {
            if (data) {
                queryClient.setQueryData(['admin-user', id], data);
            }

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: usersKeys.all
                }),
                queryClient.invalidateQueries({
                    queryKey: ['admin-user', id]
                })
            ]);
        }
    });
};
