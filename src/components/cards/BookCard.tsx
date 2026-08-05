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
import { getBookAuthorName, getBookPriceInfo, getBookTitle } from '@/utils/book-formatters';
import { addGuestCart, saveCartPriceOverride } from '@/utils/cartStorage';
import { formatPriceNumber } from '@/utils/currency';
import { getBookImageUrl } from '@/utils/image';
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
    const priceInfo = getBookPriceInfo(book);
    const bookImageUrl = getBookImageUrl(book);

    const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();

        if (isBookInCart || addCartMutation.isPending) {
            toast(t('bookCard.alreadyInCart'));
            return;
        }

        const cartItem = {
            book: {
                _id: book._id,
                title: book.title,
                slug: book.slug,
                price: priceInfo.price,
                oldPrice: priceInfo.oldPrice,
                discountPrice: priceInfo.price,
                discount: priceInfo.discount,
                images: bookImageUrl ?? '',
                stock: book.stock ?? 0,
                publisher: book.publisher,
                publisherId: book.publisherId,
                publisherName: book.publisherName,
                details: book.details
            },
            quantity: 1
        };

        if (user) {
            addCartMutation.mutate(
                { productId: book._id, quantity: 1, priceAtTime: priceInfo.price },
                {
                    onSuccess: () => {
                        saveCartPriceOverride(book._id, priceInfo.price);
                        dispatch(addCart(cartItem));
                    }
                }
            );
        } else {
            saveCartPriceOverride(book._id, priceInfo.price);
            addGuestCart([cartItem]);
            dispatch(addCart(cartItem));
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success(t('bookCard.addedToCart'));
        }
    };

    const handleWishlist = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        toggleFavorite();
    };

    const bookHref = `/book/${slug || book.slug || book._id}`;
    const prefetchBook = () => {
        const bookSlug = slug || book.slug || book._id;

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
            className='group relative mt-18 flex min-h-[350px] cursor-pointer flex-col rounded-[15px] border border-slate-200/80 bg-white px-3 pt-36 pb-3 sm:mt-24 sm:min-h-100 sm:px-4 sm:pt-44 sm:pb-4 dark:border-slate-700 dark:bg-slate-800'
            onMouseEnter={prefetchBook}
            onTouchStart={prefetchBook}
            onClick={openBookDetails}>
            <div className='absolute -top-16 left-1/2 h-52 w-[72%] -translate-x-1/2 sm:-top-20 sm:h-64 sm:w-[70%]'>
                <Link
                    href={bookHref}
                    onMouseEnter={prefetchBook}
                    onFocus={prefetchBook}
                    aria-label={t('bookCard.detailsLabel', { title: getBookTitle(book) })}
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
                            <span className='text-xs font-semibold'>{t('bookCard.noImage')}</span>
                        </div>
                    )}
                    {priceInfo.discount ? (
                        <span className='absolute top-2 left-2 z-10 rounded-full bg-red-600 px-2.5 py-1 text-sm font-black text-white shadow-sm ring-1 ring-white/70'>
                            -{priceInfo.discount}%
                        </span>
                    ) : null}
                </Link>
            </div>

            <div className='flex grow flex-col'>
                <div className='flex items-start justify-between gap-3'>
                    <Link
                        href={bookHref}
                        onMouseEnter={prefetchBook}
                        onFocus={prefetchBook}
                        className='block min-w-0 flex-1'>
                        <h3 className='mt-3 mb-2 line-clamp-2 min-h-11 text-base leading-snug font-bold tracking-tight text-gray-900 group-hover:text-[#00a0e3] sm:mt-4 sm:min-h-14 sm:text-[18px] dark:text-white dark:group-hover:text-blue-400'>
                            {getBookTitle(book)}
                        </h3>

                        <p className='mb-2 line-clamp-1 flex min-h-5 items-center gap-1 text-xs text-gray-500 sm:text-[14px] dark:text-gray-400'>
                            {getBookAuthorName(book)}
                        </p>
                    </Link>
                    <button
                        type='button'
                        aria-label={t('bookCard.bookmark')}
                        className={`mt-5 shrink-0 ${
                            isBookmarked
                                ? 'text-[#ef7f1a] dark:text-orange-400'
                                : 'text-gray-600 hover:text-[#ef7f1a] dark:text-gray-300 dark:hover:text-orange-400'
                        }`}
                        disabled={favoriteLoading}
                        onClick={handleWishlist}>
                        <Heart size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                </div>

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

                <div className='mt-auto border-t border-dashed border-gray-200 pt-4 dark:border-slate-700'>
                    <div className='flex items-end justify-between'>
                        <div>
                            {priceInfo.hasDiscount ? (
                                <div className='mb-1 flex items-center gap-2'>
                                    <span className='text-sm font-bold text-gray-400 line-through dark:text-gray-500'>
                                        {formatPriceNumber(priceInfo.oldPrice)} {t('bookCard.currency')}
                                    </span>
                                    {priceInfo.discount ? (
                                        <span className='rounded-full bg-orange-50 px-2 py-0.5 text-xs font-black text-[#ef7f1a] dark:bg-orange-500/10 dark:text-orange-300'>
                                            -{priceInfo.discount}%
                                        </span>
                                    ) : null}
                                </div>
                            ) : null}
                            <div className='flex items-baseline gap-1'>
                                <span className='text-base font-black text-[#ef7f1a] sm:text-[18px] dark:text-blue-400'>
                                    {formatPriceNumber(priceInfo.price)}
                                </span>
                                <span className='font-medium text-gray-500 dark:text-gray-400'>
                                    {t('bookCard.currency')}
                                </span>
                            </div>
                        </div>

                        <button
                            type='button'
                            aria-label={t('bookCard.addToCart')}
                            className='flex items-center gap-1 rounded-full bg-[#ef7f1a] p-2.5 text-white shadow-[0_10px_22px_-10px_rgba(239,127,26,0.9)] hover:bg-[#df7012] hover:shadow-lg'
                            disabled={Boolean(!book?.stock || book.stock <= 0 || addCartMutation.isPending)}
                            onClick={handleAddToCart}>
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
