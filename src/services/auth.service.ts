import { LoginPayload, LoginWithTelegramResponse, TelegramAuthPayload } from '@/types/auth.types';

import { api, getAccessTokenFromResponse, setAccessToken, setAuthSession } from './api';

export const AuthServiceAPI = {
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        setAccessToken(getAccessTokenFromResponse(response));
        setAuthSession(true);
        return response.data;
    },
    sendPhoneOtp: async (data: { phone: string; mode?: 'login' | 'register'; name?: string; birthDate?: string }) => {
        const response = await api.post('/auth/phone/send-otp', data);
        return response.data;
    },
    loginWithPhone: async (data: { phone: string; name: string; wishlist?: unknown[] }) => {
        const response = await api.post('/auth/phone/login', data);
        setAccessToken(getAccessTokenFromResponse(response));
        setAuthSession(true);
        return response.data;
    },
    verifyPhoneOtp: async (data: {
        phone: string;
        otp: string;
        name?: string;
        birthDate?: string;
        wishlist?: unknown[];
    }) => {
        const response = await api.post('/auth/phone/verify-otp', data);
        setAccessToken(getAccessTokenFromResponse(response));
        setAuthSession(true);
        return response.data;
    },
    refresh: async () => {
        const response = await api.post('/auth/refresh');
        const refreshedAccessToken = getAccessTokenFromResponse(response);

        if (!refreshedAccessToken) {
            throw new Error('Refresh javobida access token topilmadi');
        }

        setAccessToken(refreshedAccessToken);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        setAccessToken(null);
        setAuthSession(false);
        return response.data;
    },
    forgotPassword: async (email: string, method: 'EMAIL' | 'TELEGRAM') => {
        const response = await api.post('/auth/forgot-password', { email, method });
        return response.data;
    },
    resetPassword: async (email: string, otp: string, newPassword: string) => {
        const response = await api.post('/auth/reset-password', { email, otp, newPassword });
        return response.data;
    },
    authWithTelegram: async (payload: TelegramAuthPayload): Promise<LoginWithTelegramResponse> => {
        const response = await api.post<LoginWithTelegramResponse>('/auth/login/telegram', payload);
        setAccessToken(getAccessTokenFromResponse(response));
        setAuthSession(true);
        return response.data;
    }
};
