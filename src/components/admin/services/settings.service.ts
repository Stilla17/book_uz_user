import { api } from './api';

export type DeliverySettings = {
    deliveryFee: number;
};

export const SettingsService = {
    getDeliverySettings: async (): Promise<DeliverySettings> => {
        const response = await api.get('/admin/settings/delivery');
        return response.data.data;
    },

    updateDeliverySettings: async (deliveryFee: number): Promise<DeliverySettings> => {
        const response = await api.put('/admin/settings/delivery', { deliveryFee });
        return response.data.data;
    }
};
