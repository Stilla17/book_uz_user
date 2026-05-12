import { Award, BookOpen, Edit3, ImagePlus, PenLine, Plus, Search, Star, Trash2, Users } from 'lucide-react';

const authors = [
    { name: 'Abdulla Qodiriy', slug: 'abdulla-qodiriy', books: 18, country: "O'zbekiston", rating: '4.9', status: 'Faol' },
    { name: 'Chingiz Aytmatov', slug: 'chingiz-aytmatov', books: 27, country: "Qirg'iziston", rating: '4.8', status: 'Faol' },
    { name: "O'tkir Hoshimov", slug: 'otkir-hoshimov', books: 21, country: "O'zbekiston", rating: '4.9', status: 'Faol' },
    { name: 'George Orwell', slug: 'george-orwell', books: 12, country: 'Buyuk Britaniya', rating: '4.7', status: 'Yashirilgan' }
];

const stats = [
    { label: 'Jami mualliflar', value: '284', icon: Users, color: 'bg-[#ef7f1a]' },
    { label: 'Faol mualliflar', value: '251', icon: PenLine, color: 'bg-[#43a27a]' },
    { label: 'Kitoblar', value: '4,920', icon: BookOpen, color: 'bg-[#285c7f]' },
    { label: 'Top mualliflar', value: '32', icon: Award, color: 'bg-[#7c6dc8]' }
];

const AdminAuthorsPage = () => {
    return (
        <div className='space-y-5'>
            <section className='flex flex-col gap-4 rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] md:flex-row md:items-center md:justify-between md:p-5 dark:bg-slate-950 dark:ring-slate-800'>
                <div>
                    <p className='text-xs font-black tracking-wide text-[#ef7f1a] uppercase'>Ijodkorlar katalogi</p>
                    <h2 className='mt-1 text-2xl font-black text-[#2f2a25] dark:text-white'>Mualliflar</h2>
                    <p className='mt-2 max-w-2xl text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                        Muallif profillari, biografiya, reyting va ularga tegishli kitoblarni boshqarish.
                    </p>
                </div>

                <button className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#ef7f1a] px-5 text-sm font-black text-white transition hover:bg-orange-600'>
                    <Plus size={18} />
                    Yangi muallif
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

            <section className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]'>
                <div className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800'>
                        <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] md:max-w-sm md:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                            <Search size={18} />
                            <input
                                type='search'
                                placeholder='Muallif nomi, davlat yoki slug'
                                className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                            />
                        </label>
                        <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                            {authors.length} ta muallif ko'rsatildi
                        </span>
                    </div>

                    <div className='grid gap-3 p-4'>
                        {authors.map((author, index) => (
                            <article
                                key={author.slug}
                                className='grid gap-4 rounded-[20px] bg-white p-4 ring-1 ring-[#eadfce] md:grid-cols-[minmax(0,1fr)_120px_110px_120px_auto] md:items-center dark:bg-slate-900 dark:ring-slate-800'>
                                <div className='flex min-w-0 items-center gap-3'>
                                    <span className='grid size-13 shrink-0 place-items-center rounded-2xl bg-[#f2e7d8] text-lg font-black text-[#ef7f1a] dark:bg-slate-950'>
                                        {author.name
                                            .split(' ')
                                            .map((part) => part[0])
                                            .join('')
                                            .slice(0, 2)}
                                    </span>
                                    <div className='min-w-0'>
                                        <div className='flex items-center gap-2'>
                                            <h3 className='truncate font-black text-[#2f2a25] dark:text-white'>
                                                {author.name}
                                            </h3>
                                            {index < 2 ? (
                                                <span className='rounded-full bg-[#fff1df] px-2 py-0.5 text-[10px] font-black text-[#ef7f1a] dark:bg-orange-500/10'>
                                                    TOP
                                                </span>
                                            ) : null}
                                        </div>
                                        <p className='mt-1 truncate text-sm font-bold text-[#9d907e] dark:text-slate-400'>
                                            /{author.slug}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                        Kitoblar
                                    </p>
                                    <p className='mt-1 font-black text-[#2f2a25] dark:text-white'>{author.books}</p>
                                </div>

                                <div>
                                    <p className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                        Reyting
                                    </p>
                                    <p className='mt-1 inline-flex items-center gap-1 font-black text-[#2f2a25] dark:text-white'>
                                        {author.rating}
                                        <Star size={14} className='fill-yellow-400 text-yellow-400' />
                                    </p>
                                </div>

                                <div>
                                    <p className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                        Davlat
                                    </p>
                                    <p className='mt-1 font-black text-[#2f2a25] dark:text-white'>{author.country}</p>
                                </div>

                                <div className='flex items-center justify-end gap-2'>
                                    <span className='rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'>
                                        {author.status}
                                    </span>
                                    <button className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                                        <Edit3 size={17} />
                                    </button>
                                    <button className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'>
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <aside className='space-y-5'>
                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center gap-2'>
                            <span className='grid size-10 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
                                <ImagePlus size={18} />
                            </span>
                            <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Muallif rasmi</h3>
                        </div>
                        <div className='mt-5 grid aspect-square place-items-center rounded-[20px] border-2 border-dashed border-[#eadfce] bg-[#f7f0e6] text-center dark:border-slate-800 dark:bg-slate-900'>
                            <div>
                                <Users size={30} className='mx-auto text-[#9d907e] dark:text-slate-500' />
                                <p className='mt-2 text-sm font-black text-[#6f6255] dark:text-slate-300'>Rasm yuklash</p>
                                <p className='mt-1 text-xs font-semibold text-[#9d907e] dark:text-slate-500'>
                                    Portret yoki avatar
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                        <div className='flex items-center gap-2'>
                            <span className='grid size-10 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
                                <Plus size={18} />
                            </span>
                            <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>Tez qo'shish</h3>
                        </div>

                        <div className='mt-5 space-y-4'>
                            {['Muallif ismi', 'Slug', 'Davlat', "Tug'ilgan yil"].map((label) => (
                                <label key={label} className='block space-y-2'>
                                    <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>{label}</span>
                                    <input className='h-12 w-full rounded-2xl border border-[#eadfce] bg-white px-4 text-sm font-semibold outline-none focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white' />
                                </label>
                            ))}
                            <label className='block space-y-2'>
                                <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>Bio</span>
                                <textarea className='min-h-28 w-full resize-y rounded-2xl border border-[#eadfce] bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-[#ef7f1a] dark:border-slate-800 dark:bg-slate-900 dark:text-white' />
                            </label>
                            <button className='h-12 w-full rounded-2xl bg-[#ef7f1a] text-sm font-black text-white transition hover:bg-orange-600'>
                                Saqlash
                            </button>
                        </div>
                    </section>
                </aside>
            </section>
        </div>
    );
};

export default AdminAuthorsPage;
