import { api } from './api';
import { AudioBook } from '@/types/audioBook.types';

export const audioBookService = {
  // Get active audio books
  async getActiveAudioBooks(limit = 10, category?: string, hit?: boolean, isNew?: boolean): Promise<AudioBook[]> {
    try {
      let url = `/audio-books?limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (hit) url += `&hit=true`;
      if (isNew) url += `&new=true`;
      
      const response = await api.get(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching audio books:', error);
      return [];
    }
  },

  // Get audio book by ID
  async getAudioBookById(id: string): Promise<AudioBook | null> {
    try {
      const response = await api.get(`/audio-books/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching audio book:', error);
      return null;
    }
  },

  // Get audio book by slug
  async getAudioBookBySlug(slug: string): Promise<AudioBook | null> {
    try {
      const response = await api.get(`/audio-books/slug/${slug}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching audio book:', error);
      return null;
    }
  },

  // Increment download count
  async incrementDownload(id: string): Promise<number> {
    try {
      const response = await api.post(`/audio-books/${id}/download`);
      return response.data.data?.downloads || 0;
    } catch (error) {
      console.error('Error incrementing download:', error);
      return 0;
    }
  },

  // Get hit audio books
  async getHitAudioBooks(limit = 10): Promise<AudioBook[]> {
    return this.getActiveAudioBooks(limit, undefined, true);
  },

  // Get new audio books
  async getNewAudioBooks(limit = 10): Promise<AudioBook[]> {
    return this.getActiveAudioBooks(limit, undefined, undefined, true);
  },

  // Get audio books by category
  async getAudioBooksByCategory(category: string, limit = 10): Promise<AudioBook[]> {
    return this.getActiveAudioBooks(limit, category);
  }
};