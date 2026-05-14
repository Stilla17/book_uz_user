'use client';

import Link from 'next/link';

import { useGenreQuery } from '@/components/admin/hooks/queries/genre';
import { Button } from '@/components/ui/button';
import { BooksTableSkeleton } from '@/components/ui/skeleton';

import { BookOpen, Edit3, FolderTree, Plus, Search, Tags, Trash2 } from 'lucide-react';

const stats = [
    { label: 'Jami janrlar', value: '42', icon: Tags, color: 'bg-[#ef7f1a]' },
    { label: 'Subjanrlar', value: '118', icon: FolderTree, color: 'bg-[#285c7f]' },
    { label: 'Kitoblar', value: '2,418', icon: BookOpen, color: 'bg-[#7c6dc8]' }
];

const AdminGenrePage = () => {
    const { data, isLoading } = useGenreQuery();

    console.log(data);

    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <p className='text-xs font-black tracking-wide text-[#ef7f1a] uppercase'>Katalog sozlamalari</p>
                    <h2 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Janrlar</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Kitoblarni katalog bo'yicha tartiblash uchun janr va subjanrlar boshqaruvi.
                    </p>
                </div>

                <Button className='h-11 rounded-2xl bg-[#ef7f1a] px-5 text-sm font-black text-nowrap text-white transition hover:bg-orange-600'>
                    <Link href='/admin/genre/new' className='inline-flex items-center justify-center gap-2'>
                        <Plus size={18} />
                        Yangi janr
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
                        <Search size={18} />
                        <input
                            type='search'
                            placeholder='Janr nomi yoki slug qidirish'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>
                    <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {data?.length} ta janr ko'rsatildi
                    </span>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-180 text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>Janr</th>
                                <th className='px-4 py-3'>Slug</th>
                                <th className='px-4 py-3'>Kitoblar</th>
                                <th className='px-4 py-3 text-right'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <BooksTableSkeleton />
                            ) : (
                                data?.map((genre) => (
                                    <tr
                                        key={genre.slug}
                                        className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                                        <td className='px-4 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <span
                                                    className={`grid size-11 place-items-center rounded-2xl bg-[#ef7f1a] text-white`}>
                                                    <Tags size={18} />
                                                </span>
                                                <span className='font-black text-[#2f2a25] dark:text-white'>
                                                    {genre.title.uz}
                                                </span>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4 text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                                            /{genre.slug}
                                        </td>
                                        <td className='px-4 py-4 font-black text-[#2f2a25] dark:text-white'>
                                            {genre.bookCount ??
                                                genre.subgenres.reduce((sum, sg) => sum + (sg.books?.length || 0), 0)}
                                        </td>

                                        <td className='px-4 py-4'>
                                            <div className='flex justify-end gap-2'>
                                                <button className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-900'>
                                                    <Edit3 size={17} />
                                                </button>
                                                <button className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'>
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminGenrePage;
