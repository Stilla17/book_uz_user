'use client';

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { UserService, api } from '@/services/api';
import { addCart } from '@/store/features/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { addGuestCart } from '@/utils/cartStorage';
import { getImageUrl } from '@/utils/image';
import { getWishlistFromLocalStorage, removeGuestWishlist } from '@/utils/wishlistStorage';

import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertCircle,
    Award,
    BookOpen,
    ChevronRight,
    Cloud,
    Coffee,
    Compass,
    Crown,
    Diamond,
    Flower2,
    Gem,
    Headphones,
    Heart,
    Loader2,
    Moon,
    Package,
    Search,
    Shield,
    ShoppingCart,
    Sparkles,
    Star,
    Sun,
    Trash2,
    Truck,
    X,
    Zap
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface WishlistBook {
    _id: string;
    title:
        | string
        | {
              uz: string;
              ru?: string;
              en?: string;
          };
    author?:
        | string
        | {
              name: string;
              _id?: string;
          };
    price: number;
    oldPrice?: number;
    ratingAvg?: number;
    ratingCount?: number;
    images?: string[];
    discount?: number;
    format?: 'ebook' | 'audio' | 'paper';
    inStock?: boolean;
    slug?: string;
}

export default function WishlistPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState<WishlistBook[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [removingItems, setRemovingItems] = useState<string[]>([]);

    useEffect(() => {
        if (authLoading) return;

        loadWishlist();
    }, [isAuthenticated, authLoading]);

    useEffect(() => {
        if (wishlist.length > 0) {
            if (selectedItems.length === wishlist.length) {
                setSelectAll(true);
            } else {
                setSelectAll(false);
            }
        }
    }, [selectedItems, wishlist]);

    const loadWishlist = async () => {
        try {
            setLoading(true);
            if (!isAuthenticated) {
                setWishlist(getWishlistFromLocalStorage() as WishlistBook[]);
                return;
            }

            const response = await UserService.getWishlist();

            if (response?.success) {
                setWishlist(response.data || []);
            } else {
                setWishlist([]);
            }
        } catch (error) {
            console.error('Wishlist yuklanmadi:', error);
            toast.error('Sevimlilar yuklanmadi');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (productId: string) => {
        try {
            setRemovingItems((prev) => [...prev, productId]);
            if (!isAuthenticated) {
                removeGuestWishlist(productId);
                setWishlist(wishlist.filter((book) => book._id !== productId));
                setSelectedItems(selectedItems.filter((id) => id !== productId));
                toast.success("Sevimlilardan o'chirildi");
                return;
            }

            const response = await UserService.toggleWishlist(productId);

            if (response?.success) {
                setWishlist(wishlist.filter((book) => book._id !== productId));
                setSelectedItems(selectedItems.filter((id) => id !== productId));
                toast.success("Sevimlilardan o'chirildi");
            }
        } catch (error) {
            toast.error('Xatolik yuz berdi');
        } finally {
            setRemovingItems((prev) => prev.filter((id) => id !== productId));
        }
    };

    const handleRemoveSelected = async () => {
        if (selectedItems.length === 0) return;

        try {
            setRemovingItems(selectedItems);

            if (!isAuthenticated) {
                for (const id of selectedItems) {
                    removeGuestWishlist(id);
                }

                setWishlist(wishlist.filter((book) => !selectedItems.includes(book._id)));
                setSelectedItems([]);
                setSelectAll(false);
                toast.success(`${selectedItems.length} ta kitob sevimlilardan o'chirildi`);
                return;
            }

            for (const id of selectedItems) {
                await UserService.toggleWishlist(id);
            }

            setWishlist(wishlist.filter((book) => !selectedItems.includes(book._id)));
            setSelectedItems([]);
            setSelectAll(false);
            toast.success(`${selectedItems.length} ta kitob sevimlilardan o'chirildi`);
        } catch (error) {
            toast.error('Xatolik yuz berdi');
        } finally {
            setRemovingItems([]);
        }
    };

    const handleAddToCart = async (bookId: string) => {
        try {
            const book = wishlist.find((item) => item._id === bookId);
            if (!book) return;

            if (!isAuthenticated) {
                const cartItem = {
                    book: {
                        _id: book._id,
                        title: book.title,
                        slug: book.slug,
                        price: book.price,
                        images: book.images?.[0] ?? '',
                        stock: book.inStock === false ? 0 : 1
                    },
                    quantity: 1
                };

                addGuestCart([cartItem]);
                dispatch(addCart(cartItem));
                toast.success("Savatga qo'shildi");
                return;
            }

            await api.post('/cart/add', { productId: bookId, quantity: 1 });
            toast.success("Savatga qo'shildi");
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const handleAddSelectedToCart = async () => {
        if (selectedItems.length === 0) return;

        try {
            if (!isAuthenticated) {
                selectedItems.forEach((id) => {
                    const book = wishlist.find((item) => item._id === id);
                    if (!book) return;

                    const cartItem = {
                        book: {
                            _id: book._id,
                            title: book.title,
                            slug: book.slug,
                            price: book.price,
                            images: book.images?.[0] ?? '',
                            stock: book.inStock === false ? 0 : 1
                        },
                        quantity: 1
                    };

                    addGuestCart([cartItem]);
                    dispatch(addCart(cartItem));
                });
                toast.success(`${selectedItems.length} ta kitob savatga qo'shildi`);
                return;
            }

            for (const id of selectedItems) {
                await api.post('/cart/add', { productId: id, quantity: 1 });
            }
            toast.success(`${selectedItems.length} ta kitob savatga qo'shildi`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const handleAddAllToCart = async () => {
        if (wishlist.length === 0) return;

        try {
            if (!isAuthenticated) {
                wishlist.forEach((book) => {
                    const cartItem = {
                        book: {
                            _id: book._id,
                            title: book.title,
                            slug: book.slug,
                            price: book.price,
                            images: book.images?.[0] ?? '',
                            stock: book.inStock === false ? 0 : 1
                        },
                        quantity: 1
                    };

                    addGuestCart([cartItem]);
                    dispatch(addCart(cartItem));
                });
                toast.success(`${wishlist.length} ta kitob savatga qo'shildi`);
                return;
            }

            for (const book of wishlist) {
                await api.post('/cart/add', { productId: book._id, quantity: 1 });
            }
            toast.success(`${wishlist.length} ta kitob savatga qo'shildi`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Xatolik yuz berdi');
        }
    };

    const handleToggleSelect = (bookId: string) => {
        setSelectedItems((prev) => {
            if (prev.includes(bookId)) {
                return prev.filter((id) => id !== bookId);
            } else {
                return [...prev, bookId];
            }
        });
    };

    const handleToggleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(wishlist.map((book) => book._id));
        }
    };

    const getBookTitle = (book: WishlistBook): string => {
        if (typeof book.title === 'string') return book.title;
        return book.title?.uz || book.title?.ru || book.title?.en || "Noma'lum";
    };

    const getBookAuthor = (book: WishlistBook): string => {
        if (typeof book.author === 'string') return book.author;
        return book.author?.name || "Noma'lum muallif";
    };

    const getBookImage = (book: WishlistBook): string => {
        return getImageUrl(book.images);
    };

    const getFormatIcon = (format?: string) => {
        switch (format) {
            case 'audio':
                return <Headphones size={14} className='text-[#FF8A00] dark:text-orange-400' />;
            case 'ebook':
                return <BookOpen size={14} className='text-[#005CB9] dark:text-blue-400' />;
            default:
                return <BookOpen size={14} className='text-gray-400 dark:text-gray-500' />;
        }
    };

    const filteredWishlist = wishlist.filter((book) => {
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const title = getBookTitle(book).toLowerCase();
            const author = getBookAuthor(book).toLowerCase();
            return title.includes(query) || author.includes(query);
        }
        return true;
    });

    const totalPrice = wishlist.reduce((sum, book) => sum + (book.price || 0), 0);
    const selectedTotalPrice = wishlist
        .filter((book) => selectedItems.includes(book._id))
        .reduce((sum, book) => sum + (book.price || 0), 0);

    if (authLoading || loading) {
        return (
            <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800'>
                {/* Animated Background Elements */}

                <div className='brand-grid' />

                <div className='relative z-10 text-center'>
                    <div className='relative'>
                        <div className='mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-[#005CB9] border-t-transparent dark:border-blue-400' />
                        <Heart
                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform text-[#005CB9] dark:text-blue-400'
                            size={24}
                            fill='#005CB9'
                        />
                    </div>
                    <p className='animate-pulse text-gray-500 dark:text-gray-400'>Sevimlilar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-50 to-white py-8 dark:from-slate-900 dark:to-slate-800'>
            {/* Grid Pattern */}
            <div className='brand-grid' />

            <div className='relative z-10 container mx-auto max-w-7xl px-4'>
                {/* Header with animation */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                    <div className='flex items-center gap-3'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className='rounded-2xl bg-gradient-to-r from-[#005CB9]/10 to-[#FF8A00]/10 p-3 dark:from-blue-600/20 dark:to-orange-600/20'>
                            <Heart size={28} className='text-[#FF8A00] dark:text-orange-400' fill='#FF8A00' />
                        </motion.div>
                        <div>
                            <motion.h1
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className='text-2xl font-black md:text-3xl'>
                                <span className='text-[#005CB9] dark:text-blue-400'>Sevimli</span>
                                <span className='text-[#FF8A00] dark:text-orange-400'> kitoblar</span>
                            </motion.h1>
                            <motion.p
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                {wishlist.length > 0
                                    ? `Sizda ${wishlist.length} ta sevimli kitob bor`
                                    : "Sevimli kitoblar yo'q"}
                            </motion.p>
                        </div>
                    </div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className='flex items-center gap-3'>
                        {wishlist.length > 0 && (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        onClick={handleAddAllToCart}
                                        className='bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                        <ShoppingCart size={16} className='mr-2' />
                                        Hammasini savatga
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        href='/catalog'
                                        className='inline-block rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:border-[#005CB9] hover:text-[#005CB9] dark:border-slate-700 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400'>
                                        {" Katalogga o'tish "}
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {wishlist.length > 0 ? (
                    <>
                        {/* Search with animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className='mb-6 rounded-xl border border-gray-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <div className='flex flex-col gap-4 md:flex-row'>
                                <div className='relative flex-1'>
                                    <Search
                                        size={18}
                                        className='absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 dark:text-gray-500'
                                    />
                                    <Input
                                        placeholder='Kitob nomi yoki muallif...'
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className='border-gray-200 bg-white pl-10 text-gray-900 placeholder-gray-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder-gray-500'
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Select All with animation */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className='mb-4 rounded-xl border border-gray-100 bg-white/80 p-4 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-4'>
                                    <motion.input
                                        whileTap={{ scale: 0.9 }}
                                        type='checkbox'
                                        checked={selectAll}
                                        onChange={handleToggleSelectAll}
                                        className='h-4 w-4 rounded border-gray-300 bg-white text-[#005CB9] focus:ring-[#005CB9] dark:border-slate-600 dark:bg-slate-700 dark:text-blue-400 dark:focus:ring-blue-400'
                                    />
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        Hammasini tanlash ({wishlist.length} ta kitob)
                                    </span>
                                </div>

                                {selectedItems.length > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring' }}>
                                        <Button
                                            onClick={handleRemoveSelected}
                                            variant='outline'
                                            size='sm'
                                            className='border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
                                            disabled={removingItems.length > 0}>
                                            {removingItems.length > 0 ? (
                                                <Loader2 size={14} className='mr-2 animate-spin' />
                                            ) : (
                                                <Trash2 size={14} className='mr-2' />
                                            )}
                                            {" O'chirish ("}
                                            {selectedItems.length})
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>

                        {/* Wishlist Items */}
                        <div className='space-y-4'>
                            {filteredWishlist.map((book, index) => (
                                <motion.div
                                    key={book._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 + 0.8 }}
                                    whileHover={{ scale: 1.01, x: 5 }}
                                    className='rounded-xl border border-gray-100 bg-white/80 p-4 backdrop-blur-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-800/80 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                    <div className='flex flex-col gap-4 sm:flex-row'>
                                        {/* Checkbox */}
                                        <div className='flex items-start pt-2'>
                                            <motion.input
                                                whileTap={{ scale: 0.9 }}
                                                type='checkbox'
                                                checked={selectedItems.includes(book._id)}
                                                onChange={() => handleToggleSelect(book._id)}
                                                disabled={removingItems.includes(book._id)}
                                                className='h-4 w-4 rounded border-gray-300 bg-white text-[#005CB9] focus:ring-[#005CB9] dark:border-slate-600 dark:bg-slate-700 dark:text-blue-400 dark:focus:ring-blue-400'
                                            />
                                        </div>

                                        {/* Book Cover */}
                                        <Link href={`/book/${book.slug || book._id}`} className='flex-shrink-0'>
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className='relative h-32 w-24 overflow-hidden rounded-lg shadow-md'>
                                                <Image
                                                    src={getBookImage(book)}
                                                    alt={getBookTitle(book)}
                                                    fill
                                                    className='object-cover transition-transform duration-300 hover:scale-110'
                                                />
                                            </motion.div>
                                        </Link>

                                        {/* Book Info */}
                                        <div className='flex-1'>
                                            <div className='flex flex-col justify-between gap-2 sm:flex-row sm:items-start'>
                                                <div>
                                                    <Link
                                                        href={`/book/${book.slug || book._id}`}
                                                        className='line-clamp-1 text-lg font-bold text-gray-900 transition-colors hover:text-[#005CB9] dark:text-white dark:hover:text-blue-400'>
                                                        {getBookTitle(book)}
                                                    </Link>
                                                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                                                        {getBookAuthor(book)}
                                                    </p>

                                                    {/* Rating */}
                                                    {book.ratingAvg ? (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 + 0.9 }}
                                                            className='mt-2 flex items-center gap-2'>
                                                            <div className='flex items-center gap-0.5'>
                                                                {[1, 2, 3, 4, 5].map((star) => (
                                                                    <Star
                                                                        key={star}
                                                                        size={14}
                                                                        className={
                                                                            star <= Math.round(book.ratingAvg || 0)
                                                                                ? 'fill-[#FF8A00] text-[#FF8A00] dark:fill-orange-400 dark:text-orange-400'
                                                                                : 'text-gray-200 dark:text-gray-700'
                                                                        }
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className='text-xs font-bold text-gray-700 dark:text-gray-300'>
                                                                {book.ratingAvg?.toFixed(1)}
                                                            </span>
                                                            {book.ratingCount ? (
                                                                <span className='text-xs text-gray-400 dark:text-gray-500'>
                                                                    ({book.ratingCount})
                                                                </span>
                                                            ) : null}
                                                        </motion.div>
                                                    ) : null}

                                                    {/* Format Badge */}
                                                    {book.format && (
                                                        <motion.div
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: index * 0.1 + 1 }}
                                                            className='mt-2 flex w-fit items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 dark:bg-slate-700'>
                                                            {getFormatIcon(book.format)}
                                                            <span className='text-[10px] font-medium text-gray-600 dark:text-gray-400'>
                                                                {book.format === 'audio' ? 'Audio' : 'E-kitob'}
                                                            </span>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Price and Actions */}
                                                <div className='flex flex-col items-end gap-3'>
                                                    <div className='text-right'>
                                                        {book.oldPrice && book.oldPrice > book.price && (
                                                            <span className='block text-xs text-gray-400 line-through dark:text-gray-500'>
                                                                {book.oldPrice.toLocaleString()}
                                                                {" so'm "}
                                                            </span>
                                                        )}
                                                        <motion.span
                                                            whileHover={{ scale: 1.1, color: '#005CB9' }}
                                                            className='text-xl font-black text-[#005CB9] dark:text-blue-400'>
                                                            {book.price?.toLocaleString() || 0}
                                                            {" so'm "}
                                                        </motion.span>
                                                    </div>

                                                    <div className='flex items-center gap-2'>
                                                        <motion.div
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}>
                                                            <button
                                                                onClick={() => handleAddToCart(book._id)}
                                                                disabled={removingItems.includes(book._id)}
                                                                className='rounded-lg bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-4 py-2 text-sm font-bold text-white transition-all hover:shadow-lg disabled:opacity-50 dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                                                <ShoppingCart size={16} className='mr-1 inline' />
                                                                Savatga
                                                            </button>
                                                        </motion.div>
                                                        <motion.button
                                                            whileHover={{ scale: 1.1 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRemoveFromWishlist(book._id)}
                                                            disabled={removingItems.includes(book._id)}
                                                            className='p-2 text-gray-400 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-gray-500 dark:hover:text-red-400'
                                                            title="Sevimlilardan o'chirish">
                                                            {removingItems.includes(book._id) ? (
                                                                <Loader2 size={18} className='animate-spin' />
                                                            ) : (
                                                                <Trash2 size={18} />
                                                            )}
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Summary */}
                        <AnimatePresence>
                            {selectedItems.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className='mt-8 rounded-xl border border-gray-100 bg-gradient-to-r from-[#005CB9]/5 to-[#FF8A00]/5 p-6 backdrop-blur-sm dark:border-slate-700 dark:from-blue-600/10 dark:to-orange-600/10'>
                                    <div className='flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                                        <div>
                                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                                Tanlangan kitoblar ({selectedItems.length})
                                            </p>
                                            <motion.p
                                                key={selectedTotalPrice}
                                                initial={{ scale: 1.2 }}
                                                animate={{ scale: 1 }}
                                                className='text-2xl font-black text-[#005CB9] dark:text-blue-400'>
                                                {selectedTotalPrice.toLocaleString()}
                                                {" so'm "}
                                            </motion.p>
                                        </div>

                                        <div className='flex gap-3'>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={handleRemoveSelected}
                                                    variant='outline'
                                                    className='border-red-200 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
                                                    disabled={selectedItems.length === 0 || removingItems.length > 0}>
                                                    {removingItems.length > 0 ? (
                                                        <Loader2 size={16} className='mr-2 animate-spin' />
                                                    ) : (
                                                        <Trash2 size={16} className='mr-2' />
                                                    )}
                                                    {" Tanlanganlarni o'chirish "}
                                                </Button>
                                            </motion.div>
                                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    onClick={handleAddSelectedToCart}
                                                    className='bg-gradient-to-r from-[#005CB9] to-[#FF8A00] text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'
                                                    disabled={selectedItems.length === 0}>
                                                    <ShoppingCart size={16} className='mr-2' />
                                                    {" Savatga qo'shish "}
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Info Icons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.9 }}
                            className='mt-8 grid grid-cols-3 gap-2 text-center text-xs'>
                            {[
                                { icon: Truck, text: 'Bepul yetkazish' },
                                { icon: Shield, text: "Xavfsiz to'lov" },
                                { icon: Package, text: 'Kafolat' }
                            ].map((item, index) => (
                                <motion.div key={index} whileHover={{ y: -5 }} className='p-2'>
                                    <item.icon size={16} className='mx-auto mb-1 text-gray-400 dark:text-gray-500' />
                                    <span className='text-gray-400 dark:text-gray-500'>{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </>
                ) : (
                    // Empty State with animation
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className='rounded-2xl border border-gray-100 bg-white/80 p-12 text-center backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80'>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-[#FF8A00]/10 to-[#005CB9]/10 dark:from-orange-600/20 dark:to-blue-600/20'>
                            <Heart size={48} className='text-[#FF8A00] dark:text-orange-400' />
                        </motion.div>
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className='mb-3 text-2xl font-black text-gray-900 dark:text-white'>
                            {" Sevimli kitoblar yo'q "}
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className='mx-auto mb-8 max-w-md text-gray-500 dark:text-gray-400'>
                            {
                                " Hali hech qanday kitobni sevimlilarga qo'shmagansiz. Katalogdan o'zingizga yoqqan kitoblarni toping va ularni sevimlilarga qo'shing. "
                            }
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className='flex flex-col justify-center gap-4 sm:flex-row'>
                            <Link
                                href='/catalog'
                                className='inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#005CB9] to-[#FF8A00] px-6 py-3 font-bold text-white transition-all hover:shadow-lg dark:from-blue-600 dark:to-orange-600 dark:hover:shadow-2xl dark:hover:shadow-blue-900/20'>
                                <BookOpen size={18} />
                                {" Katalogga o'tish "}
                            </Link>
                            <Link
                                href='/profile'
                                className='inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-3 font-bold text-gray-600 transition-all hover:border-[#005CB9] hover:text-[#005CB9] dark:border-slate-700 dark:text-gray-400 dark:hover:border-blue-400 dark:hover:text-blue-400'>
                                Profilga qaytish
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
