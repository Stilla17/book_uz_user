import type { Book } from '@/types/book';
import type { Category } from '@/types/category.types';

export interface BookSectionProps {
    title: string;
    subtitle?: string;
    books?: Book[];
    type?: 'default' | 'new' | 'popular' | 'discount' | 'audio' | 'author';
    viewAllLink?: string;
}

export interface CategorySectionProps {
    onCategoryClick?: (category: Category) => void;
    lang?: 'uz' | 'ru' | 'en';
    limit?: number;
    showAllLink?: boolean;
}
