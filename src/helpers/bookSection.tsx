import { Book, Product } from '@/types';

import { Award, BookOpen, Flame, Sparkles, TrendingUp } from 'lucide-react';

export type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;
export type ProductShape = Product & {
    title?: TextLike;
    author?: string | { name?: unknown };
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

const getAuthorName = (author: ProductShape['author']) => {
    if (!author) return "Noma'lum muallif";
    if (typeof author === 'string') return author;

    return getText({ name: author.name }, "Noma'lum muallif");
};

export const mapProductToBook = (product: Product, type?: string): Book => {
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
        stock: product.stock,
        image: product.images?.[0],
        discount,
        isHit: product.isTop,
        isNew: type === 'new',
        format: product.format
    };
};

export const getRequestParams = (type: string) => ({
    limit: 8,
    ...(type === 'popular' && { isTop: true }),
    ...(type === 'discount' && { isDiscount: true }),
});

export const getSectionConfig = (type: string) => {
    switch (type) {
        case 'new':
            return {
                icon: <Sparkles size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        case 'popular':
            return {
                icon: <TrendingUp size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        case 'discount':
            return {
                icon: <Flame size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        case 'author':
            return {
                icon: <Award size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
        default:
            return {
                icon: <BookOpen size={24} className='text-[#ef7f1a] dark:text-orange-400' />,
                color: 'text-[#ef7f1a] dark:text-orange-400',
                bgColor: 'bg-[#ef7f1a]/10 dark:bg-orange-500/20',
                borderColor: 'border-[#ef7f1a]/20 dark:border-orange-500/30'
            };
    }
};
