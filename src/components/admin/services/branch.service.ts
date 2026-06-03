import { Branch, BranchFormData } from '@/types';

import { api } from './api';

const getBranchPayload = (data: any) => data?.data ?? data;

export const BranchService = {
    getBranches: async () => {
        const response = await api.get('/admin/branches');
        return getBranchPayload(response.data);
    },
    getBranchesUser: async () => {
        const response = await api.get('/branch-locations');
        return getBranchPayload(response.data);
    },

    getBranchById: async (id: string): Promise<Branch> => {
        const response = await api.get(`/admin/branches/${id}`);
        const data = getBranchPayload(response.data);
        return data?.branch ?? data;
    },

    createBranch: async (branch: BranchFormData) => {
        const response = await api.post('/admin/branches', branch);
        return response.data;
    },

    updateBranch: async (id: string, branch: BranchFormData) => {
        const response = await api.patch(`/admin/branches/${id}`, branch);
        return response.data;
    },

    deleteBranch: async (id: string) => {
        const response = await api.delete(`/admin/branches/${id}`);
        return response.data;
    }
};
