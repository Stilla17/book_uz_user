import { Product } from '@/types';

import { api } from './api';

export type TopSalesPeriod = 'week' | 'month';

export type TopSalesResponse = {
    period: TopSalesPeriod;
    from?: string;
    to?: string;
    syncedAt?: string | null;
    products: Product[];
};

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

const hasAuthorName = (product: Product) => {
    const author = product.author as unknown;

    if (product.authorName) return true;
    if (typeof author === 'string') return !isObjectId(author);
    if (Array.isArray(author)) return author.some((item) => typeof item?.name === 'string' && item.name.trim());

    return Boolean(author && typeof author === 'object' && typeof (author as { name?: unknown }).name === 'string');
};

const enrichMissingAuthors = async (products: Product[]) =>
    Promise.all(
        products.map(async (product) => {
            if (hasAuthorName(product)) return product;

            try {
                const response = await api.get(`/products/${product._id}`);
                const detailedProduct = response.data?.data as Product | undefined;

                if (!detailedProduct) return product;

                return {
                    ...product,
                    author: detailedProduct.author ?? product.author,
                    authorName: detailedProduct.authorName ?? product.authorName
                };
            } catch {
                return product;
            }
        })
    );

export const topSalesService = {
    async getTopSales(period: TopSalesPeriod, limit = 10): Promise<TopSalesResponse> {
        const response = await api.get('/top-sales', {
            params: { period, limit }
        });

        const data = response.data?.data ?? {
            period,
            products: [],
            syncedAt: null
        };

        return {
            ...data,
            products: await enrichMissingAuthors(data.products ?? [])
        };
    }
};
