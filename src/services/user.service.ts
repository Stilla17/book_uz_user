import { CreateCommentPayload, OrderPayload } from '@/types';

import { api, getOrderProductId } from './api';

export const UserService = {
    getProfile: async () => {
        const response = await api.get('/users/profile');
        return response.data;
    },
    updateProfile: async (data: any) => {
        const response = await api.patch('/users/profile', data, {
            headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined
        });
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

    getPaymeCheckoutUrl: (orderId: string) => {
        const apiBaseUrl = String(api.defaults.baseURL || '').replace(/\/+$/, '');

        return `${apiBaseUrl}/payme/checkout/${encodeURIComponent(orderId)}`;
    },

    getDeliverySettings: async (): Promise<{ deliveryFee: number }> => {
        const response = await api.get('/settings/delivery');
        return response.data.data;
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

    addToCart: async (data: { productId: string; quantity: number; priceAtTime?: number }) => {
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
