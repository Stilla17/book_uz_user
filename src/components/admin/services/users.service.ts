import type {
    AdminUserListItem,
    AdminUserPurchasedBook,
    AdminUsersPagination,
    AdminUsersResponse,
    AdminUsersTotals
} from '@/types/admin-users';

import { api } from './api';

type ApiUser = {
    _id: string;
    name: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    phones?: string[];
    telegramUsername?: string;
    role?: string;
    birthDate?: string;
    salesCount?: number;
    ordersCount?: number;
    orderCount?: number;
    createdAt?: string;
    purchasedBooks?: ApiPurchasedBook[];
    items?: ApiPurchasedBook[];
    orders?: Array<{ items?: ApiPurchasedBook[]; createdAt?: string }>;
};

type ApiAmoContact = {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    phones?: string[];
    emails?: string[];
    telegramUsername?: string;
    role?: string;
    birthDate?: string;
    salesCount?: number;
    ordersCount?: number;
    orderCount?: number;
    createdAt?: string;
    purchasedBooks?: ApiPurchasedBook[];
    items?: ApiPurchasedBook[];
    orders?: Array<{ items?: ApiPurchasedBook[]; createdAt?: string }>;
};

type ApiPurchasedBook = {
    _id?: string;
    id?: string;
    title?: string | { uz?: string; ru?: string; en?: string };
    product?: string | { _id?: string; id?: string; title?: string | { uz?: string; ru?: string; en?: string } };
    quantity?: number;
    priceAtTime?: number;
    price?: number;
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

type AdminUserApiResponse = {
    data?: ApiUser | ApiAmoContact | { user?: ApiUser; contact?: ApiAmoContact };
    user?: ApiUser;
    contact?: ApiAmoContact;
};

type AdminUserSortOrder = 'asc' | 'desc';
type AdminUserSortKey = 'name' | 'phone' | 'source' | 'orders' | 'registeredAt' | 'birthDate';

type GetAdminUsersParams = {
    page: number;
    limit: number;
    search?: string;
    sortKey?: AdminUserSortKey | 'default';
    sortOrder?: AdminUserSortOrder;
};

const ALL_USERS_PAGE_LIMIT = 1000;
const ALL_USERS_CACHE_TTL = 60_000;

let allUsersCache:
    | {
          items: AdminUserListItem[];
          totals: AdminUsersTotals;
          cachedAt: number;
      }
    | null = null;
let allUsersRequest: Promise<{
    items: AdminUserListItem[];
    totals: AdminUsersTotals;
}> | null = null;

const getDisplayName = (item: {
    name?: string;
    fullName?: string;
    firstName?: string;
    lastName?: string;
}) => item.name || item.fullName || [item.firstName, item.lastName].filter(Boolean).join(' ') || 'Nomsiz foydalanuvchi';

const getLocalizedTitle = (title?: ApiPurchasedBook['title']) => {
    if (!title) return '';
    if (typeof title === 'string') return title;

    return title.uz || title.ru || title.en || '';
};
 
const mapPurchasedBook = (item: ApiPurchasedBook, index: number): AdminUserPurchasedBook => {
    const product = typeof item.product === 'object' ? item.product : undefined;

    return {
        id: item._id || item.id || product?._id || product?.id || String(item.product || index),
        title: getLocalizedTitle(product?.title) || getLocalizedTitle(item.title) || 'Nomsiz kitob',
        quantity: Number(item.quantity || 1),
        price: item.priceAtTime ?? item.price,
        createdAt: item.createdAt
    };
};

const getPurchasedBooks = (item: {
    purchasedBooks?: ApiPurchasedBook[];
    items?: ApiPurchasedBook[];
    orders?: Array<{ items?: ApiPurchasedBook[]; createdAt?: string }>;
}) => {
    const directBooks = item.purchasedBooks?.length ? item.purchasedBooks : item.items;
    if (directBooks?.length) return directBooks.map(mapPurchasedBook);

    return (
        item.orders
            ?.flatMap((order) =>
                (order.items ?? []).map((book, index) =>
                    mapPurchasedBook(
                        {
                            ...book,
                            createdAt: book.createdAt || order.createdAt
                        },
                        index
                    )
                )
            )
            .filter(Boolean) ?? []
    );
};

const getOrdersCount = (item: {
    salesCount?: number;
    ordersCount?: number;
    orderCount?: number;
    orders?: Array<unknown>;
}) => item.ordersCount ?? item.orderCount ?? item.salesCount ?? item.orders?.length ?? 0;

const mapUser = (user: ApiUser): AdminUserListItem => ({
    id: user._id,
    name: getDisplayName(user),
    email: user.email ?? '',
    phones: user.phones?.length ? user.phones : user.phone ? [user.phone] : [],
    telegramUsername: user.telegramUsername,
    role: user.role,
    salesCount: getOrdersCount(user),
    createdAt: user.createdAt,
    birthDate: user.birthDate,
    source: 'BOOK_UZ',
    purchasedBooks: getPurchasedBooks(user)
});

const mapAmoContact = (contact: ApiAmoContact): AdminUserListItem => ({
    id: contact._id,
    name: getDisplayName(contact),
    email: contact.emails?.[0] ?? '',
    phones: contact.phones ?? [],
    telegramUsername: contact.telegramUsername,
    role: contact.role,
    salesCount: getOrdersCount(contact),
    createdAt: contact.createdAt,
    birthDate: contact.birthDate,
    source: 'AMO_CRM',
    purchasedBooks: getPurchasedBooks(contact)
});

export type ManualOrderPayload = {
    customer: {
        name: string;
        phone: string;
        email?: string;
        birthDate?: string;
        role?: 'client' | 'customer' | 'mijoz' | 'foydalanuvchi' | 'USER';
    };
    items: Array<{
        product: string;
        quantity: number;
        priceAtTime?: number;
    }>;
    paymentType?: 'CASH' | 'CLICK' | 'PAYME' | 'UZUM' | 'XAZNA';
    paymentStatus?: 'PENDING' | 'PAID' | 'FAILED';
    deliveryType?: 'PICKUP' | 'DELIVERY' | 'POST';
    shippingAddress?: {
        city?: string;
        region?: string;
        street?: string;
        phone?: string;
    };
    description?: string;
    allowDuplicate?: boolean;
};

export type UpdateAdminUserPayload = {
    name: string;
    phone?: string;
    email?: string;
    birthDate?: string;
    role?: 'client' | 'customer' | 'mijoz' | 'foydalanuvchi' | 'USER';
};

const formatUzPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');

    if (!digits) return '';
    if (digits.startsWith('998')) return `+${digits}`;

    return `+998${digits.replace(/^0+/, '')}`;
};

