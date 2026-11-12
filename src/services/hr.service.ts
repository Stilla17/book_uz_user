import { api } from './api';

export type HrSubmissionResponse = {
    applicationNumber: string;
    submittedAt: string;
};

export const HrService = {
    submit: async (payload: FormData): Promise<HrSubmissionResponse> => {
        const response = await api.post('/hr/applications', payload, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data.data;
    }
};
