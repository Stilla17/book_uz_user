export type LocalizedText = string | { uz?: string; ru?: string; en?: string } | null | undefined;

export type CategoryLike =
    | { name?: string; title?: LocalizedText }
    | Array<{ name?: string; title?: LocalizedText }>
    | null
    | undefined;

export const getLocalizedText = (value?: LocalizedText, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;

    return value.uz || value.ru || value.en || fallback;
};

export const getCategoryLabel = (category?: CategoryLike, fallback = '') => {
    if (!category) return fallback;

    const getOne = (item: Exclude<NonNullable<CategoryLike>, unknown[]>) =>
        item.name || getLocalizedText(item.title, '');

    return Array.isArray(category)
        ? category.map(getOne).filter(Boolean).join(', ') || fallback
        : getOne(category) || fallback;
};

export const getAuthor = (author: unknown) => {
    if (typeof author === 'string') return author;
    if (author && typeof author === 'object' && 'name' in author) {
        return String((author as { name: string }).name);
    }
    return 'Muallif noma’lum';
};
