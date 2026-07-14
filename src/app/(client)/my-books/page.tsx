'use client';

import { useEffect, useMemo } from 'react';

import Link from 'next/link';

import { BookCard } from '@/components/cards/BookCard';
import { Button } from '@/components/ui/button';
import { useWishlistBooks } from '@/hooks/bookHooks/useWishlistBooks';
import { setLoading } from '@/store/features/globalSlice';
import { useAppDispatch } from '@/store/hooks';

import { BookOpen, ShoppingBag } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MyBooksPage() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { books, loadingBooks, isAuthenticated, authLoading, removeBook } = useWishlistBooks();

    useEffect(() => {
        const isPageLoading = authLoading || loadingBooks;
        dispatch(setLoading(isPageLoading));

        return () => {
            dispatch(setLoading(false));
        };
    }, [authLoading, dispatch, loadingBooks]);

    const stats = useMemo(
        () => [
            { label: t('myBooksPage.books'), value: books.length },
            {
                label: t('myBooksPage.status'),
                value: isAuthenticated ? t('myBooksPage.signedIn') : t('myBooksPage.guest')
            }
        ],
        [books.length, isAuthenticated, t]
    );

    const handleWishlistChange = (bookId: string, isWishlisted: boolean) => {
        if (isWishlisted) return;
        removeBook(bookId);
    };

    if (authLoading || loadingBooks) return null;

    return (
        <main className='min-h-screen text-slate-950 dark:bg-slate-950 dark:text-white'>
            <section className='border-b border-slate-200 dark:border-slate-800 dark:bg-slate-900'>
                <div className='mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8'>
                    <div className='flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between'>
                        <h1 className='text-3xl font-black tracking-normal md:text-5xl'>{t('myBooksPage.title')}</h1>

                        <Button
                            asChild
                            className='h-11 rounded-lg bg-[#ef7f1a] px-5 font-bold text-white hover:bg-[#d96f12]'>
                            <Link href='/catalog'>
                                <ShoppingBag size={18} />
                                {t('myBooksPage.goToCatalog')}
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
                            {isAuthenticated ? t('myBooksPage.serverBooks') : t('myBooksPage.localBooks')}
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
                        <h2 className='mt-4 text-xl font-black'>{t('myBooksPage.emptyTitle')}</h2>
                        <p className='mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400'>
                            {isAuthenticated ? t('myBooksPage.emptyAuthenticated') : t('myBooksPage.emptyGuest')}
                        </p>
                    </div>
                )}
            </section>
        </main>
    );
}
