// services/book.service.ts
import { Book, Product } from '@/types';

import { api } from './api';

type ProductPagination = {
    page: number;
    limit: number;
    total: number;
    pages: number;
};

type ProductListResponse = {
    products: Product[];
    pagination: ProductPagination;
};

const getNumber = (...values: unknown[]) => {
    for (const value of values) {
        const numberValue = Number(value);
        if (Number.isFinite(numberValue) && numberValue >= 0) return numberValue;
    }

    return undefined;
};

const normalizeProductList = (data: any, fallbackLimit: number): ProductListResponse => {
    const products = Array.isArray(data?.products)
        ? data.products
        : Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.docs)
            ? data.docs
            : Array.isArray(data)
              ? data
              : [];

    const rawPagination = data?.pagination ?? data?.meta ?? data;
    const limit = getNumber(rawPagination?.limit, rawPagination?.perPage, data?.limit, fallbackLimit) ?? fallbackLimit;
    const total =
        getNumber(
            rawPagination?.total,
            rawPagination?.totalItems,
            rawPagination?.totalDocs,
            data?.total,
            products.length
        ) ?? products.length;
    const page = getNumber(rawPagination?.page, rawPagination?.currentPage, data?.page, 1) ?? 1;
    const pages =
        getNumber(
            rawPagination?.pages,
            rawPagination?.totalPages,
            rawPagination?.totalPage,
            data?.pages,
            data?.totalPages
        ) ?? Math.max(1, Math.ceil(total / Math.max(limit, 1)));

    return {
        products,
        pagination: {
            page,
            limit,
            total,
            pages
        }
    };
};

export const bookService = {
    // Barcha kitoblarni olish
    async getAllProducts(params?: any): Promise<ProductListResponse> {
        try {
            const response = await api.get('/products', { params });
            return normalizeProductList(response.data?.data, params?.limit || 10);
        } catch (error) {
            console.error('Error fetching products:', error);
            return {
                products: [],
                pagination: { page: 1, limit: params?.limit || 10, total: 0, pages: 1 }
            };
        }
    },

    async getNewArrivals(): Promise<Product[]> {
        try {
            const response = await api.get('/products/new-arrivals');
            return Array.isArray(response.data?.data) ? response.data.data : [];
        } catch (error) {
            console.error('Error fetching new arrivals:', error);
            return [];
        }
    },

    // Muallif ID bo'yicha kitoblarni olish
    async getBooksByAuthor(authorId: string, limit = 10): Promise<{ books: Book[] }> {
        try {
            const response = await api.get(`/products?author=${authorId}&limit=${limit}`);
            return response.data.data || { books: [] };
        } catch (error) {
            console.error('Error fetching books by author:', error);
            return { books: [] };
        }
    },

    async getProductsByAuthor(authorId: string, params?: any): Promise<ProductListResponse> {
        try {
            const response = await api.get(`/authors/${authorId}/products`, { params });
            return normalizeProductList(response.data?.data, params?.limit || 12);
        } catch (error) {
            console.error('Error fetching author products:', error);
            return {
                products: [],
                pagination: { page: 1, limit: params?.limit || 12, total: 0, pages: 1 }
            };
        }
    },

    // Bitta kitobni olish
    async getBookById(id: string): Promise<Book | null> {
        try {
            const response = await api.get(`/products/${encodeURIComponent(id)}`);
            return response.data.data || null;
        } catch (error) {
            console.error('Error fetching book:', error);
            return null;
        }
    },

    async trackView(id: string): Promise<number> {
        const response = await api.post(`/products/${encodeURIComponent(id)}/view`);
        const views = Number(response.data?.data?.views);

        if (!Number.isFinite(views) || views < 0) {
            throw new Error("Ko'rishlar soni API javobida topilmadi");
        }

        return views;
    },

    // Kategoriya bo'yicha kitoblarni olish
    async getBooksByCategory(categoryId: string, limit = 10): Promise<{ books: Book[] }> {
        try {
            const response = await api.get(`/products?category=${categoryId}&limit=${limit}`);
            return response.data.data || { books: [] };
        } catch (error) {
            console.error('Error fetching books by category:', error);
            return { books: [] };
        }
    },

    // Qidirish
    async searchBooks(query: string): Promise<{ books: Book[] }> {
        try {
            const response = await api.get(`/products?search=${encodeURIComponent(query)}`);
            return response.data.data || { books: [] };
        } catch (error) {
            console.error('Error searching books:', error);
            return { books: [] };
        }
    },

    // Random kitoblar olish
    async getRandomBooks(params?: { limit?: number; minPrice?: number }): Promise<Product[]> {
        try {
            const response = await api.get('/products/random', {
                params
            });

            return Array.isArray(response.data?.data) ? response.data.data : [];
        } catch (error) {
            console.error('Random kitoblarni olishda xatolik:', error);
            return [];
        }
    },

    // eng kop korilgan kitoblar
    async getMostViewedBooks(limit = 8): Promise<Product[]> {
        try {
            const response = await api.get('/products/most-viewed', {
                params: { limit }
            });
            return Array.isArray(response.data?.data) ? response.data.data : [];
        } catch (error) {
            console.error("Eng ko'p ko'rilgan kitoblarni olishda xatolik:", error);
            return [];
        }
    }
};
