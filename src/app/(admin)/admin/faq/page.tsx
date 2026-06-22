'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeleteFaq } from '@/components/admin/hooks/faqsHooks/useDeleteFaq';
import { useFaqListQuery } from '@/components/admin/hooks/queries/faq';
import PaginationFooter from '@/components/admin/other/PaginationFooter';
import HeadSection from '@/components/admin/sections/HeadSection';
import { Button } from '@/components/ui/button';
import { PublishersSkeleton } from '@/components/ui/skeleton';
import { useUrlSearch } from '@/hooks/useUrlSearch';
import { FETCH_PAGINATION_LIMIT } from '@/tools';
import { getPageFromUrl, updateUrlPage } from '@/utils/pagination';

import { Edit3, HelpCircle, MessageCircleQuestion, Search, Trash2 } from 'lucide-react';

const AdminFaqPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlPage = getPageFromUrl(searchParams.get('page'));
    const [page, setPage] = useState(urlPage);
    const { searchInput, setSearchInput, debouncedSearch } = useUrlSearch();
    const { data: faqItems, isFetching, isLoading } = useFaqListQuery(page, FETCH_PAGINATION_LIMIT, debouncedSearch);
    const { mutate } = useDeleteFaq();
    const faqData = faqItems?.faqs ?? [];
    const pagination = faqItems?.pagination;

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

    const stats = [
        { label: 'Jami savollar', value: pagination?.total ?? faqData.length, icon: HelpCircle, color: 'bg-[#ef7f1a]' }
    ];
    return (
        <div className='space-y-5'>
            <HeadSection
                title='FAQ'
                text="Mijozlar ko'p so'raydigan savollar va ularga beriladigan javoblar ko'rinishini boshqarish."
                href='faq'
            />

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
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 lg:flex-row lg:items-center lg:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] lg:max-w-md lg:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} className='shrink-0' />
                        <input
                            type='search'
                            value={searchInput}
                            onChange={(event) => setSearchInput(event.target.value)}
                            placeholder='Savol, javob yoki kategoriya qidirish'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>
                </div>

                <div className='grid gap-3 p-4'>
                    {isLoading ? (
                        <PublishersSkeleton />
                    ) : (
                        faqData.map((item, index) => (
                            <article
                                key={item._id}
                                className='rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                <div className='flex justify-between gap-4 lg:items-center'>
                                    <div className='flex min-w-0 gap-3'>
                                        <span className='grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-950'>
                                            <MessageCircleQuestion size={20} />
                                        </span>
                                        <div className='min-w-0'>
                                            <h3 className='font-black text-[#2f2a25] dark:text-white'>
                                                {index + 1}. {item.question.uz}
                                            </h3>
                                            <p className='mt-2 line-clamp-2 text-sm leading-6 font-semibold text-[#8b7e70] dark:text-slate-400'>
                                                {item.answer.uz}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex justify-end gap-2'>
                                        <Button size='icon-sm' variant='ghost' className='rounded-xl' asChild>
                                            <Link href={`/admin/faq/new?id=${item._id}`}>
                                                <Edit3 size={17} />
                                            </Link>
                                        </Button>
                                        <Button
                                            size='icon-sm'
                                            variant='ghost'
                                            onClick={() => mutate(item._id)}
                                            className='rounded-xl text-red-500 hover:text-red-600'>
                                            <Trash2 size={17} />
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                <PaginationFooter pagination={pagination} page={page} updatePage={updatePage} isFetching={isFetching} />
            </section>
        </div>
    );
};

export default AdminFaqPage;
