import type { Book, Product } from '@/types/book';

export type LocalizedText = string | { uz?: string; ru?: string; en?: string } | null | undefined;

export type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;

export type CategoryLike =
    | { name?: LocalizedText; title?: LocalizedText }
    | Array<{ name?: LocalizedText; title?: LocalizedText }>
    | null
    | undefined;

export const getLocalizedText = (value?: LocalizedText, fallback = '') => {
    if (!value) return fallback;
    if (typeof value === 'string') return value;

    return value.uz || value.ru || value.en || fallback;
};

export const getText = (value: TextLike, fallback: string): string => {
    if (!value) return fallback;
    if (typeof value === 'string') return value || fallback;
    if (typeof value.uz === 'string') return value.uz;
    if (typeof value.ru === 'string') return value.ru;
    if (typeof value.en === 'string') return value.en;
    if (typeof value.name === 'string') return value.name;
    if (typeof value.title === 'string') return value.title;

    return fallback;
};

export const getCategoryLabel = (category?: CategoryLike, fallback = '') => {
    if (!category) return fallback;

    const getOne = (item: Exclude<NonNullable<CategoryLike>, unknown[]>) =>
        getLocalizedText(item.name, '') || getLocalizedText(item.title, '');

    return Array.isArray(category)
        ? category.map(getOne).filter(Boolean).join(', ') || fallback
        : getOne(category) || fallback;
};

export const getAuthor = (author: unknown) => {
    if (typeof author === 'string') return author;
    if (author && typeof author === 'object' && 'name' in author) {
        return getLocalizedText((author as { name?: LocalizedText }).name, 'Muallif nomalum');
    }
    return 'Muallif nomalum';
};

export const getBookTitle = (book: Book) => getText(book.title, "Noma'lum kitob");

export const getBookAuthorName = (book: Book) => {
    if (typeof book.author === 'string') return book.author;

    return getText(book.author?.name ? { name: book.author.name } : book.author, "Noma'lum muallif");
};

export const getProductAuthorName = (author: Product['author']) => {
    if (!author) return "Noma'lum muallif";
    if (typeof author === 'string') return author;

    return getText({ name: author.name }, "Noma'lum muallif");
};

export const getProductPriceInfo = (product: Product) => {
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const oldPrice = product.discountPrice && product.discountPrice > 0 ? product.price : undefined;
    const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

    return { price, oldPrice, discount };
};

export const mapProductToBook = (product: Product, type?: string): Book => {
    const { price, oldPrice, discount } = getProductPriceInfo(product);

    return {
        _id: product._id,
        slug: product.slug,
        title: getText(product.title, "Noma'lum kitob"),
        author: getProductAuthorName(product.author),
        price,
        oldPrice,
        rating: product.ratingAvg || 0,
        ratingAvg: product.ratingAvg || 0,
        ratingCount: product.ratingCount || 0,
        reviewsCount: product.ratingCount || 0,
        views: product.views,
        viewsCount: product.viewsCount,
        stock: product.stock || 0,
        image: product.images?.[0],
        discount,
        isHit: product.isTop,
        isNew: type === 'new',
        format: product.format,
        soldQuantity: product.soldQuantity
    };
};

export const mapProductToCardBook = (product: Product): Book => mapProductToBook(product, 'default');
