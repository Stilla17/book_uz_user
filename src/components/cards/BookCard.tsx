// components/cards/BookCard.tsx
'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// components/cards/BookCard.tsx

export interface Book {
    _id: string;
    title: string | { uz: string; ru: string; en: string };
    author: string | { name: string };
    price: number;
    oldPrice?: number;
    rating: number;
    reviewsCount?: number;
    image?: string;
    discount?: number;
    isNew?: boolean;
    isHit?: boolean;
    isFree?: boolean;
    format?: 'ebook' | 'audio' | 'paper';
}

export const BookCard = ({ book }: { book: Book }) => {
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        setMounted(true);
    }, []);

    const getBookTitle = () => {
        if (!book.title) return "Noma'lum kitob";
        if (typeof book.title === 'string') return book.title;
        return book.title.uz || book.title.ru || book.title.en || "Noma'lum kitob";
    };

    const getAuthorName = () => {
        if (!book.author) return "Noma'lum muallif";
        if (typeof book.author === 'string') return book.author;
        return (book.author as { name?: string }).name || "Noma'lum muallif";
    };

    const fallbackImages = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1887'
    ];

    const imageSrc =
        imageError || !book.image || book.image === ''
            ? fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
            : book.image;

    return (
        <motion.div
            className='group relative flex h-full flex-col rounded-xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:border-[#00a0e3]/20 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#ef7f1a]/30'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            <div className='relative mb-3 h-[230px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-md dark:from-slate-700 dark:to-slate-600'>
                <button
                    type='button'
                    aria-label='Bookmark'
                    className={`absolute top-3 right-3 z-10 rounded-full p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                        isBookmarked
                            ? 'bg-[#ef7f1a] text-white dark:bg-orange-600'
                            : 'bg-white/90 text-gray-600 hover:bg-[#ef7f1a] hover:text-white dark:bg-slate-800/90 dark:text-gray-300 dark:hover:bg-orange-600'
                    }`}
                    onClick={() => setIsBookmarked(!isBookmarked)}>
                    <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>

                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={getBookTitle()}
                        fill
                        sizes='(max-width: 768px) 100vw, 200px'
                        className='object-cover transition-transform duration-700 group-hover:scale-110'
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className='flex h-full w-full items-center justify-center bg-gradient-to-br from-[#00a0e3]/10 to-[#ef7f1a]/10 dark:from-blue-600/10 dark:to-orange-600/10'>
                        <span className='text-4xl'>?</span>
                    </div>
                )}
            </div>

            <div className='flex flex-grow flex-col space-y-2'>
                <h3 className='line-clamp-2 text-[18px] leading-snug font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                    {getBookTitle()}
                </h3>

                <p className='line-clamp-1 flex items-center gap-1 text-[14px] text-gray-500 dark:text-gray-400'>
                    {getAuthorName()}
                </p>

                <div className='flex items-center gap-2 pt-1'>
                    <div className='inline-flex items-center gap-1 rounded-md bg-[#f3f4f6] px-2 py-1 text-[13px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-100'>
                        <span>{(book.rating || 0).toFixed(1)}</span>
                        <Star size={13} className='text-[#f59e0b]' fill='currentColor' />
                    </div>
                    <span className='text-[11px] text-gray-400 dark:text-gray-500'>
                        {book.reviewsCount || Math.floor(Math.random() * 1000) + 100} ta
                    </span>
                </div>

                <div className='mt-auto border-t border-gray-100 pt-3 dark:border-slate-700'>
                    <div className='flex items-end justify-between'>
                        <div>
                            {book.oldPrice && (
                                <span className='block text-[18px] leading-none text-gray-400 line-through dark:text-gray-500'>
                                    {book.oldPrice.toLocaleString()} so'm
                                </span>
                            )}
                            <motion.div
                                className='flex items-baseline gap-1'
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 400 }}>
                                <span className='text-[18px] font-black text-[#ef7f1a] dark:text-blue-400'>
                                    {(book.price || 0).toLocaleString()}
                                </span>
                                <span className='font-medium text-gray-500 dark:text-gray-400'>so'm</span>
                            </motion.div>
                        </div>

                        <motion.button
                            className='flex transform items-center gap-1 rounded-xl bg-[#ef7f1a] p-2.5 text-white shadow-md transition-all hover:shadow-lg active:scale-90'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <ShoppingCart size={18} />
                            <span className='hidden font-medium md:inline'>{t('booksSection.basket')}</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
