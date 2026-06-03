import { CreateCommentPayload, OrderPayload, Product, PublisherItems } from '@/types';

import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// Access tokenni saqlash uchun o'zgaruvchi
let accessToken: string | null = null;

// Access tokenni o'rnatish funksiyasi
export const setAccessToken = (token: string) => {
    accessToken = token;
};

// Access tokenni olish funksiyasi
export const getAccessToken = () => accessToken;

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Agar accessToken mavjud bo'lsa, header ga qo'shish
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        // console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        throw error;
    }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor - 401 xatoliklarini handle qilish
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // MUHIM: Agar xato /auth/refresh so'rovidan kelsa, interceptor hech narsa qilmasligi kerak
        if (originalRequest.url?.includes('/auth/refresh')) {
            throw error;
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });

                // Yangi accessToken bilan so'rovni qayta jo'natish
                if (accessToken) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }

                return api(originalRequest);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('🔄 Token yangilanmoqda...');

                // Refresh token so'rovi (cookie avtomatik yuboriladi)
                const refreshResponse = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // Yangi accessToken ni saqlash
                if (refreshResponse.data?.data?.accessToken) {
                    accessToken = refreshResponse.data.data.accessToken;
                    console.log('✅ Yangi accessToken olindi');
                }

                isRefreshing = false;
                processQueue(null, accessToken);

                // Asl so'rovni yangi token bilan qayta jo'natish
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError: any) {
                console.error('❌ Refresh failed:', refreshError.response?.status || refreshError.message);

                isRefreshing = false;
                processQueue(refreshError, null);
                accessToken = null;

                // Faqat kerak bo'lganda redirect qilish
                if (
                    typeof window !== 'undefined' &&
                    !window.location.pathname.includes('/auth/login') &&
                    !window.location.pathname.includes('/auth/register')
                ) {
                    window.location.href = '/auth/login';
                }
                throw refreshError;
            }
        }
        throw error;
    }
);

export const AuthServiceAPI = {
    register: async (data: any) => {
        const response = await api.post('/auth/register', data);
        if (response.data?.data?.accessToken) {
            accessToken = response.data.data.accessToken;
        }
        return response.data;
    },
    login: async (credentials: any) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data?.data?.accessToken) {
            accessToken = response.data.data.accessToken;
        }
        return response.data;
    },
    refresh: async () => {
        const response = await api.post('/auth/refresh');
        if (response.data?.data?.accessToken) {
            accessToken = response.data.data.accessToken;
        }
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/auth/logout');
        accessToken = null;
        return response.data;
    },
    forgotPassword: async (email: string, method: 'EMAIL' | 'TELEGRAM') => {
        const response = await api.post('/auth/forgot-password', { email, method });
        return response.data;
    },
    resetPassword: async (email: string, otp: string, newPassword: string) => {
        const response = await api.post('/auth/reset-password', { email, otp, newPassword });
        return response.data;
    }
};

const getOrderProductId = (product: any) => {
    if (typeof product === 'string') return product;

    return product?._id || product?.id || product?.productId || product?.product?._id || product?.product?.id || '';
};

