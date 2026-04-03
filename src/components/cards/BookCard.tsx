// components/cards/BookCard.tsx
'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';
import { Eye, Heart, ShoppingCart, Star } from 'lucide-react';

// components/cards/BookCard.tsx

export interface Book {
    _id: string;
    title: string | { uz: string; ru: string; en: string }; // title object yoki string bo'lishi mumkin
    author: string | { name: string }; // author object yoki string bo'lishi mumkin
    price: number;
    oldPrice?: number;
    rating: number;
    reviewsCount?: number;
    image?: string; // optional qilish
    discount?: number;
    isNew?: boolean;
    isHit?: boolean;
    isFree?: boolean;
    format?: 'ebook' | 'audio' | 'paper';
}

export const BookCard = ({ book }: { book: Book }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Kitob nomini olish (title object bo'lsa, uz ni olish)
    const getBookTitle = () => {
        if (!book.title) return "Noma'lum kitob";
        if (typeof book.title === 'string') return book.title;
        return book.title.uz || book.title.ru || book.title.en || "Noma'lum kitob";
    };

    // Muallif ismini olish
    const getAuthorName = () => {
        if (!book.author) return "Noma'lum muallif";
        if (typeof book.author === 'string') return book.author;
        return (book.author as any).name || "Noma'lum muallif";
    };

    // Rasm URL ni olish
    const getImageSrc = () => {
        if (!book.image || book.image === '') return null;
        return book.image;
    };

    // Fallback images
    const fallbackImages = [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1887',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1887',
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1887'
    ];

    // imageError bo'lsa yoki rasm bo'lmasa, random fallback image
    const imageSrc =
        imageError || !book.image || book.image === ''
            ? fallbackImages[Math.floor(Math.random() * fallbackImages.length)]
            : book.image;

    // Format belgisi
    const getFormatIcon = () => {
        switch (book.format) {
            case 'audio':
                return '🎧';
            case 'ebook':
                return '📱';
            case 'paper':
                return '📖';
            default:
                return '📚';
        }
    };

    if (!mounted) {
        return <div className='h-100 animate-pulse rounded-xl bg-white p-3 dark:bg-slate-800' />;
    }

    return (
        <motion.div
            className='group relative flex h-full flex-col rounded-xl border border-gray-100 bg-white p-3 transition-all duration-300 hover:border-[#00a0e3]/20 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#ef7f1a]/30'
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}>
            {/* Badges */}
            {/* <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        {book.isHit && (
          <span className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase shadow-sm flex items-center gap-1">
            <span className="text-xs">🔥</span> Хит
          </span>
        )}
        {book.isNew && (
          <span className=" bg-[#ef7f1a]  text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase shadow-sm flex items-center gap-1">
            <span className="text-xs">✨</span> Yangi
          </span>
        )}
        {book.isFree && (
          <span className="bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase shadow-sm">
            Bepul
          </span>
        )}
      </div> */}

            {/* Book Cover */}
            <div className='relative mb-3  h-[230px] w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 shadow-md dark:from-slate-700 dark:to-slate-600'>
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
                        <span className='text-4xl'>📚</span>
                    </div>
                )}

                {/* Overlay on Hover */}
                <motion.div
                    className='absolute inset-0 flex items-center justify-center gap-2 bg-gradient-to-r from-[#00a0e3]/60 to-[#ef7f1a]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-600/60 dark:to-orange-600/60'
                    initial={false}
                    animate={isHovered ? { opacity: 1 } : { opacity: 0 }}>
                    <button className='transform rounded-full bg-white p-2 shadow-lg transition-all hover:scale-110 hover:bg-[#00a0e3] hover:text-white dark:bg-slate-700 dark:hover:bg-blue-600'>
                        <Eye size={18} className='text-gray-700 dark:text-gray-300' />
                    </button>
                    <button
                        className={`transform rounded-full p-2 shadow-lg transition-all hover:scale-110 ${
                            isBookmarked
                                ? 'bg-[#ef7f1a] text-white dark:bg-orange-600'
                                : 'bg-white text-gray-600 hover:bg-[#ef7f1a] hover:text-white dark:bg-slate-700 dark:text-gray-400 dark:hover:bg-orange-600'
                        }`}
                        onClick={() => setIsBookmarked(!isBookmarked)}>
                        <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                </motion.div>

                {/* Format Badge */}
                {/* <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-700/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-gray-200 dark:border-slate-600">
          <span className={book.format === "audio" ? "text-[#00a0e3] dark:text-blue-400" : "text-[#ef7f1a] dark:text-orange-400"}>
            {getFormatIcon()}
          </span>
        </div> */}

                {/* Discount Badge */}
                {/* {book.discount && (
                    <div className='absolute bottom-2 left-2'>
                        <div className='relative'>
                            <div className='-skew-x-6 transform rounded bg-gradient-to-r from-[#ef7f1a] to-[#00a0e3] px-2 py-1 text-[12px] font-black text-white shadow-md dark:from-orange-600 dark:to-blue-600'>
                                -{book.discount}%
                            </div>
                            <div className='absolute -bottom-1 left-2 h-2 w-2 rotate-45 transform bg-[#00a0e3] dark:bg-blue-600'></div>
                        </div>
                    </div>
                )} */}
            </div>

            {/* Info */}
            <div className='flex flex-grow flex-col space-y-2'>
                <h3 className='line-clamp-2 text-[18px] leading-snug font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                    {getBookTitle()}
                </h3>

                <p className='line-clamp-1 flex items-center gap-1 text-[14px] text-gray-500 dark:text-gray-400'>
                    <span className='h-1 w-1 rounded-full bg-[#ef7f1a] dark:bg-orange-400'></span>
                    {getAuthorName()}
                </p>

                {/* Rating */}
                <div className='flex items-center gap-2 pt-1'>
                    <div className='flex items-center gap-0.5'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={14}
                                className={
                                    star <= Math.round(book.rating || 0)
                                        ? 'text-[#ef7f1a] dark:text-orange-400'
                                        : 'text-gray-300 dark:text-gray-600'
                                }
                                fill={star <= Math.round(book.rating || 0) ? 'currentColor' : 'none'}
                            />
                        ))}
                    </div>
                    <span className='text-[13px] font-bold text-[#ef7f1a] dark:text-blue-400'>{book.rating || 0}</span>
                    <span className='text-[11px] text-gray-400 dark:text-gray-500'>
                        ({book.reviewsCount || Math.floor(Math.random() * 1000) + 100})
                    </span>
                </div>

                {/* Price Section */}
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
                                <span className=' font-medium text-gray-500 dark:text-gray-400'>so'm</span>
                            </motion.div>
                        </div>

                        <motion.button
                            className='flex transform items-center gap-1 rounded-xl bg-[#ef7f1a] p-2.5 text-white shadow-md transition-all  hover:shadow-lg active:scale-90'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}>
                            <ShoppingCart size={18} />
                            <span className='hidden  font-medium md:inline'>Savatga</span>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Quick add tooltip */}
            {/* <motion.div 
        className="absolute -top-2 right-12 bg-gradient-to-r from-[#00a0e3] to-[#ef7f1a] dark:from-blue-600 dark:to-orange-600 text-white text-xs py-1 px-2 rounded-md opacity-0 pointer-events-none"
        animate={{ 
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 5
        }}
      >
        Tez sotib olish
        <div className="absolute -bottom-1 right-4 w-2 h-2 bg-[#ef7f1a] dark:bg-orange-600 transform rotate-45"></div>
      </motion.div> */}
        </motion.div>
    );
};
