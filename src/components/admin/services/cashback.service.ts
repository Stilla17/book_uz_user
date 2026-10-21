import { isAxiosError } from 'axios';

import { api } from './api';

export type CashbackScanResult = {
    qrSessionId: string;
    customer: { name: string; phone: string };
    cashback: { balance: number };
    expiresAt: string;
};

type CashbackScanResponse = {
    data?: CashbackScanResult;
    message?: string;
};

export const scanCashbackQr = async (qrValue: string): Promise<CashbackScanResult> => {
    try {
        const response = await api.post<CashbackScanResponse>('/admin/cashback/scan', { qrValue });

        if (!response.data.data) {
            throw new Error(response.data.message || 'Cashback ma’lumoti topilmadi');
        }

        return response.data.data;
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'QR-kodni tekshirib bo‘lmadi');
        }

        throw error;
    }
};
