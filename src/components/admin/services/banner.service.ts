import { api } from './api';

const getBannerPayload = (data: any) => data?.data ?? data;

export const BannerService = {
    getBanners: async () => {
        const response = await api.get('/admin/banners');
        return getBannerPayload(response.data);
    },

    getBannerById: async (id: string) => {
        const response = await api.get(`/admin/banners/${id}`);
        const data = getBannerPayload(response.data);
        return data?.banner ?? data;
    },

    addBanner: async (bannerData: FormData) => {
        const response = await api.post('/admin/banners', bannerData);
        return response.data;
    },

    updateBanner: async (id: string, bannerData: FormData) => {
        const response = await api.put(`/admin/banners/${id}`, bannerData);
        return response.data;
    },

    deleteBanner: async (id: string) => {
        const response = await api.delete(`/admin/banners/${id}`);
        return response.data;
    }
};
