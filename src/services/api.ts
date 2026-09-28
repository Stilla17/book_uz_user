import { Product, PublisherItems } from '@/types';

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_SESSION_KEY = 'bookuz:auth-session';
const ACCESS_TOKEN_KEY = 'bookuz:access-token';

const readStoredAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? null;
};

const writeStoredAccessToken = (token: string | null) => {
    if (typeof window === 'undefined') return;
    if (token) {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
        return;
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const hasAuthSession = () => typeof window !== 'undefined' && localStorage.getItem(AUTH_SESSION_KEY) === 'true';

export const setAuthSession = (value: boolean) => {
    if (typeof window === 'undefined') return;
    value ? localStorage.setItem(AUTH_SESSION_KEY, 'true') : localStorage.removeItem(AUTH_SESSION_KEY);
};

// Axios' production bundle exposes `create` through its default export.
// eslint-disable-next-line import/no-named-as-default-member
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// eslint-disable-next-line import/no-named-as-default-member
const refreshApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export let accessToken: string | null = null;

export const getAccessTokenFromResponse = (response: any): string | null =>
    response?.data?.data?.accessToken ??
    response?.data?.accessToken ??
    response?.data?.data?.token ??
    response?.data?.token ??
    null;

export const setAccessToken = (token: string | null) => {
    accessToken = token;
    writeStoredAccessToken(token);
};

export const getAccessToken = () => accessToken ?? readStoredAccessToken();

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        console.error('Request Error:', error);
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

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (originalRequest.url?.includes('/auth/refresh')) {
            throw error;
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                await new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                });

                const refreshedToken = getAccessToken();
                if (refreshedToken) {
                    originalRequest.headers = originalRequest.headers ?? {};
                    originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
                }

                return api(originalRequest);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshResponse = await refreshApi.post('/auth/refresh');

                const refreshedAccessToken = getAccessTokenFromResponse(refreshResponse);
                if (!refreshedAccessToken) {
                    throw new Error('Refresh javobida access token topilmadi');
                }

                setAccessToken(refreshedAccessToken);
                isRefreshing = false;
                processQueue(null, refreshedAccessToken);

                originalRequest.headers = originalRequest.headers ?? {};
                originalRequest.headers.Authorization = `Bearer ${refreshedAccessToken}`;
                return api(originalRequest);
            } catch (refreshError: any) {
                console.error('Refresh failed:', refreshError.response?.status || refreshError.message);

                isRefreshing = false;
                processQueue(refreshError, null);
                setAccessToken(null);
                setAuthSession(false);

                throw refreshError;
            }
        }

        throw error;
    }
);

export const getOrderProductId = (product: any) => {
    if (typeof product === 'string') return product;

    return product?._id || product?.id || product?.productId || product?.product?._id || product?.product?.id || '';
};

type PublisherPaginationParams = {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
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
    getPublishers: async (params?: PublisherPaginationParams, signal?: AbortSignal): Promise<PublishersResponse> => {
        const response = await api.get('/publishers', { params, signal });
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
