import type { Book } from '@/types/book';
import type { Category } from '@/types/category.types';

export interface BookSectionProps {
    title: string;
    subtitle?: string;
    books?: Book[];
    type?: 'default' | 'new' | 'popular' | 'discount' | 'audio' | 'author';
    viewAllLink?: string;
}

export interface AudioBooksSectionProps {
    autoPlay?: boolean;
    title?: string;
    subtitle?: string;
    limit?: number;
    category?: string;
    hit?: boolean;
    new?: boolean;
    showCategories?: boolean;
}

export interface CategorySectionProps {
    onCategoryClick?: (category: Category) => void;
    lang?: 'uz' | 'ru' | 'en';
    limit?: number;
    showAllLink?: boolean;
}
