export type TelegramSessionUser = {
    id: string;
    name: string;
    phone: string;
    telegramId: string;
    telegramUsername?: string;
    phoneVerified: boolean;
};

type TelegramSessionResponse = {
    data?: {
        user?: TelegramSessionUser;
    };
    message?: string;
};

type TelegramCashbackResponse = {
    data?: {
        balance?: number | string;
    };
    message?: string;
};

type TelegramCashbackQrResponse = {
    data?: {
        qrValue?: string;
        expiresAt?: string;
    };
    message?: string;
};

export type TelegramCashbackQr = {
    qrValue: string;
    expiresAt: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export const TelegramService = {
    createSession: async (initData: string): Promise<TelegramSessionUser> => {
        if (!API_URL) {
            throw new Error('NEXT_PUBLIC_API_URL sozlanmagan');
        }

        const response = await fetch(`${API_URL}/mini-app/session`, {
            method: 'POST',
            headers: {
                Authorization: `tma ${initData}`
            }
        });
        const result = (await response.json()) as TelegramSessionResponse;

        if (!response.ok) {
            throw new Error(result.message || 'Sessiyani ochib bo‘lmaydi');
        }

        if (!result.data?.user) {
            throw new Error('Server foydalanuvchi ma’lumotini qaytarmadi');
        }

        return result.data.user;
    },
    getCashbackBalance: async (initData: string): Promise<number> => {
        if (!API_URL) {
            throw new Error('NEXT_PUBLIC_API_URL sozlanmagan');
        }

        const response = await fetch(`${API_URL}/mini-app/cashback`, {
            method: 'GET',
            headers: {
                Authorization: `tma ${initData}`
            }
        });
        const result = (await response.json()) as TelegramCashbackResponse;

        if (!response.ok) {
            throw new Error(result.message || 'Cashback balansini olib bo‘lmaydi');
        }

        const balance = Number(result.data?.balance || 0);

        return Number.isFinite(balance) ? balance : 0;
    },
    createCashbackQr: async (initData: string): Promise<TelegramCashbackQr> => {
        if (!API_URL) {
            throw new Error('NEXT_PUBLIC_API_URL sozlanmagan');
        }

        const response = await fetch(`${API_URL}/mini-app/cashback/qr`, {
            method: 'POST',
            headers: {
                Authorization: `tma ${initData}`
            }
        });
        const result = (await response.json()) as TelegramCashbackQrResponse;

        if (!response.ok) {
            throw new Error(result.message || 'QR-kodni yaratib bo‘lmaydi');
        }

        if (!result.data?.qrValue || !result.data.expiresAt) {
            throw new Error('Server QR-kod ma’lumotlarini qaytarmadi');
        }

        return {
            qrValue: result.data.qrValue,
            expiresAt: result.data.expiresAt
        };
    }
};