const cleanEmail = (email?: string) => {
    const value = email?.trim().toLowerCase();
    if (value?.startsWith('@')) return undefined;

    return value && value.includes('@') ? value : undefined;
};

const cleanTelegramUsername = (value?: string) => {
    const username = value?.trim();

    return username?.startsWith('@') ? username : undefined;
};

const getHttpStatus = (error: unknown) => {
    const apiError = error as { response?: { status?: number } };

    return apiError.response?.status;
};

const splitFullName = (name: string) => {
    const [firstName = '', ...lastNameParts] = name.trim().split(/\s+/);
    const lastName = lastNameParts.join(' ');

    return {
        firstName: firstName || undefined,
        lastName: lastName || undefined
    };
};

const normalizeUsersResponse = (data: AdminUsersApiData): AdminUsersResponse => {
    const users = data.users.map(mapUser);
    const amoContacts = data.amoContacts.map(mapAmoContact);

    return {
        users,
        amoContacts,
        items: [...users, ...amoContacts],
        pagination: data.pagination,
        totals: data.totals
    };
};

const normalizeSearchValue = (value: string) => value.trim().toLowerCase();

const normalizePhoneValue = (value: string) => value.replace(/\D/g, '');

const padDatePart = (value: number) => String(value).padStart(2, '0');

const getBirthDateSearchValues = (birthDate?: string) => {
    if (!birthDate) return [];

    const rawValue = normalizeSearchValue(birthDate);
    const date = new Date(birthDate);

    if (Number.isNaN(date.getTime())) return [rawValue];

    const year = String(date.getFullYear());
    const month = padDatePart(date.getMonth() + 1);
    const day = padDatePart(date.getDate());

    return [
        rawValue,
        `${year}-${month}-${day}`,
        `${day}.${month}.${year}`,
        `${day}/${month}/${year}`,
        `${day}-${month}-${year}`,
        `${year}${month}${day}`,
        `${day}${month}${year}`
    ].map(normalizeSearchValue);
};

const userMatchesSearch = (user: AdminUserListItem, search: string) => {
    const normalizedSearch = normalizeSearchValue(search);
    const phoneSearch = normalizePhoneValue(search);

    if (!normalizedSearch) return true;

    const textValues = [user.name, user.email, ...user.phones, ...getBirthDateSearchValues(user.birthDate)].map(
        normalizeSearchValue
    );
    const phoneValues = user.phones.map(normalizePhoneValue);

    return (
        textValues.some((value) => value.includes(normalizedSearch)) ||
        (phoneSearch.length > 0 && phoneValues.some((value) => value.includes(phoneSearch)))
    );
};

const getUniqueUsers = (items: AdminUserListItem[]) => {
    const seen = new Set<string>();

    return items.filter((item) => {
        const key = `${item.source}-${item.id}`;
        if (seen.has(key)) return false;

        seen.add(key);
        return true;
    });
};

