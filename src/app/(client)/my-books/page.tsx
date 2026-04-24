'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import { BookCard, type Book } from '@/components/cards/BookCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { UserService } from '@/services/api';
import { getGuestWishlist } from '@/utils/wishlist';

import { BookOpen, ShoppingBag } from 'lucide-react';

type ServerWishlistBook = {
    _id: string;
    slug?: string;
    title: string | { uz: string; ru?: string; en?: string };
    author?: string | { name: string };
    price: number;
    discountPrice?: number;
    ratingAvg?: number;
    ratingCount?: number;
    stock?: number;
    images?: string[];
    format?: 'ebook' | 'audio' | 'paper';
};

const mapServerBookToCardBook = (book: ServerWishlistBook): Book => ({
    _id: book._id,
    slug: book.slug,
    title:
        typeof book.title === 'string'
            ? book.title
            : {
                  uz: book.title?.uz || '',
                  ru: book.title?.ru || '',
                  en: book.title?.en || ''
              },
    author: book.author || "Noma'lum muallif",
    price: book.discountPrice && book.discountPrice > 0 ? book.discountPrice : book.price,
    oldPrice: book.discountPrice && book.discountPrice > 0 ? book.price : undefined,
    rating: book.ratingAvg || 0,
    reviewsCount: book.ratingCount || 0,
    stock: book.stock,
    image: book.images?.[0],
    format: book.format,
    isWishlisted: true
});

export default function MyBooksPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [books, setBooks] = useState<Book[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        const loadBooks = async () => {
            setLoadingBooks(true);

            try {
                if (isAuthenticated) {
                    const response = await UserService.getWishlist();
                    const wishlist = Array.isArray(response?.data) ? response.data : [];
                    setBooks(wishlist.map(mapServerBookToCardBook));
                } else {
                    setBooks(getGuestWishlist().map((book) => ({ ...book, isWishlisted: true })));
                }
            } catch (error) {
                console.error('Kitoblar yuklanmadi:', error);
                setBooks([]);
            } finally {
                setLoadingBooks(false);
            }
        };

        loadBooks();
    }, [authLoading, isAuthenticated]);

    const stats = useMemo(
        () => [
            { label: 'Kitoblar', value: books.length },
            { label: 'Holat', value: isAuthenticated ? 'Login' : 'Guest' },
        ],
        [books.length, isAuthenticated]
    );

    const handleWishlistChange = (bookId: string, isWishlisted: boolean) => {
        if (isWishlisted) return;
        setBooks((currentBooks) => currentBooks.filter((book) => book._id !== bookId));
    };

    if (authLoading || loadingBooks) {
        return (
            <main className='grid min-h-screen place-items-center bg-slate-50 px-4 dark:bg-slate-950'>
                <div className='text-center'>
                    <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#ef7f1a] dark:border-slate-800 dark:border-t-orange-400' />
                    <p className='text-sm font-semibold text-slate-500 dark:text-slate-400'>Kutubxona yuklanmoqda...</p>
                </div>
            </main>
        );
    }

    return (
        <main className='min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white'>
            <section className='border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'>
                <div className='mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8'>
                    <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
                        <div>
                            <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-sm font-bold text-[#ef7f1a] dark:border-orange-900 dark:bg-orange-950/60 dark:text-orange-300'>
                                <BookOpen size={16} />
                                Mening kutubxonam
                            </div>
                            <h1 className='text-3xl font-black tracking-normal md:text-5xl'>Mening kitoblarim</h1>
                            <p className='mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400'>
                                {isAuthenticated
                                    ? "Login qilingan holatda kitoblar serverdagi sevimlilar ro'yxatidan olinadi."
                                    : "Login qilmagan holatda bu sahifada browser localStorage ichidagi ma'lumotlar ko'rinadi."}
                            </p>
                        </div>

                        <Button
                            asChild
                            className='h-11 rounded-lg bg-[#ef7f1a] px-5 font-bold text-white hover:bg-[#d96f12]'>
                            <Link href='/catalog'>
                                <ShoppingBag size={18} />
                                Katalogga otish
                            </Link>
                        </Button>
                    </div>

                    <div className='mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                        {stats.map((item) => (
                            <div
                                key={item.label}
                                className='rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950'>
                                <p className='text-sm font-medium text-slate-500 dark:text-slate-400'>{item.label}</p>
                                <p className='mt-1 text-2xl font-black'>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
                {books.length > 0 ? (
                    <div className='rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900'>
                        <h2 className='text-xl font-black'>
                            {isAuthenticated ? 'Serverdagi kitoblar' : 'LocalStorage kitoblari'}
                        </h2>
                        <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                            {books.map((book) => (
                                <BookCard key={book._id} book={book} onWishlistChange={handleWishlistChange} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className='rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900'>
                        <BookOpen size={34} className='mx-auto text-slate-400' />
                        <h2 className='mt-4 text-xl font-black'>Kitoblar yo'q</h2>
                        <p className='mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400'>
                            {isAuthenticated
                                ? "Serverdagi sevimlilar ro'yxatingiz hozircha bo'sh."
                                : "Katalogdan sevimliga qo'shsangiz, kitob card holatida shu yerda ko'rinadi."}
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}
