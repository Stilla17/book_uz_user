import type { HrApplication, HrApplicationsResponse, HrStatus } from '@/types/hr';

import { api } from './api';

export type HrListParams = {
    page?: number;
    limit?: number;
    search?: string;
    status?: HrStatus | '';
    dateFrom?: string;
    dateTo?: string;
};

export const AdminHrService = {
    getAll: async (params: HrListParams): Promise<HrApplicationsResponse> => {
        const response = await api.get('/admin/hr', { params });
        return response.data.data;
    },
    getById: async (id: string): Promise<HrApplication> => {
        const response = await api.get(`/admin/hr/${id}`);
        return response.data.data;
    },
    update: async ({ id, data }: { id: string; data: Partial<HrApplication> }): Promise<HrApplication> => {
        const response = await api.patch(`/admin/hr/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/admin/hr/${id}`);
    },
    downloadDocx: async (id: string, applicationNumber: string): Promise<void> => {
        const response = await api.get(`/admin/hr/${id}/download-docx`, { responseType: 'blob' });
        const url = URL.createObjectURL(response.data);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${applicationNumber}-malumotnoma.docx`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
    }
};
