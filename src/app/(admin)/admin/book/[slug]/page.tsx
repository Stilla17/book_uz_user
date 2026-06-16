'use client';

import { useMemo } from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { bookService } from '@/services/book.service';
import { Book } from '@/types/book';
import { getAuthor, getCategoryLabel, getLocalizedText } from '@/utils/book-formatters';
import { formatPrice } from '@/utils/currency';
import { getImageUrl } from '@/utils/image';
import { useQuery } from '@tanstack/react-query';

import { ArrowLeft, BookOpen, Edit3, ImageIcon, PackageCheck, Store, Trash2 } from 'lucide-react';

type DetailBook = Book & {
    category?: Parameters<typeof getCategoryLabel>[0];
};

const InfoItem = ({ label, value }: { label: string; value?: string | number | null }) => (
    <div className='rounded-2xl bg-[#f7f0e6] p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
        <p className='text-xs font-black tracking-wide text-[#9d907e] uppercase dark:text-slate-500'>{label}</p>
        <p className='wrap-break-words mt-2 text-sm font-black text-[#2f2a25] dark:text-white'>{value || '-'}</p>
    </div>
);

const AdminBookDetailPage = () => {
    const params = useParams();
    const slug = params?.slug as string;

    const { data: book, isLoading } = useQuery<DetailBook | null>({
        queryKey: ['admin-book', slug],
        queryFn: () => bookService.getBookById(slug) as Promise<DetailBook | null>,
        enabled: Boolean(slug)
    });

    console.log(book);

    const bookView = useMemo(
        () => ({
            title: getLocalizedText(book?.title, 'Nomsiz kitob'),
            description: getLocalizedText(book?.description, "Tavsif qo'shilmagan."),
            image: book?.images?.[0] || book?.image,
            author: getAuthor(book?.authorName || book?.author),
            category: getCategoryLabel(book?.category, "Kategoriya yo'q")
        }),
        [book]
    );

    const branchStocks = book?.branchStocks?.filter((item) => Number(item.available || 0) > 0) ?? [];
    const stock = Number(book?.stock || 0);
    const stockStatus = stock <= 0 ? 'Tugagan' : stock < 10 ? 'Kam qolgan' : 'Mavjud';

    if (isLoading) {
        return (
            <div className='grid min-h-[420px] place-items-center rounded-[24px] bg-[#fffaf2] text-sm font-black text-[#9d907e] ring-1 ring-[#eadfce] dark:bg-slate-950 dark:text-slate-400 dark:ring-slate-800'>
                Kitob ma'lumotlari yuklanmoqda...
            </div>
        );
    }

    if (!book) {
        return (
            <div className='grid min-h-[420px] place-items-center rounded-[24px] bg-[#fffaf2] p-6 text-center ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <div className='mx-auto grid size-14 place-items-center rounded-2xl bg-[#f2e7d8] text-[#9d907e] dark:bg-slate-900 dark:text-slate-400'>
                        <BookOpen size={24} />
                    </div>
                    <h2 className='mt-4 text-xl font-black text-[#2f2a25] dark:text-white'>Kitob topilmadi</h2>
                    <Button asChild className='mt-5 rounded-2xl bg-[#ef7f1a] font-black text-white hover:bg-orange-600'>
                        <Link href='/admin/book'>
                            <ArrowLeft size={17} />
                            Ro'yxatga qaytish
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div className='min-w-0'>
                    <Link
                        href='/admin/book'
                        className='inline-flex items-center gap-2 text-sm font-black text-[#9d907e] transition hover:text-[#ef7f1a] dark:text-slate-400 dark:hover:text-white'>
                        <ArrowLeft size={17} />
                        Barcha kitoblar
                    </Link>
                    <h2 className='mt-3 truncate text-2xl font-black text-[#2f2a25] dark:text-white'>
                        {bookView.title}
                    </h2>
                    <p className='mt-2 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        {bookView.author} - {bookView.category}
                    </p>
                </div>

                <div className='flex gap-2'>
                    <Button
                        variant='outline'
                        className='h-11 rounded-2xl border-[#eadfce] bg-white font-black dark:border-slate-800 dark:bg-slate-900'>
                        <Edit3 size={17} />
                        Tahrirlash
                    </Button>
                    <Button className='h-11 rounded-2xl bg-red-500 px-4 font-black text-white hover:bg-red-600'>
                        <Trash2 size={17} />
                    </Button>
                </div>
            </section>

            <section className='grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]'>
                <div className='rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <div className='grid aspect-[3/4] place-items-center overflow-hidden rounded-[20px] bg-[#f2e7d8] dark:bg-slate-900'>
                        {bookView.image ? (
                            <img
                                src={getImageUrl(bookView.image)}
                                alt={bookView.title}
                                className='h-full w-full object-cover'
                            />
                        ) : (
                            <ImageIcon size={42} className='text-[#9d907e]' />
                        )}
                    </div>

                    <div className='mt-4 grid grid-cols-2 gap-3'>
                        <div className='rounded-2xl bg-[#ef7f1a] p-4 text-white'>
                            <p className='text-xs font-black uppercase opacity-80'>Narx</p>
                            <p className='mt-2 text-lg font-black'>{formatPrice(book.price)}</p>
                        </div>
                        <div className='rounded-2xl bg-[#285c7f] p-4 text-white'>
                            <p className='text-xs font-black uppercase opacity-80'>Zaxira</p>
                            <p className='mt-2 text-lg font-black'>{stock} dona</p>
                        </div>
                    </div>
                </div>

                <div className='space-y-5'>
                    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                        <InfoItem label='Holat' value={stockStatus} />
                        <InfoItem
                            label='Reyting'
                            value={`${Number(book.ratingAvg || book.rating || 0).toFixed(1)} / 5`}
                        />
                        <InfoItem label='Sotuvlar' value={book.sales ?? 0} />
                        <InfoItem label="Ko'rishlar" value={book.views ?? 0} />
                    </div>

                    <div className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center gap-2'>
                            <BookOpen size={20} className='text-[#ef7f1a]' />
                            <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Kitob haqida</h3>
                        </div>
                        <p className='mt-4 text-sm leading-7 font-semibold text-[#6f6255] dark:text-slate-300'>
                            {bookView.description}
                        </p>
                    </div>

                    <div className='grid gap-4 md:grid-cols-2'>
                        <InfoItem label='ISBN / Barcode' value={book.barcode || book.isbn} />
                        <InfoItem label='Nashriyot' value={book.publisherName || book.publisher} />
                        <InfoItem label='Yil' value={book.year || book.publishedYear || book.details?.publishedYear} />
                        <InfoItem label='Betlar soni' value={book.numberOfPage || book.pages} />
                        <InfoItem label='Til' value={book.language?.toUpperCase()} />
                        <InfoItem label='Yozuv' value={book.contentLanguage === 'cyrillic' ? 'Kirill' : 'Lotin'} />
                        <InfoItem
                            label='Muqova'
                            value={book.cover === 'paper' ? 'Yumshoq' : book.cover ? 'Qattiq' : '-'}
                        />
                        <InfoItem label='Format' value={book.format || 'paper'} />
                    </div>
                </div>
            </section>

            <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                        <PackageCheck size={20} className='text-[#43a27a]' />
                        <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Do'konlardagi zaxira</h3>
                    </div>
                    <span className='rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#8b7e70] dark:bg-slate-900 dark:text-slate-300'>
                        {branchStocks.length} ta filial
                    </span>
                </div>

                {branchStocks.length ? (
                    <div className='mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3'>
                        {branchStocks.map((item, index) => (
                            <div
                                key={item._id || item.storeId || index}
                                className='rounded-2xl bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                <div className='flex items-center justify-between gap-3'>
                                    <div className='flex min-w-0 items-center gap-3'>
                                        <span className='grid size-10 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'>
                                            <Store size={18} />
                                        </span>
                                        <div className='min-w-0'>
                                            <p className='truncate font-black text-[#2f2a25] dark:text-white'>
                                                {item.storeName || "Do'kon"}
                                            </p>
                                            <p className='text-xs font-bold text-[#9d907e] dark:text-slate-400'>
                                                Mavjud zaxira
                                            </p>
                                        </div>
                                    </div>
                                    <span className='rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'>
                                        {item.available} dona
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='mt-4 rounded-2xl bg-[#f7f0e6] p-5 text-sm font-bold text-[#9d907e] dark:bg-slate-900 dark:text-slate-400'>
                        Filiallar bo'yicha mavjud zaxira topilmadi.
                    </div>
                )}
            </section>
        </div>
    );
};

export default AdminBookDetailPage;