export const UserService = {
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await api.patch('/profile', data);
        return response.data;
    },
    updatePassword: async (data: any) => {
        const response = await api.patch('/profile/update-password', data);
        return response.data;
    },

    // Orders
    createOrder: async (orderPayload: OrderPayload) => {
        const normalizedPayload = {
            ...orderPayload,
            items: orderPayload.items.map((item: any) => ({
                product: getOrderProductId(item.product),
                quantity: item.quantity,
                priceAtTime: item.priceAtTime
            }))
        };
        const response = await api.post('/orders', normalizedPayload);
        return response.data;
    },

    createClickPayment: async (orderId: string) => {
        const response = await api.post('/click/create-order', { orderId });
        return response.data;
    },

    createPaymePayment: async (orderId: string) => {
        const response = await api.post('/payme/create-order', { orderId });
        return response.data;
    },

    getOrders: async () => {
        const response = await api.get('/orders');
        return response.data.data;
    },

    // locations regions and districts
    getLocations: async () => {
        const response = await api.get('/locations');
        return response.data.data;
    },
    getRegions: async () => {
        const response = await api.get('/locations/regions');
        return response.data.data;
    },
    getDistricts: async () => {
        const response = await api.get('/locations/districts');
        return response.data.data;
    },

    // Wishlist
    getWishlist: async () => {
        const res = await api.get('/users/wishlist');
        return res.data;
    },

    addWishlist: async (productId: string) => {
        const res = await api.post('/users/wishlist/toggle', { productId });
        return res.data;
    },

    removeWishlist: async (productId: string) => {
        const res = await api.post('/users/wishlist/toggle', { productId });
        return res.data;
    },

    toggleWishlist: async (productId: string) => {
        const res = await api.post('/users/wishlist/toggle', { productId });
        return res.data;
    },

    syncWishlist: async (productIds: string[]) => {
        const res = await api.post('/users/wishlist/sync', { productIds });
        return res.data;
    },

    // Cart
    getCart: async () => {
        const response = await api.get('/cart');
        return response.data;
    },

    addToCart: async (data: { productId: string; quantity: number }) => {
        const response = await api.post('/cart/add', data);
        return response.data;
    },

    updateCart: async (data: { productId: string; quantity: number }) => {
        const response = await api.patch('/cart/update', data);
        return response.data;
    },

    removeFromCart: async (productId: string) => {
        const response = await api.delete(`/cart/remove/${productId}`);
        return response.data;
    },

    clearCart: async () => {
        const response = await api.delete('/cart/clear');
        return response.data;
    },

    // Comments
    createComment: async (payload: CreateCommentPayload) => {
        const response = await api.post('/comments', payload);
        return response.data.data;
    },

    getComments: async (bookId: string) => {
        const response = await api.get(`/comments/book/${bookId}`);
        return response.data.data ?? response.data;
    },

    // Addresses
    getAddresses: async () => {
        const response = await api.get('/addresses');
        return response.data;
    },
    addAddress: async (address: any) => {
        const response = await api.post('/addresses', address);
        return response.data;
    },
    updateAddress: async (addressId: string, address: any) => {
        const response = await api.patch(`/addresses/${addressId}`, address);
        return response.data;
    },
    deleteAddress: async (addressId: string) => {
        const response = await api.delete(`/addresses/${addressId}`);
        return response.data;
    },

    // Avatar
    uploadAvatar: async (formData: FormData) => {
        const response = await api.patch('/profile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Notification settings
    getNotificationSettings: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },
    updateNotificationSettings: async (settings: any) => {
        const response = await api.put('/notifications', settings);
        return response.data;
    },

    // Security settings
    getSecuritySettings: async () => {
        const response = await api.get('/security');
        return response.data;
    },
    updateSecuritySettings: async (settings: any) => {
        const response = await api.put('/security', settings);
        return response.data;
    },

    // Language & Region
    getPreferences: async () => {
        const response = await api.get('/preferences');
        return response.data;
    },
    updatePreferences: async (preferences: any) => {
        const response = await api.put('/preferences', preferences);
        return response.data;
    },

    // Devices
    getDevices: async () => {
        const response = await api.get('/devices');
        return response.data;
    },
    removeDevice: async (deviceId: string) => {
        const response = await api.delete(`/devices/${deviceId}`);
        return response.data;
    },

    // Delete account
    deleteAccount: async (password: string) => {
        const response = await api.delete('/account', { data: { password } });
        return response.data;
    }
};

type PublisherPaginationParams = {
    page?: number;
    limit?: number;
    search?: string;
};

export type OtherPagination = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

export type PublishersResponse = {
    publishers: PublisherItems[];
    pagination: OtherPagination;
};

export type PublisherProductsResponse = {
    publisher: PublisherItems | null;
    products: Product[];
    pagination: OtherPagination;
};

const normalizePublishersResponse = (data: any, fallbackLimit: number): PublishersResponse => {
    const publishers = Array.isArray(data?.publishers) ? data.publishers : Array.isArray(data) ? data : [];
    const paginationSource = data?.pagination ?? data;
    const limit = Number(paginationSource?.limit ?? fallbackLimit);
    const total = Number(paginationSource?.total ?? paginationSource?.totalItems ?? publishers.length);
    const page = Number(paginationSource?.page ?? paginationSource?.currentPage ?? 1);
    const totalPages = Number(
        paginationSource?.totalPages ?? paginationSource?.pages ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)))
    );

    return {
        publishers,
        pagination: {
            page: Number.isFinite(page) ? page : 1,
            limit: Number.isFinite(limit) ? limit : fallbackLimit,
            total: Number.isFinite(total) ? total : publishers.length,
            pages: Number.isFinite(totalPages) ? totalPages : 1
        }
    };
};

export const ClientService = {
    getPublishers: async (params?: PublisherPaginationParams): Promise<PublishersResponse> => {
        const response = await api.get('/publishers', { params });
        return normalizePublishersResponse(response.data.data, params?.limit ?? 12);
    },

    getPublisherProducts: async (
        slug: string,
        params?: PublisherPaginationParams
    ): Promise<PublisherProductsResponse> => {
        const response = await api.get(`/publishers/${slug}/products`, { params });
        const data = response.data.data;
        const products = Array.isArray(data?.products) ? data.products : [];
        const paginationSource = data?.pagination ?? data;
        const limit = Number(paginationSource?.limit ?? params?.limit ?? 12);
        const total = Number(paginationSource?.total ?? products.length);
        const page = Number(paginationSource?.page ?? params?.page ?? 1);
        const totalPages = Number(
            paginationSource?.totalPages ??
                paginationSource?.pages ??
                Math.max(1, Math.ceil(total / Math.max(limit, 1)))
        );

        return {
            publisher: data?.publisher ?? null,
            products,
            pagination: {
                page: Number.isFinite(page) ? page : 1,
                limit: Number.isFinite(limit) ? limit : (params?.limit ?? 12),
                total: Number.isFinite(total) ? total : products.length,
                pages: Number.isFinite(totalPages) ? totalPages : 1
            }
        };
    }
};
