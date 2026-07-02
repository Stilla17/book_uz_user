import { api } from './api';

export type DiscountType = 'PERCENT' | 'FIXED';
export type DiscountTargetType = 'PRODUCTS' | 'PUBLISHERS';

export type DiscountForm = {
    name: string;
    type: DiscountType;
    value: number;
    targetType: DiscountTargetType;
    products: string[];
    publishers: string[];
    minOrderAmount: number;
    startDate: string;
    endDate: string;
    isActive: boolean;
};

export type DiscountReference =
    | string
    | {
          _id?: string;
          name?: string;
          title?: string | { uz?: string; ru?: string; en?: string };
      };

export type Discount = Omit<DiscountForm, 'products' | 'publishers'> & {
    _id: string;
    products?: DiscountReference[];
    publishers?: DiscountReference[];
    createdAt?: string;
    updatedAt?: string;
};

const normalizeDiscounts = (data: unknown): Discount[] => {
    if (Array.isArray(data)) return data as Discount[];

    if (data && typeof data === 'object') {
        const record = data as {
            discounts?: Discount[];
            items?: Discount[];
            docs?: Discount[];
        };

        return record.discounts ?? record.items ?? record.docs ?? [];
    }

    return [];
};

export const DiscountService = {
    getDiscounts: async () => {
        const response = await api.get('/admin/discounts');
        return normalizeDiscounts(response.data.data);
    },

    createDiscount: async (data: DiscountForm) => {
        const response = await api.post('/admin/discounts', data);
        return response.data;
    },

    deleteDiscount: async (id: string) => {
        const response = await api.delete(`/admin/discounts/${id}`);
        return response.data;
    },

    updateDiscount: async (id: string, data: DiscountForm) => {
        const response = await api.put(`/admin/discounts/${id}`, data);
        return response.data;
    }
};
