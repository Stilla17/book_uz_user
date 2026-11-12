export type AdminUserSource = 'BOOK_UZ' | 'AMO_CRM' | 'MOYSKLAD';

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
    branchId?: string;
    branchName?: string;
    branchNames?: string[];
    source: AdminUserSource;
    sources?: AdminUserSource[];
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
    amoCrmContacts?: number;
    moyskladContacts?: number;
    all: number;
};

export type AdminUsersResponse = {
    users: AdminUserListItem[];
    amoContacts: AdminUserListItem[];
    moyskladContacts: AdminUserListItem[];
    items: AdminUserListItem[];
    pagination: AdminUsersPagination;
    totals: AdminUsersTotals;
};

export type MoyskladDailyStat = {
    date: string;
    integrated: number;
    removedInvalid: number;
    syncRuns: number;
    received: number;
    synchronized: number;
    skippedInvalid: number;
    lastSyncAt?: string;
};

export type MoyskladDailyStatsResponse = {
    days: MoyskladDailyStat[];
    today: Pick<MoyskladDailyStat, 'date' | 'integrated' | 'removedInvalid'>;
};
