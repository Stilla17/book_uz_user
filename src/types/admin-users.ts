export type AdminUserSource = 'BOOK_UZ' | 'AMO_CRM';

export type AdminUserListItem = {
    id: string;
    name: string;
    email: string;
    phones: string[];
    telegramUsername?: string;
    role?: string;
    salesCount: number;
    createdAt?: string;
    birthDate?: string;
    source: AdminUserSource;
    purchasedBooks?: AdminUserPurchasedBook[];
};

export type AdminUserPurchasedBook = {
    id: string;
    title: string;
    quantity: number;
    price?: number;
    createdAt?: string;
};

export type AdminUsersPagination = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

export type AdminUsersTotals = {
    users: number;
    amoContacts: number;
    all: number;
};

export type AdminUsersResponse = {
    users: AdminUserListItem[];
    amoContacts: AdminUserListItem[];
    items: AdminUserListItem[];
    pagination: AdminUsersPagination;
    totals: AdminUsersTotals;
};
