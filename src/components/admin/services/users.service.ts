import type {
    AdminUserListItem,
    AdminUsersPagination,
    AdminUsersResponse,
    AdminUsersTotals
} from '@/types/admin-users';

import { api } from './api';

type ApiUser = {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
    createdAt?: string;
};

type ApiAmoContact = {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phones?: string[];
    emails?: string[];
    birthDate?: string;
    salesCount?: number;
    createdAt?: string;
};

type AdminUsersApiData = {
    users: ApiUser[];
    amoContacts: ApiAmoContact[];
    pagination: AdminUsersPagination;
    totals: AdminUsersTotals;
};

type AdminUsersApiResponse = {
    data: AdminUsersApiData;
};

const mapUser = (user: ApiUser): AdminUserListItem => ({
    id: user._id,
    name: user.name,
    email: user.email ?? '',
    phones: user.phone ? [user.phone] : [],
    salesCount: 0,
    createdAt: user.createdAt,
    source: 'BOOK_UZ'
});

const mapAmoContact = (contact: ApiAmoContact): AdminUserListItem => ({
    id: contact._id,
    name:
        contact.name ||
        [contact.firstName, contact.lastName].filter(Boolean).join(' ') ||
        'Nomsiz foydalanuvchi',
    email: contact.emails?.[0] ?? '',
    phones: contact.phones ?? [],
    salesCount: contact.salesCount ?? 0,
    createdAt: contact.createdAt,
    birthDate: contact.birthDate,
    source: 'AMO_CRM'
});

export const UsersService = {
    getAdminUsers: async (params: { page: number; limit: number; search?: string }): Promise<AdminUsersResponse> => {
        const response = await api.get<AdminUsersApiResponse>('/admin/users', {
            params: {
                page: params.page,
                limit: params.limit,
                search: params.search?.trim() || undefined
            }
        });
        const data = response.data.data;
        const users = data.users.map(mapUser);
        const amoContacts = data.amoContacts.map(mapAmoContact);

        return {
            users,
            amoContacts,
            items: [...users, ...amoContacts],
            pagination: data.pagination,
            totals: data.totals
        };
    }
};
