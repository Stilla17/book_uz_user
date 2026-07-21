'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { useDeleteBranch } from '@/components/admin/hooks/branchHooks/useDeleteBranch';
import { useBranchQuery } from '@/components/admin/hooks/queries/branch';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import { PublishersSkeleton } from '@/components/ui/skeleton';
import { matchesTransliteratedSearch } from '@/utils/transliteration';

import { Building2, Copy, Edit3, MapPin, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBranchesPage = () => {
    const [search, setSearch] = useState('');
    const { data: branches = [], isLoading } = useBranchQuery();
    const { mutate: deleteBranch, isPending: isDeleting } = useDeleteBranch();

    const filteredBranches = useMemo(() => {
        const keyword = search.trim();
        if (!keyword) return branches;

        return branches.filter((branch) => {
            const searchableText = [branch.branchName, branch.name, branch.address].filter(Boolean).join(' ');
            return matchesTransliteratedSearch(searchableText, keyword);
        });
    }, [branches, search]);

    const citiesCount = new Set(
        branches.map((branch) => (branch.branchName ?? branch.name)?.split(' ')[0]).filter(Boolean)
    ).size;
    const stats = [
        { label: 'Jami filiallar', value: branches.length, icon: Building2, color: 'bg-[#ef7f1a]' },
        {
            label: 'Shaharlar',
            value: citiesCount,
            icon: MapPin,
            color: 'bg-[#285c7f]'
        }
    ];

    const handleCopyCoordinates = async (latitude: number | undefined, longitude: number | undefined) => {
        if (latitude === undefined || longitude === undefined) {
            toast.error('Koordinatalar mavjud emas.');
            return;
        }

        const yandexUrl = `https://yandex.uz/maps/?pt=${longitude},${latitude}&z=16&l=map`;

        try {
            await navigator.clipboard.writeText(yandexUrl);
            toast.success('Yandex xaritasi havolasi nusxalandi.');
        } catch (error) {
            console.error('Koordinatalarni nusxalashda xatolik yuz berdi:', error);
            toast.error('Koordinatalarni nusxalashda xatolik yuz berdi.');
        }
    };

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Filiallar'
                text="Mijozlarga filial manzillari, ish vaqti va xaritadagi joylashuvlarini ko'rsatish uchun boshqaruv oynasi."
                href='branches'
            />

            <StatsCardsAdmin stats={stats} isLoading={isLoading} />

            <section className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 md:flex-row md:items-center md:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] md:max-w-sm md:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} />
                        <input
                            type='search'
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder='Filial nomi yoki manzil qidirish'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>
                    <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {filteredBranches.length} ta filial ko'rsatildi
                    </span>
                </div>

                <div className='grid gap-3 p-4'>
                    {isLoading ? (
                        <PublishersSkeleton />
                    ) : filteredBranches.length ? (
                        filteredBranches.map((branch, index) => (
                            <article
                                key={branch._id}
                                className='flex flex-col justify-between gap-4 rounded-[22px] bg-white p-4 ring-1 ring-[#eadfce] md:flex-row md:items-center dark:bg-slate-900 dark:ring-slate-800'>
                                <div className='flex min-w-0 items-start gap-3'>
                                    <span className='grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-950'>
                                        <MapPin size={21} />
                                    </span>
                                    <div className='min-w-0'>
                                        <h3 className='font-black text-[#2f2a25] dark:text-white'>
                                            {index + 1}. {branch.branchName ?? branch.name}
                                        </h3>
                                        <p className='mt-1 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>
                                            Koordinata: {branch.latitude ?? branch.latitude},{' '}
                                            {branch.longitude ?? branch.longitude}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex items-center justify-end gap-2'>
                                    <button
                                        type='button'
                                        onClick={() => handleCopyCoordinates(branch.latitude, branch.longitude)}
                                        aria-label='Koordinatalarni nusxalash'
                                        title='Yandex Maps havolasini nusxalash'
                                        className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                                        <Copy size={17} />
                                    </button>
                                    <Link
                                        href={`/admin/branches/new?id=${branch._id}`}
                                        className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'
                                        aria-label='Filialni tahrirlash'>
                                        <Edit3 size={17} />
                                    </Link>
                                    <button
                                        type='button'
                                        disabled={isDeleting}
                                        onClick={() => deleteBranch(branch._id)}
                                        className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10'
                                        aria-label="Filialni o'chirish">
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className='rounded-[22px] bg-white p-6 text-sm font-bold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'>
                            Filial topilmadi.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminBranchesPage;
