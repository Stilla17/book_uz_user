'use client';

import { type MouseEvent } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useAddCartMutation } from '@/hooks/bookCardHooks/useCardQuery';
import { useBookStats } from '@/hooks/bookHooks/useBookStats';
import { useBookWishlist } from '@/hooks/bookHooks/useBookWishlist';
import { bookService } from '@/services/book.service';
import { addCart } from '@/store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { type BookCardProps } from '@/types/book';
import { getBookAuthorName, getBookTitle } from '@/utils/book-formatters';
import { addGuestCart } from '@/utils/cartStorage';
import { formatPriceNumber } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';
import { useQueryClient } from '@tanstack/react-query';

import { BookOpen, Eye, Heart, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export type { Book } from '@/types/book';

export const BookCard = ({ book, onWishlistChange, slug }: BookCardProps) => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const addCartMutation = useAddCartMutation();
    const isBookInCart = useAppSelector((state) => state.cart.items.some((item) => item.book._id === book._id));
    const { viewsCount, ratingAvg } = useBookStats({
        bookId: book._id,
        initialViewsCount: book.viewsCount ?? book.views,
        initialRatingAvg: book.ratingAvg,
        initialRatingCount: book.ratingCount
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

    const bookHref = `/book/${slug ?? book.slug ?? book._id}`;
    const bookImageUrl = getImageUrl(book.image ?? book.images);
    const prefetchBook = () => {
        const bookSlug = slug ?? book.slug ?? book._id;

        queryClient.prefetchQuery({
            queryKey: ['book', bookSlug],
            queryFn: () => bookService.getBookById(bookSlug),
            staleTime: 5 * 60 * 1000
        });
    };

    const openBookDetails = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest('a, button')) return;

        router.push(bookHref);
    };

    return (
        <div
            className='group relative mt-24 flex min-h-100 cursor-pointer flex-col rounded-[15px] border border-slate-200/80 bg-white px-4 pt-44 pb-4 dark:border-slate-700 dark:bg-slate-800'
            onClick={openBookDetails}>
            <button
                type='button'
                aria-label='Bookmark'
                className={`absolute top-0 right-0 z-30 rounded-full border border-white/70 p-2.5 shadow-lg backdrop-blur-md ${
                    isBookmarked
                        ? 'bg-[#ef7f1a] text-white dark:bg-orange-600'
                        : 'bg-white/90 text-gray-600 hover:bg-[#ef7f1a] hover:text-white dark:border-slate-700 dark:bg-slate-800/90 dark:text-gray-300 dark:hover:bg-orange-600'
                }`}
                disabled={favoriteLoading}
                onClick={handleWishlist}>
                <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <div className='absolute -top-20 left-1/2 h-64 w-[70%] -translate-x-1/2'>
                <Link
                    href={bookHref}
                    onMouseEnter={prefetchBook}
                    onFocus={prefetchBook}
                    aria-label={`${getBookTitle(book)} haqida batafsil`}
                    className='relative flex h-full w-full items-center justify-center overflow-hidden rounded-[12px] dark:border-slate-700 dark:bg-slate-900'>
                    {bookImageUrl ? (
                        <Image
                            src={bookImageUrl}
                            alt={getBookTitle(book)}
                            fill
                            sizes='(max-width: 470px) 70vw, (max-width: 768px) 42vw, (max-width: 1024px) 30vw, 220px'
                            className='object-contain'
                        />
                    ) : (
                        <div className='flex size-full flex-col items-center justify-center gap-3 bg-slate-50 text-slate-400 dark:bg-slate-900 dark:text-slate-500'>
                            <BookOpen size={48} strokeWidth={1.5} />
                            <span className='text-xs font-semibold'>Rasm mavjud emas</span>
                        </div>
                    )}
                </Link>
            </div>

            <div className='flex grow flex-col'>
                <Link href={bookHref} onMouseEnter={prefetchBook} onFocus={prefetchBook} className='block'>
                    <h3 className='mt-4 mb-2 line-clamp-2 text-[18px] leading-snug font-bold tracking-tight text-gray-900 group-hover:text-[#00a0e3] dark:text-white dark:group-hover:text-blue-400'>
                        {getBookTitle(book)}
                    </h3>

                    <p className='mb-2 line-clamp-1 flex items-center gap-1 text-[14px] text-gray-500 dark:text-gray-400'>
                        {getBookAuthorName(book)}
                    </p>
                </Link>

                <div className='flex items-center gap-2'>
                    <div className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[13px] font-bold text-slate-700 dark:bg-amber-500/10 dark:text-slate-100'>
                        <span> {Number(ratingAvg || 0).toFixed(1)}</span>
                        <Star size={13} className='text-[#f59e0b]' fill='currentColor' />
                    </div>
                    <span className='flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-gray-500 dark:bg-slate-700 dark:text-gray-400'>
                        <Eye size={13} />
                        {viewsCount}
                    </span>
                </div>

                <div className='mt-2 border-t border-dashed border-gray-200 pt-2 dark:border-slate-700'>
                    <div className='flex items-end justify-between'>
                        <div>
                            <div className='flex items-baseline gap-1'>
                                <span className='text-[18px] font-black text-[#ef7f1a] dark:text-blue-400'>
                                    {formatPriceNumber(book.price)}
                                </span>
                                <span className='font-medium text-gray-500 dark:text-gray-400'>so'm</span>
                            </div>
                        </div>

                        <button
                            type='button'
                            className='flex items-center gap-1 rounded-full bg-[#ef7f1a] p-2.5 text-white shadow-[0_10px_22px_-10px_rgba(239,127,26,0.9)] hover:bg-[#df7012] hover:shadow-lg'
                            disabled={Boolean(!book?.stock || book.stock <= 0 || addCartMutation.isPending)}
                            onClick={handleAddToCart}>
                            <ShoppingCart size={18} />
                            <span className='hidden font-medium md:inline'>{t('booksSection.basket')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
