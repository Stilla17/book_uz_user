export type CatalogCategory = 'badiiy' | 'nobadiiy' | 'trend' | 'bolalar-adabiyoti';

export type CatalogCategoryFilter = 'hammasi' | CatalogCategory;

export type CatalogStatusFilter = 'hammasi' | 'active' | 'inactive';

export type CatalogItem = {
    _id: string;
    price: number;
    wholesalePrice?: number;
    moyskladName?: string;
    image: string;
    imageKey?: string;
    category: CatalogCategory;
    isActive: boolean;
    moyskladExternalCode?: string;
    moyskladId?: string;
    priceSyncedAt?: string;
    priceSyncStatus?: 'pending' | 'synced' | 'error';
    priceSyncError?: string;
    createdAt: string;
    updatedAt: string;
};

export type CatalogPagination = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

export type CatalogListResponse = {
    catalogs: CatalogItem[];
    pagination: CatalogPagination;
};

export type CatalogListParams = {
    page?: number;
    limit?: number;
    category?: CatalogCategoryFilter;
    isActive?: boolean;
};
