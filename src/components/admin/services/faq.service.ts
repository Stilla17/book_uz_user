import { FaqForm } from '@/app/(admin)/admin/faq/new/page';

import { api } from './api';

type FaqPaginationParams = {
    page?: number;
    limit?: number;
    search?: string;
};

export const FaqService = {
    getFaqs: async (params?: FaqPaginationParams) => {
        const response = await api.get('/admin/faqs', { params });
        return response.data.data;
    },
    createFaqs: async (data: FaqForm) => {
        const response = await api.post('/admin/faqs', data);
        return response.data;
    },
    getFaqId: async (id: string) => {
        const response = await api.get(`/admin/faqs/${id}`);
        return response.data;
    },
    updateFaq: async (id: string, faq: FaqForm) => {
        const response = await api.patch(`/admin/faqs/${id}`, faq);
        return response.data.data;
    },
    deleteFaq: async (id: string) => {
        const response = await api.delete(`/admin/faqs/${id}`);
        return response.data.data;
    }
};