const getSortValue = (user: AdminUserListItem, sortKey: AdminUserSortKey) => {
    const sortConfig: Record<AdminUserSortKey, string | number> = {
        name: user.name || '',
        phone: user.phones[0] || '',
        source: user.source,
        orders: user.salesCount || 0,
        registeredAt: new Date(user.createdAt || 0).getTime(),
        birthDate: new Date(user.birthDate || 0).getTime()
    };

    return sortConfig[sortKey];
};

const sortUsers = (
    items: AdminUserListItem[],
    sortKey?: AdminUserSortKey | 'default',
    sortOrder: AdminUserSortOrder = 'asc'
) => {
    if (!sortKey || sortKey === 'default') return items;

    return [...items].sort((firstUser, secondUser) => {
        const first = getSortValue(firstUser, sortKey);
        const second = getSortValue(secondUser, sortKey);

        if (typeof first === 'number' && typeof second === 'number') {
            return sortOrder === 'asc' ? first - second : second - first;
        }

        return sortOrder === 'asc'
            ? String(first).localeCompare(String(second), 'uz')
            : String(second).localeCompare(String(first), 'uz');
    });
};

const createUsersResponse = (
    items: AdminUserListItem[],
    pagination: AdminUsersPagination,
    totals: AdminUsersTotals
): AdminUsersResponse => ({
    users: items.filter((item) => item.source === 'BOOK_UZ'),
    amoContacts: items.filter((item) => item.source === 'AMO_CRM'),
    items,
    pagination,
    totals
});

const fetchAdminUsersPage = async (params: Pick<GetAdminUsersParams, 'page' | 'limit' | 'search'>) => {
    const response = await api.get<AdminUsersApiResponse>('/admin/users', {
        params: {
            page: params.page,
            limit: params.limit,
            search: params.search?.trim() || undefined
        }
    });

    return normalizeUsersResponse(response.data.data);
};

const fetchAdminUsersPagesInBatches = async (pages: number[], limit: number) => {
    const batchSize = 8;
    const responses: AdminUsersResponse[] = [];

    for (let index = 0; index < pages.length; index += batchSize) {
        const batch = pages.slice(index, index + batchSize);
        const batchResponses = await Promise.all(
            batch.map((page) =>
                fetchAdminUsersPage({
                    page,
                    limit
                })
            )
        );

        responses.push(...batchResponses);
    }

    return responses;
};

const getAllAdminUsersCached = async () => {
    const now = Date.now();

    if (allUsersCache && now - allUsersCache.cachedAt < ALL_USERS_CACHE_TTL) {
        return {
            items: allUsersCache.items,
            totals: allUsersCache.totals
        };
    }

    if (allUsersRequest) return allUsersRequest;

    allUsersRequest = (async () => {
        const firstPage = await fetchAdminUsersPage({
            page: 1,
            limit: ALL_USERS_PAGE_LIMIT
        });
        const pageLimit = firstPage.pagination.limit || ALL_USERS_PAGE_LIMIT;
        const totalPages = Math.max(1, firstPage.pagination.pages || 1);
        const restPages = Array.from({ length: totalPages - 1 }, (_, index) => index + 2);
        const responses = await fetchAdminUsersPagesInBatches(restPages, pageLimit);
        const items = getUniqueUsers([firstPage, ...responses].flatMap((response) => response.items));
        const result = {
            items,
            totals: firstPage.totals
        };

        allUsersCache = {
            ...result,
            cachedAt: Date.now()
        };
        allUsersRequest = null;

        return result;
    })().catch((error) => {
        allUsersRequest = null;
        throw error;
    });

    return allUsersRequest;
};

const fetchAllAdminUsers = async (params: GetAdminUsersParams): Promise<AdminUsersResponse> => {
    const { items: allItems, totals } = await getAllAdminUsersCached();
    const matchedItems = params.search
        ? allItems.filter((item) => userMatchesSearch(item, params.search || ''))
        : allItems;
    const sortedItems = sortUsers(matchedItems, params.sortKey, params.sortOrder);
    const start = (params.page - 1) * params.limit;
    const pageItems = sortedItems.slice(start, start + params.limit);
    const total = sortedItems.length;

    return createUsersResponse(
        pageItems,
        {
            page: params.page,
            limit: params.limit,
            total,
            pages: Math.max(1, Math.ceil(total / Math.max(params.limit, 1)))
        },
        totals
    );
};

