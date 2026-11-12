import { api } from './api';

export const ReferralService = {
    track: async (code: string) => {
        const response = await api.post('/referrals/track', { code });
        return response.data.data;
    }
};
