import { BookOpen, Edit3, Eye, FolderTree, Plus, Search, Tags, Trash2 } from 'lucide-react';

const genres = [
    { name: 'Badiiy adabiyot', slug: 'badiiy-adabiyot', books: 428, status: 'Faol', color: 'bg-[#ef7f1a]' },
    { name: 'Biznes', slug: 'biznes', books: 184, status: 'Faol', color: 'bg-[#285c7f]' },
    { name: 'Psixologiya', slug: 'psixologiya', books: 213, status: 'Faol', color: 'bg-[#43a27a]' },
    { name: 'Bolalar adabiyoti', slug: 'bolalar-adabiyoti', books: 156, status: 'Yashirilgan', color: 'bg-[#7c6dc8]' }
];

const stats = [
    { label: 'Jami janrlar', value: '42', icon: Tags, color: 'bg-[#ef7f1a]' },
    { label: 'Subjanrlar', value: '118', icon: FolderTree, color: 'bg-[#285c7f]' },
    { label: 'Faol janrlar', value: '36', icon: Eye, color: 'bg-[#43a27a]' },
    { label: 'Kitoblar', value: '2,418', icon: BookOpen, color: 'bg-[#7c6dc8]' }
];

const AdminGenrePage = () => {
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

                <button className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] px-5 text-sm font-black text-white transition hover:bg-orange-600'>
                    <Plus size={18} />
                    Yangi janr
                </button>
            </section>

            <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
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

            <section className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]'>
                <div className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
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
                            {genres.length} ta janr ko'rsatildi
                        </span>
                    </div>

                    <div className='overflow-x-auto'>
                        <table className='w-full min-w-[720px] text-left'>
                            <thead>
                                <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                    <th className='px-4 py-3'>Janr</th>
                                    <th className='px-4 py-3'>Slug</th>
                                    <th className='px-4 py-3'>Kitoblar</th>
                                    <th className='px-4 py-3'>Holat</th>
                                    <th className='px-4 py-3 text-right'>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {genres.map((genre) => (
                                    <tr
                                        key={genre.slug}
                                        className='border-b border-[#f0e4d3] last:border-0 dark:border-slate-900'>
                                        <td className='px-4 py-4'>
                                            <div className='flex items-center gap-3'>
                                                <span className={`grid size-11 place-items-center rounded-2xl ${genre.color} text-white`}>
                                                    <Tags size={18} />
                                                </span>
                                                <span className='font-black text-[#2f2a25] dark:text-white'>{genre.name}</span>
                                            </div>
                                        </td>
                                        <td className='px-4 py-4 text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                                            /{genre.slug}
                                        </td>
                                        <td className='px-4 py-4 font-black text-[#2f2a25] dark:text-white'>
                                            {genre.books}
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'>
                                                {genre.status}
                                            </span>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <aside className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <div className='flex items-center gap-2'>
                        <span className='grid size-10 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
                            <Plus size={18} />
                        </span>
                        <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Tez qo'shish</h3>
                    </div>

                    <div className='mt-5 space-y-4'>
                        <label className='block space-y-2'>
                            <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Janr nomi</span>
                            <input className='h-12 w-full rounded-2xl border border-[#eadfce] bg-white px-4 text-sm font-semibold outline-none focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white' />
                        </label>
                        <label className='block space-y-2'>
                            <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Slug</span>
                            <input className='h-12 w-full rounded-2xl border border-[#eadfce] bg-white px-4 text-sm font-semibold outline-none focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white' />
                        </label>
                        <button className='h-12 w-full rounded-2xl bg-[#ef7f1a] text-sm font-black text-white transition hover:bg-orange-600'>
                            Saqlash
                        </button>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default AdminGenrePage;