const normalizeUserDetailResponse = (response: AdminUserApiResponse, fallbackId: string): AdminUserListItem | null => {
    const payload = response.data ?? response.user ?? response.contact;
    const detail =
        payload && 'user' in payload
            ? payload.user
            : payload && 'contact' in payload
              ? payload.contact
              : payload;

    if (!detail || !('_id' in detail)) return null;

    if ('emails' in detail || 'salesCount' in detail) {
        return mapAmoContact(detail as ApiAmoContact);
    }

    const mapped = mapUser(detail as ApiUser);

    return {
        ...mapped,
        id: mapped.id || fallbackId
    };
};

export const UsersService = {
    getAdminUsers: async (params: GetAdminUsersParams): Promise<AdminUsersResponse> => {
        const search = params.search?.trim();
        const hasSort = Boolean(params.sortKey && params.sortKey !== 'default');

        if (search || hasSort) {
            return fetchAllAdminUsers({ ...params, search });
        }

        return fetchAdminUsersPage(params);
    },

    getAdminUserById: async (id: string): Promise<AdminUserListItem | null> => {
        try {
            const response = await api.get<AdminUserApiResponse>(`/admin/users/${id}`);
            const user = normalizeUserDetailResponse(response.data, id);

            if (user) return user;
        } catch {
            // Fallback below keeps the detail page useful when only the list endpoint is available.
        }

        const { items } = await getAllAdminUsersCached();
        return items.find((item) => item.id === id || `${item.source}-${item.id}` === id) ?? null;
    },

    updateAdminUser: async (id: string, data: UpdateAdminUserPayload): Promise<AdminUserListItem | null> => {
        const phone = data.phone ? formatUzPhone(data.phone) : '';
        const fullName = data.name.trim();
        const { firstName, lastName } = splitFullName(fullName);
        const payload = {
            name: fullName,
            fullName,
            firstName,
            lastName,
            role: data.role ?? 'customer',
            phone: phone.length === 13 ? phone : undefined,
            email: cleanEmail(data.email),
            telegramUsername: cleanTelegramUsername(data.email),
            birthDate: data.birthDate || undefined
        };
        let response: { data: AdminUserApiResponse };

        try {
            response = await api.patch<AdminUserApiResponse>(`/admin/users/${id}`, payload);
        } catch (error) {
            const status = getHttpStatus(error);

            if (status !== 404 && status !== 405) {
                throw error;
            }

            response = await api.put<AdminUserApiResponse>(`/admin/users/${id}`, payload);
        }

        allUsersCache = null;
        allUsersRequest = null;

        return normalizeUserDetailResponse(response.data, id);
    },

    updateAdminUserByQuery: async (id: string, data: UpdateAdminUserPayload): Promise<AdminUserListItem | null> => {
        const phone = data.phone ? formatUzPhone(data.phone) : '';
        const fullName = data.name.trim();
        const { firstName, lastName } = splitFullName(fullName);
        const payload = {
            name: fullName,
            fullName,
            firstName,
            lastName,
            role: data.role ?? 'customer',
            phone: phone.length === 13 ? phone : undefined,
            email: cleanEmail(data.email),
            telegramUsername: cleanTelegramUsername(data.email),
            birthDate: data.birthDate || undefined
        };
        let response: { data: AdminUserApiResponse };

        try {
            response = await api.patch<AdminUserApiResponse>('/admin/users', payload, {
                params: { id }
            });
        } catch (error) {
            const status = getHttpStatus(error);

            if (status !== 404 && status !== 405) {
                throw error;
            }

            try {
                response = await api.put<AdminUserApiResponse>('/admin/users', payload, {
                    params: { id }
                });
            } catch (secondError) {
                const secondStatus = getHttpStatus(secondError);

                if (secondStatus !== 404 && secondStatus !== 405) {
                    throw secondError;
                }

                response = await api.patch<AdminUserApiResponse>('/admin/users', {
                    _id: id,
                    id,
                    ...payload
                });
            }
        }

        allUsersCache = null;
        allUsersRequest = null;

        return normalizeUserDetailResponse(response.data, id);
    },

    createUserForAdmin: async (data: ManualOrderPayload) => {
        const phone = formatUzPhone(data.customer.phone);
        const fullName = data.customer.name.trim();
        const { firstName, lastName } = splitFullName(fullName);

        const response = await api.post('/admin/users', {
            name: fullName,
            fullName,
            firstName,
            lastName,
            role: data.customer.role ?? 'customer',
            phone: phone.length === 13 ? phone : undefined,
            email: cleanEmail(data.customer.email),
            telegramUsername: cleanTelegramUsername(data.customer.email),
            birthDate: data.customer.birthDate || undefined,
            purchasedBooks: data.items,
            allowDuplicate: data.allowDuplicate ?? true,
            forceCreate: data.allowDuplicate ?? true,
            skipDuplicateCheck: data.allowDuplicate ?? true
        });
        allUsersCache = null;
        allUsersRequest = null;
        return response.data;
    }
};
