'use client';

import { type MouseEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useBookWishlist } from '@/hooks/useBookWishlist';
import { UserService } from '@/services/api';
import { addCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { type BookCardProps } from '@/types/book';
import { addGuestCart } from '@/utils/cartStorage';
import { getImageUrl } from '@/utils/image';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export type { Book } from '@/types/book';

type TextLike =
    | string
    | { uz?: unknown; ru?: unknown; en?: unknown; name?: unknown; title?: unknown }
    | null
    | undefined;

export const BookCard = ({ book, onWishlistChange, slug }: BookCardProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const queryClient = useQueryClient();
    const dispatch = useAppDispatch();
    const isBookInCart = useAppSelector((state) => state.cart.items.some((item) => item.book._id === book._id));

    const addCartMutation = useMutation({
        mutationFn: async (data: { productId: string; quantity: number }) => {
            await UserService.addToCart(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('savatga qoshildi');
        }
    });

    const { isBookmarked, favoriteLoading, toggleFavorite, user } = useBookWishlist(book, { onWishlistChange });

    const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (isBookInCart || addCartMutation.isPending) {
            toast('Bu kitob savatda bor');
            return;
        }

        const cartItem = {
            book: {
                _id: book._id,
                title: book.title,
                slug: book.slug,
                price: book.price,
                images: book.image ?? book.images?.[0] ?? '',
                stock: book.stock ?? 0
            },
            quantity: 1
        };

        if (user) {
            addCartMutation.mutate(
                { productId: book._id, quantity: 1 },
                {
                    onSuccess: () => {
                        dispatch(addCart(cartItem));
                    }
                }
            );
        } else {
            addGuestCart([cartItem]);
            dispatch(addCart(cartItem));
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success('savatga qoshildi');
        }
    };

    const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        toggleFavorite();
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

    const getBookTitle = () => {
        return getText(book.title, "Noma'lum kitob");
    };

    const getAuthorName = () => {
        if (typeof book.author === 'string') return book.author;

        return getText(book.author?.name ? { name: book.author.name } : book.author, "Noma'lum muallif");
    };

    const bookHref = `/book/${slug ?? book.slug ?? book._id}`;

    const openBookDetails = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest('a, button')) return;

        router.push(bookHref);
    };

    return (
        <motion.div
            className='group relative flex h-full min-h-[522px] cursor-pointer flex-col rounded-xl border border-gray-100 bg-white px-3 pb-3 transition-all duration-300 hover:border-[#00a0e3]/20 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800 dark:hover:border-[#ef7f1a]/30'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={openBookDetails}>
            <div className='relative mb-3 flex h-80 w-full items-center justify-center overflow-hidden rounded-2xl'>
                <button
                    type='button'
                    aria-label='Bookmark'
                    className={`absolute top-3 right-3 z-10 rounded-full p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 ${
                        isBookmarked
                            ? 'bg-[#ef7f1a] text-white dark:bg-orange-600'
                            : 'bg-white/90 text-gray-600 hover:bg-[#ef7f1a] hover:text-white dark:bg-slate-800/90 dark:text-gray-300 dark:hover:bg-orange-600'
                    }`}
                    disabled={favoriteLoading}
                    onClick={handleWishlist}>
                    <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>

                <Link
                    href={bookHref}
                    aria-label={`${getBookTitle()} haqida batafsil`}
                    className='group relative flex h-full w-full items-center justify-center'>
                    <Image
                        src={getImageUrl(book.image)}
                        alt={getBookTitle()}
                        fill
                        sizes='(max-width: 480px) 70vw, (max-width: 768px) 42vw, (max-width: 1024px) 30vw, 220px'
                        className='object-contain p-0.5 transition-transform duration-700 group-hover:scale-105'
                    />
                </Link>
            </div>

            <div className='flex grow flex-col space-y-2'>
                <Link href={bookHref} className='block'>
                    <h3 className='line-clamp-2 min-h-[48px] text-[18px] leading-snug font-bold text-gray-900 transition-colors group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                        {getBookTitle()}
                    </h3>

                    <p className='line-clamp-1 flex min-h-5 items-center gap-1 text-[14px] text-gray-500 dark:text-gray-400'>
                        {getAuthorName()}
                    </p>
                </Link>

                <div className='flex min-h-8 items-center gap-2 pt-1'>
                    <div className='inline-flex items-center gap-1 rounded-md bg-[#f3f4f6] px-2 py-1 text-[13px] font-bold text-slate-700 dark:bg-slate-700 dark:text-slate-100'>
                        <span> {Number(book?.rating || 0).toFixed(1)}</span>
                        <Star size={13} className='text-[#f59e0b]' fill='currentColor' />
                    </div>
                    <span className='text-[11px] text-gray-400 dark:text-gray-500'>
                        {book.stock ?? book.reviewsCount ?? 0} ta
                    </span>
                </div>

                <div className='mt-auto min-h-[66px] border-t border-gray-100 pt-3 dark:border-slate-700'>
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
                            type='button'
                            className='flex transform items-center gap-1 rounded-xl bg-[#ef7f1a] p-2.5 text-white shadow-md transition-all hover:shadow-lg active:scale-90'
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            // disabled={addCartMutation.isPending}
                            disabled={Boolean(!book?.stock || book.stock <= 0 || addCartMutation.isPending)}
                            onClick={handleAddToCart}>
                            <ShoppingCart size={18} />
                            <span className='hidden font-medium md:inline'>{t('booksSection.basket')}</span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
