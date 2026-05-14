import { LoginPayload, LoginResponse } from '@/types/auth.types';

import { api } from './api';

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    const responseData = response.data?.data ?? response.data;

    return {
        success: response.data?.success,
        message: response.data?.message,
        token: responseData?.accessToken ?? responseData?.token,
        user: responseData?.user ?? null
    };
};

export const logout = async () => {
    const reponse = await api.post('/auth/logout');
    return reponse.data;
};
