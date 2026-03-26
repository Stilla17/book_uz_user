// services/book.service.ts
import { api } from './api';
import { Book } from '@/types';

export const bookService = {
  // Barcha kitoblarni olish
  async getAllBooks(params?: any): Promise<{ books: Book[]; total: number }> {
    try {
      const response = await api.get('/products', { params });
      return response.data.data || { books: [], total: 0 };
    } catch (error) {
      console.error('Error fetching books:', error);
      return { books: [], total: 0 };
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

  // Bitta kitobni olish
  async getBookById(id: string): Promise<Book | null> {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
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
  }
};