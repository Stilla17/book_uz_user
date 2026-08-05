import { Book, Category, SubCategory } from "@/types";

export type BookContentLanguage = 'latin' | 'cyrillic';

export const getBookContentLanguage = (book: Book): BookContentLanguage => {
    const maybeBook = book as Book & {
        content_language?: unknown;
        writing?: unknown;
        script?: unknown;
        details?: Book['details'] & { contentLanguage?: unknown; content_language?: unknown };
    };
    const rawValue =
        maybeBook.contentLanguage ??
        maybeBook.content_language ??
        maybeBook.writing ??
        maybeBook.script ??
        maybeBook.details?.contentLanguage ??
        maybeBook.details?.content_language;
    const normalizedValue = typeof rawValue === 'string' ? rawValue.trim().toLowerCase() : '';

    if (['cyrillic', 'kiril', 'kirill', 'kr', 'cyrl'].includes(normalizedValue)) return 'cyrillic';
    if (['latin', 'lotin', 'uz', 'latn'].includes(normalizedValue)) return 'latin';

    const title = typeof book.title === 'string' ? book.title : book.title?.uz || '';
    return /[А-Яа-яЁёЎўҚқҒғҲҳ]/.test(title) ? 'cyrillic' : 'latin';
};

export const getRelationId = (value: unknown) => {
    if (typeof value === 'string') return value;
    if (value && typeof value === 'object' && '_id' in value) {
        return String((value as { _id?: string })._id || '');
    }

    return '';
};

export const getBookSubCategoryIds = (book: Book) => {
    const maybeBook = book as Book & {
        subCategoryIds?: Array<string | { _id?: string }>;
        subCategoryId?: string | { _id?: string };
        subCategory?: string | { _id?: string };
        subgenre?: string | { _id?: string };
    };

    const ids = (maybeBook.subCategoryIds ?? []).map(getRelationId).filter(Boolean);
    const fallback =
        getRelationId(maybeBook.subCategoryId) ||
        getRelationId(maybeBook.subCategory) ||
        getRelationId(maybeBook.subgenre);

    return Array.from(new Set(ids.length ? ids : fallback ? [fallback] : []));
};

export const getBookCategoryIds = (book: Book) => {
    const maybeBook = book as Book & {
        categories?: Array<string | { _id?: string }>;
        category?: Array<{ _id?: string }> | string | { _id?: string };
    };

    const categoryValues = maybeBook.categories?.length ? maybeBook.categories : maybeBook.category;
    if (Array.isArray(categoryValues)) {
        return Array.from(new Set(categoryValues.map(getRelationId).filter(Boolean)));
    }

    const fallback = getRelationId(categoryValues);

    return fallback ? [fallback] : [];
};

export const getTextValue = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return String(value);

    return '';
};

export const getCategorySubCategories = (category: Category | undefined) => {
    const categoryShape = category as
        | (Category & {
              subcategories?: SubCategory[];
          })
        | undefined;

    return [
        ...(categoryShape?.subCategories ?? []),
        ...(categoryShape?.subgenres ?? []),
        ...(categoryShape?.subcategories ?? [])
    ];
};

export const getSubCategoryValue = (subCategory: SubCategory) => subCategory._id || subCategory.slug || '';

export const getBookBarcode = (book: Book) => {
    const maybeBook = book as Book & {
        code?: string | number;
        sku?: string | number;
        article?: string | number;
    };

    return (
        getTextValue(maybeBook.barcode) ||
        getTextValue(maybeBook.isbn) ||
        getTextValue(maybeBook.details?.isbn) ||
        getTextValue(maybeBook.code) ||
        getTextValue(maybeBook.sku) ||
        getTextValue(maybeBook.article)
    );
};

// -----------------------------------------------
export const getBookBarcodes = (book: {
    barcode?: string | number;
    isbn?: string | number;
    details?: { isbn?: string | number };
}) => book.barcode || book.isbn || book.details?.isbn || '';

export const getStockStatus = (stock?: number) => {
    if (!stock || stock <= 0) {
        return {
            label: 'Tugagan',
            className: 'bg-red-50 text-red-600 ring-red-100 dark:bg-red-500/10 dark:text-red-300 dark:ring-red-500/20'
        };
    }

    if (stock < 10) {
        return {
            label: 'Kam qolgan',
            className:
                'bg-amber-50 text-amber-700 ring-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20'
        };
    }

    return {
        label: 'Mavjud',
        className:
            'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
    };
};

export type StockFilter = 'all' | 'low' | 'available' | 'out';
