import type { ReferralInput, ReferralStats } from '@/types/referral';

import { api } from './api';

export const AdminReferralService = {
    getAll: async (): Promise<ReferralStats[]> => {
        const response = await api.get('/admin/referrals');
        return response.data.data;
    },
    create: async (payload: ReferralInput): Promise<ReferralStats> => {
        const response = await api.post('/admin/referrals', payload);
        return response.data.data;
    },
    update: async ({ id, data }: { id: string; data: Partial<ReferralInput> }): Promise<ReferralStats> => {
        const response = await api.patch(`/admin/referrals/${id}`, data);
        return response.data.data;
    },
    delete: async (id: string): Promise<void> => {
        await api.delete(`/admin/referrals/${id}`);
    }
};
