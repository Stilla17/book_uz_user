import { api } from './api';
import { Category, SubCategory, CategoryFormData, SubCategoryFormData } from '@/types/category.types';

export const categoryService = {
  // Get all categories (public)
  async getAllCategoriesPublic(): Promise<Category[]> {
    try {
      const response = await api.get('/categories?all=true');
      console.log('Public categories response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get category by slug (public)
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await api.get(`/categories/${slug}`);
      return response.data.data || null;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  },

  // Get category products (public)
  async getCategoryProducts(slug: string, params?: any): Promise<any> {
    try {
      const response = await api.get(`/categories/${slug}/products`, { params });
      return response.data.data || { products: [], pagination: { total: 0, pages: 1 } };
    } catch (error) {
      console.error('Error fetching category products:', error);
      return { products: [], pagination: { total: 0, pages: 1 } };
    }
  },

  // Admin: Get all categories
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await api.get('/admin/categories');
      console.log('Admin categories response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Admin: Create category
  async createCategory(formData: FormData): Promise<Category> {
    try {
      const response = await api.post('/admin/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Admin: Update category
  async updateCategory(id: string, formData: FormData): Promise<Category> {
    try {
      const response = await api.patch(`/admin/categories/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Admin: Delete category
  async deleteCategory(id: string): Promise<void> {
    try {
      await api.delete(`/admin/categories/${id}`);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Admin: Add subcategory
  async addSubCategory(data: SubCategoryFormData): Promise<Category> {
    try {
      const response = await api.post('/admin/categories/sub', data);
      return response.data.data;
    } catch (error) {
      console.error('Error adding subcategory:', error);
      throw error;
    }
  },

  // Admin: Delete subcategory
  async deleteSubCategory(categoryId: string, subId: string): Promise<void> {
    try {
      await api.delete(`/admin/categories/${categoryId}/sub/${subId}`);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      throw error;
    }
  },

  // Admin: Toggle status
  async toggleCategoryStatus(id: string): Promise<Category> {
    try {
      const response = await api.patch(`/admin/categories/${id}/toggle-status`);
      return response.data.data;
    } catch (error) {
      console.error('Error toggling status:', error);
      throw error;
    }
  },

  // Admin: Toggle featured
  async toggleCategoryFeatured(id: string): Promise<Category> {
    try {
      const response = await api.patch(`/admin/categories/${id}/toggle-featured`);
      return response.data.data;
    } catch (error) {
      console.error('Error toggling featured:', error);
      throw error;
    }
  },
};