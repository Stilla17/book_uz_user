import type { Book, Product } from '@/types/book';
import { isUzbekCyrillicLanguage, transliterateUzbekToCyrillic } from '@/utils/uzbek-cyrillic';

export type LocalizedText = string | { uz?: string; ru?: string; en?: string } | null | undefined;
type DataLanguage = 'uz' | 'ru' | 'en';
type Language = DataLanguage | 'uz-Cyrl';

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

const LANGUAGE_STORAGE_KEY = 'bookuz-language';

const fallbackText = {
    unknown: {
        uz: "Noma'lum",
        ru: 'Неизвестно',
        en: 'Unknown'
    },
    bookTitle: {
        uz: "Noma'lum kitob",
        ru: 'Неизвестная книга',
        en: 'Unknown book'
    },
    author: {
        uz: "Noma'lum muallif",
        ru: 'Неизвестный автор',
        en: 'Unknown author'
    }
} satisfies Record<string, Record<DataLanguage, string>>;

const fallbackTranslations: Record<string, Record<DataLanguage, string>> = {
    "Noma'lum": fallbackText.unknown,
    "Noma'lum kitob": fallbackText.bookTitle,
    'Muallif nomalum': fallbackText.author,
    "Noma'lum muallif": fallbackText.author
};

const isLanguage = (value?: string | null): value is Language =>
    value === 'uz' || value === 'uz-Cyrl' || value === 'ru' || value === 'en';

const getCurrentLanguage = (): Language => {
    if (typeof window === 'undefined') return 'uz';

    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLanguage(savedLanguage)) return savedLanguage;

    const documentLanguage = window.document.documentElement.lang;

    return isLanguage(documentLanguage) ? documentLanguage : 'uz';
};

const toCurrentScript = (value: string, language = getCurrentLanguage()) =>
    isUzbekCyrillicLanguage(language) ? transliterateUzbekToCyrillic(value) : value;

const getDataLanguage = (language: Language): DataLanguage => (language === 'uz-Cyrl' ? 'uz' : language);

const getFallbackText = (fallback = '') => {
    const language = getCurrentLanguage();
    const dataLanguage = getDataLanguage(language);
    const translatedFallback = fallbackTranslations[fallback]?.[dataLanguage] ?? fallback;

    return toCurrentScript(translatedFallback, language);
};

const isUnknownFallback = (value: string) => Boolean(fallbackTranslations[value]);

export const getLocalizedText = (value?: LocalizedText, fallback = '') => {
    const translatedFallback = getFallbackText(fallback);

    if (!value) return translatedFallback;
    if (typeof value === 'string')
        return isUnknownFallback(value) ? getFallbackText(value) : toCurrentScript(value || translatedFallback);

    const language = getCurrentLanguage();
    const dataLanguage = getDataLanguage(language);
    const localizedValue = value[dataLanguage] || value.uz || value.ru || value.en || translatedFallback;

    return toCurrentScript(localizedValue, language);
};

export const getText = (value: TextLike, fallback: string): string => {
    const translatedFallback = getFallbackText(fallback);

    if (!value) return translatedFallback;
    if (typeof value === 'string')
        return isUnknownFallback(value) ? getFallbackText(value) : toCurrentScript(value || translatedFallback);

    const language = getCurrentLanguage();
    const dataLanguage = getDataLanguage(language);
    const localizedValue = value[dataLanguage];

    if (typeof localizedValue === 'string' && localizedValue) return toCurrentScript(localizedValue, language);
    if (typeof value.uz === 'string' && value.uz) return toCurrentScript(value.uz, language);
    if (typeof value.ru === 'string' && value.ru) return value.ru;
    if (typeof value.en === 'string' && value.en) return value.en;
    if (typeof value.name === 'string' && value.name) {
        return isUnknownFallback(value.name) ? getFallbackText(value.name) : toCurrentScript(value.name, language);
    }
    if (typeof value.title === 'string' && value.title) {
        return isUnknownFallback(value.title) ? getFallbackText(value.title) : toCurrentScript(value.title, language);
    }

    return translatedFallback;
};

export const getCategoryLabel = (category?: CategoryLike, fallback = '') => {
    const translatedFallback = getFallbackText(fallback);

    if (!category) return translatedFallback;

    const getOne = (item: Exclude<NonNullable<CategoryLike>, unknown[]>) =>
        getLocalizedText(item.name, '') || getLocalizedText(item.title, '');

    return Array.isArray(category)
        ? category.map(getOne).filter(Boolean).join(', ') || translatedFallback
        : getOne(category) || translatedFallback;
};

export const getAuthor = (author: unknown): string => {
    if (typeof author === 'string') return toCurrentScript(author);
    if (Array.isArray(author)) {
        return author
            .map((item) => getAuthor(item))
            .filter(Boolean)
            .join(', ');
    }
    if (author && typeof author === 'object' && 'name' in author) {
        return getLocalizedText((author as { name?: LocalizedText }).name, fallbackText.author.uz);
    }
    return getFallbackText(fallbackText.author.uz);
};

export const getBookTitle = (book: Book) => getText(book.title, fallbackText.bookTitle.uz);

const isObjectId = (value: string) => /^[a-f\d]{24}$/i.test(value);

const getAuthorText = (author: unknown, fallback = fallbackText.author.uz): string => {
    const translatedFallback = getFallbackText(fallback);

    if (!author) return translatedFallback;

    if (typeof author === 'string') {
        if (isObjectId(author)) return translatedFallback;

        return isUnknownFallback(author) ? translatedFallback : toCurrentScript(author);
    }

    if (Array.isArray(author)) {
        return (
            author
                .map((item) => getAuthorText(item, ''))
                .filter(Boolean)
                .join(', ') || translatedFallback
        );
    }

    if (typeof author === 'object') {
        const value = author as { name?: LocalizedText; title?: LocalizedText };
        return getLocalizedText(value.name, '') || getLocalizedText(value.title, '') || translatedFallback;
    }

    return translatedFallback;
};

const getBookTitleValue = (title: Book['title']): Book['title'] => ({
    uz: title.uz || title.ru || title.en || fallbackText.bookTitle.uz,
    ru: title.ru || title.uz || title.en || fallbackText.bookTitle.ru,
    en: title.en || title.uz || title.ru || fallbackText.bookTitle.en
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
        image: product.image,
        images: product.images,
        discount,
        isHit: product.isTop,
        isNew: type === 'new',
        format: product.format,
        soldQuantity: product.soldQuantity
    };
};

export const mapProductToCardBook = (product: Product): Book => mapProductToBook(product, 'default');
