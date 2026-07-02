'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { useDeleteDiscount, useGetDiscounts } from '@/components/admin/hooks/queries/discount';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import type { Discount, DiscountTargetType } from '@/components/admin/services/discount.service';

import dayjs from 'dayjs';
import { CalendarDays, Edit3, Percent, Search, Store, Tag, ToggleRight, Trash2 } from 'lucide-react';

type DiscountFilter = 'all' | DiscountTargetType;

const targetLabels: Record<DiscountTargetType, string> = {
    PRODUCTS: 'Kitoblar',
    PUBLISHERS: 'Nashriyotlar'
};

const filters: Array<{ label: string; value: DiscountFilter }> = [
    { label: 'Barchasi', value: 'all' },
    { label: 'Kitoblar', value: 'PRODUCTS' },
    { label: 'Nashriyotlar', value: 'PUBLISHERS' }
];

const formatDiscount = (discount: Discount) => {
    return discount.type === 'PERCENT' ? `${discount.value}%` : `${discount.value.toLocaleString('uz-UZ')} so'm`;
};

const getTargetCount = (discount: Discount) => {
    return discount.targetType === 'PRODUCTS' ? (discount.products?.length ?? 0) : (discount.publishers?.length ?? 0);
};

const AdminDiscountPage = () => {
    const [search, setSearch] = useState('');
    const [activeTarget, setActiveTarget] = useState<DiscountFilter>('all');
    const { data: discounts = [], isLoading } = useGetDiscounts();
    const { mutate } = useDeleteDiscount();

    const filteredDiscounts = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return discounts.filter((discount) => {
            const matchesTarget = activeTarget === 'all' || discount.targetType === activeTarget;
            const matchesSearch = !normalizedSearch || discount.name.toLowerCase().includes(normalizedSearch);

            return matchesTarget && matchesSearch;
        });
    }, [activeTarget, discounts, search]);

    const activeDiscounts = discounts.filter((discount) => discount.isActive).length;
    const publisherDiscounts = discounts.filter((discount) => discount.targetType === 'PUBLISHERS').length;
    const bestDiscount = discounts.reduce((best, discount) => {
        if (discount.type !== 'PERCENT') return best;

        return Math.max(best, discount.value);
    }, 0);

    const stats = [
        { label: 'Jami chegirmalar', value: discounts.length, icon: Percent, color: 'bg-[#ef7f1a]' },
        { label: 'Faol chegirmalar', value: activeDiscounts, icon: ToggleRight, color: 'bg-[#285c7f]' },
        { label: 'Nashriyot aksiyalari', value: publisherDiscounts, icon: Store, color: 'bg-[#7c6dc8]' },
        { label: 'Eng katta chegirma', value: `${bestDiscount}%`, icon: Tag, color: 'bg-emerald-600' }
    ];

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Chegirmalar'
                text='Kitoblar va nashriyotlarga beriladigan katalog chegirmalarini boshqarish sahifasi.'
                href='discount'
            />

            <StatsCardsAdmin stats={stats} isLoading={isLoading} />

            <section className='overflow-hidden rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='flex flex-col gap-3 border-b border-[#eadfce] p-4 xl:flex-row xl:items-center xl:justify-between dark:border-slate-800'>
                    <label className='flex h-11 min-w-0 items-center gap-2 rounded-2xl bg-[#f2e7d8] px-4 text-[#817466] xl:max-w-sm xl:flex-1 dark:bg-slate-900 dark:text-slate-300'>
                        <Search size={18} className='shrink-0' />
                        <input
                            type='search'
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Chegirma nomi bo'yicha qidirish"
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>

                    <div className='flex flex-wrap gap-2'>
                        {filters.map((filter) => (
                            <button
                                key={filter.value}
                                type='button'
                                onClick={() => setActiveTarget(filter.value)}
                                className={`h-10 rounded-xl px-4 text-sm font-black ${
                                    activeTarget === filter.value
                                        ? 'bg-[#ef7f1a] text-white'
                                        : 'bg-white text-[#817466]'
                                }`}>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='overflow-x-auto'>
                    <table className='w-full min-w-[980px] text-left'>
                        <thead>
                            <tr className='border-b border-[#eadfce] text-xs font-black text-[#9d907e] uppercase dark:border-slate-800 dark:text-slate-500'>
                                <th className='px-4 py-3'>Nomi</th>
                                <th className='px-4 py-3'>Turi</th>
                                <th className='px-4 py-3'>Chegirma</th>
                                <th className='px-4 py-3'>Obyektlar</th>
                                <th className='px-4 py-3'>Muddat</th>
                                <th className='px-4 py-3'>Holat</th>
                                <th className='px-4 py-3 text-right'>Amallar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className='bg-white px-4 py-10 text-center text-sm font-bold text-[#9d907e] dark:bg-slate-950 dark:text-slate-500'>
                                        Chegirmalar yuklanmoqda...
                                    </td>
                                </tr>
                            ) : filteredDiscounts.length ? (
                                filteredDiscounts.map((discount, index) => (
                                    <tr
                                        key={discount._id}
                                        className='border-b border-[#f0e4d3] bg-white transition last:border-0 hover:bg-[#fffaf2] dark:border-slate-900 dark:bg-slate-950 dark:hover:bg-slate-900'>
                                        <td className='px-4 py-4'>
                                            <p className='font-black text-[#2f2a25] dark:text-white'>
                                                {index + 1}. {discount.name}
                                            </p>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span className='inline-flex rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#817466] dark:bg-slate-900 dark:text-slate-300'>
                                                {targetLabels[discount.targetType]}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4 font-black text-[#ef7f1a]'>
                                            {formatDiscount(discount)}
                                        </td>
                                        <td className='px-4 py-4 text-sm font-bold text-[#6f6255] dark:text-slate-300'>
                                            {getTargetCount(discount)} ta
                                        </td>
                                        <td className='px-4 py-4 text-sm font-bold text-[#6f6255] dark:text-slate-300'>
                                            <span className='inline-flex items-center gap-2'>
                                                <CalendarDays size={16} className='text-[#9d907e]' />
                                                {dayjs(discount.startDate).format('DD.MM.YYYY')} -{' '}
                                                {dayjs(discount.endDate).format('DD.MM.YYYY')}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${
                                                    discount.isActive
                                                        ? 'bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/20'
                                                        : 'bg-slate-50 text-slate-600 ring-slate-100 dark:bg-slate-500/10 dark:text-slate-300 dark:ring-slate-500/20'
                                                }`}>
                                                {discount.isActive ? 'Faol' : 'Toxtatilgan'}
                                            </span>
                                        </td>
                                        <td className='px-4 py-4'>
                                            <div className='flex justify-end gap-2'>
                                                <Link
                                                    href={`/admin/discount/new?id=${discount._id}`}
                                                    className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-900'>
                                                    <Edit3 size={17} />
                                                </Link>
                                                <button
                                                    type='button'
                                                    onClick={() => mutate(discount._id)}
                                                    className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'>
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className='bg-white px-4 py-10 text-center text-sm font-bold text-[#9d907e] dark:bg-slate-950 dark:text-slate-500'>
                                        Chegirma topilmadi.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminDiscountPage;
