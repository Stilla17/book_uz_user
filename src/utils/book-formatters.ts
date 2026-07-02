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

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

const getAuthorText = (author: unknown, fallback = "Noma'lum muallif"): string => {
    if (!author) return fallback;

    if (typeof author === 'string') {
        return isObjectId(author) ? fallback : author;
    }

    if (Array.isArray(author)) {
        return (
            author
                .map((item) => getAuthorText(item, ''))
                .filter(Boolean)
                .join(', ') || fallback
        );
    }

    if (typeof author === 'object') {
        const value = author as { name?: LocalizedText; title?: LocalizedText };
        return getLocalizedText(value.name, '') || getLocalizedText(value.title, '') || fallback;
    }

    return fallback;
};

const getBookTitleValue = (title: Book['title']): Book['title'] => ({
    uz: title.uz || title.ru || title.en || "Noma'lum kitob",
    ru: title.ru || title.uz || title.en || "Noma'lum kitob",
    en: title.en || title.uz || title.ru || "Noma'lum kitob"
});

export const getBookAuthorName = (book: Book) => {
    const authorName = getAuthorText(book.authorName, '');
    if (authorName) return authorName;

    return getAuthorText(book.author);
};

export const getProductAuthorName = (author: Product['author']) => {
    return getAuthorText(author);
};

export const getProductPriceInfo = (product: Product) => {
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const oldPrice = product.discountPrice && product.discountPrice > 0 ? product.price : undefined;
    const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

    return { price, oldPrice, discount };
};

export const getBookPriceInfo = (book?: Pick<Book, 'price' | 'oldPrice' | 'discountPrice' | 'discount'> | null) => {
    const basePrice = Number(book?.price ?? 0);
    const discountPrice = Number(book?.discountPrice);
    const oldPriceValue = Number(book?.oldPrice);
    const hasDiscountPrice = Number.isFinite(discountPrice) && discountPrice > 0 && discountPrice < basePrice;
    const hasOldPrice = Number.isFinite(oldPriceValue) && oldPriceValue > basePrice;
    const price = hasDiscountPrice ? discountPrice : basePrice;
    const oldPrice = hasDiscountPrice ? basePrice : hasOldPrice ? oldPriceValue : undefined;
    const discount =
        oldPrice && oldPrice > price ? book?.discount || Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

    return { price, oldPrice, discount, hasDiscount: Boolean(oldPrice && oldPrice > price) };
};

export const mapProductToBook = (product: Product, type?: string): Book => {
    const { price, oldPrice, discount } = getProductPriceInfo(product);

    return {
        _id: product._id,
        slug: product.slug,
        title: getBookTitleValue(product.title),
        author: getAuthorText(product.authorName, '') || getAuthorText(product.author),
        authorName: product.authorName,
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
