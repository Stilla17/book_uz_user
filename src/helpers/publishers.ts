import { type Book as CardBook } from '@/components/cards/BookCard';
import { Product } from '@/types';

type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;
type ProductShape = Product & {
    title?: TextLike;
    author?: string | { name?: unknown } | null;
};

const getText = (value: TextLike, fallback: string): string => {
    if (!value) return fallback;
    if (typeof value === 'string') return value || fallback;
    if (typeof value.uz === 'string') return value.uz;
    if (typeof value.ru === 'string') return value.ru;
    if (typeof value.en === 'string') return value.en;
    if (typeof value.name === 'string') return value.name;
    if (typeof value.title === 'string') return value.title;

    return fallback;
};

const getAuthorName = (author: ProductShape['author']) => {
    if (!author) return "Noma'lum muallif";
    if (typeof author === 'string') return author;

    return getText({ name: author.name }, "Noma'lum muallif");
};

export const mapProductToCardBook = (product: Product): CardBook => {
    const productShape = product as ProductShape;
    const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.price;
    const oldPrice = product.discountPrice && product.discountPrice > 0 ? product.price : undefined;
    const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : undefined;

    return {
        _id: product._id,
        slug: product.slug,
        title: getText(productShape.title, "Noma'lum kitob"),
        author: getAuthorName(productShape.author),
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
        isNew: false,
        format: product.format
    };
};
