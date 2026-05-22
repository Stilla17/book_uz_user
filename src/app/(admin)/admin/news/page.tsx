'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeleteNews } from '@/components/admin/hooks/newsHooks/useDeleteNews';
import { useNewsListQuery } from '@/components/admin/hooks/queries/news';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import { Button } from '@/components/ui/button';
import { BooksTableSkeleton } from '@/components/ui/skeleton';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import dayjs from 'dayjs';
import { CalendarDays, Edit3, Eye, Newspaper, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminNewsPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data, isFetching, isLoading } = useNewsListQuery(page, FETCH_PAGINATION_LIMIT, debouncedSearch);
    const { mutate: deleteNews, isPending: isDeletePending } = useDeleteNews();

    console.log(data);
    const news = data?.news ?? [];
    const pagination = data?.pagination;
    const stats = [{ label: 'Jami yangiliklar', value: news.length, icon: Newspaper, color: 'bg-[#ef7f1a]' }];

    useEffect(() => {
        setPage(urlPage);
    }, [urlPage]);

    const updatePage = (nextPage: number) => {
        updateUrlPage({
            nextPage,
            totalPages: pagination?.pages ?? 1,
            searchParams,
            replace: router.replace,
            setPage
        });
    };

    const handleDeleteNews = (id: string) => {
        deleteNews(id, {
            onSuccess: () => {
                toast.success("Yangilik o'chirildi");
            },
            onError: (error: any) => {
                toast.error(error?.response?.data?.message || error?.message || "Yangilikni o'chirishda xatolik");
            }
        });
    };

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <h2 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Yangiliklar</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Saytdagi maqolalar, e'lonlar va yangilik kontentlarini boshqarish sahifasi.
                    </p>
                </div>

                <Button
                    asChild
                    className='h-11 rounded-2xl bg-[#ef7f1a] px-5 font-black text-white hover:bg-orange-600'>
                    <Link href='/admin/news/new'>
                        <Plus size={18} />
                        Yangi yangilik
                    </Link>
                </Button>
            </section>

            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                {stats.map(({ label, value, icon: Icon, color }) => (
                    <div
                        key={label}
                        className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
                            <Icon size={20} />
                        </span>
                        <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value}</p>
                        <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                    </div>
                ))}
            </section>

            <section className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] md:max-w-sm md:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} className='shrink-0' />
                        <input
                            type='search'
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder='Yangilik nomi yoki kategoriya qidirish'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>

                    <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {news.length} ta yangilik ko'rsatildi
                    </span>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-220 text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>Yangilik</th>
                                <th className='px-4 py-3'>Sana</th>
                                <th className='px-4 py-3'>Ko'rishlar</th>
                                <th className='px-4 py-3 text-right'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : (
                                news.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                                        <td className='px-4 py-4'>
                                            <div className='flex min-w-0 items-center gap-3'>
                                                <div className='grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f2e7d8] dark:bg-slate-900'>
                                                    <img src={getImageUrl(item.image)} alt='' />
                                                </div>
                                                <div className='min-w-0'>
                                                    <p className='truncate font-black text-[#2f2a25] dark:text-white'>
                                                        {index + 1}. {getLocalizedText(item.title)}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='inline-flex items-center gap-2 text-sm font-bold text-[#6f6255] dark:text-slate-300'>
                                                <CalendarDays size={16} />
                                                {item.createdAt
                                                    ? dayjs(item.createdAt).format('DD.MM.YYYY HH:mm')
                                                    : '-'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4 font-black text-[#2f2a25] dark:text-white'>
                                            {item.views}
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='flex justify-end gap-2'>
                                                <Button size='icon-sm' variant='ghost' className='rounded-xl'>
                                                    <Eye size={17} />
                                                </Button>
                                                <Button size='icon-sm' variant='ghost' className='rounded-xl' asChild>
                                                    <Link href={`/admin/news/new?id=${item._id}`}>
                                                        <Edit3 size={17} />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size='icon-sm'
                                                    variant='ghost'
                                                    disabled={isDeletePending}
                                                    onClick={() => handleDeleteNews(item._id)}
                                                    className='rounded-xl text-red-500 hover:text-red-600'>
                                                    <Trash2 size={17} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationFooter pagination={pagination} page={page} updatePage={updatePage} isFetching={isFetching} />
            </section>
        </div>
    );
};

export default AdminNewsPage;
