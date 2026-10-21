import type { CatalogItem, CatalogListParams, CatalogListResponse } from '@/types/catalog';

import { api } from './api';

export const CatalogService = {
    getCatalogs: async (params: CatalogListParams, signal?: AbortSignal) => {
        const response = await api.get<{ data: CatalogListResponse }>('/admin/catalogs', { params, signal });

        return response.data.data;
    },

    getCatalogById: async (id: string) => {
        const response = await api.get<{ data: CatalogItem }>(`/admin/catalogs/${id}`);

        return response.data.data;
    },

    createCatalog: async (formData: FormData) => {
        const response = await api.post('/admin/catalogs', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
    },

    updateCatalog: async (id: string, formData: FormData) => {
        const response = await api.patch(`/admin/catalogs/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
    },

    syncCatalogPrices: async () => {
        const response = await api.post('/admin/catalogs/sync');

        return response.data;
    },

    toggleCatalogStatus: async (id: string) => {
        const response = await api.patch(`/admin/catalogs/${id}/toggle-status`);

        return response.data;
    },

    deleteCatalog: async (id: string) => {
        const response = await api.delete(`/admin/catalogs/${id}`);

        return response.data;
    }
};
