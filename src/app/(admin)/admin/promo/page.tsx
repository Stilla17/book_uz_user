'use client';

import { useMemo, useState } from 'react';

import Link from 'next/link';

import { useDeletePromo } from '@/components/admin/hooks/promoHooks/useDeletePromo';
import { useUpdatePromo } from '@/components/admin/hooks/promoHooks/useUpdatePromo';
import { usePromoQuery } from '@/components/admin/hooks/queries/promo';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import { Switch } from '@/components/ui/switch';
import type { Coupon } from '@/types';

import dayjs from 'dayjs';
import { Copy, Edit3, Percent, Search, TicketPercent, ToggleRight, Trash2, Users } from 'lucide-react';
import toast from 'react-hot-toast';

type PromoListItem = Coupon & {
    minOrderAmount?: number;
    maxDiscount?: number;
};

const formatMoney = (value?: number) => (value ? `${value.toLocaleString('uz-UZ')} so'm` : '-');

const getUsagePercent = (promo: PromoListItem) => {
    if (!promo.usageLimit || promo.usageLimit <= 1) return 0;

    return Math.min(100, Math.round((promo.usedCount / promo.usageLimit) * 100));
};

const AdminPromoPage = () => {
    const [search, setSearch] = useState('');
    const [updatingPromoId, setUpdatingPromoId] = useState<string | null>(null);
    const { data: promos = [], isLoading } = usePromoQuery();
    const { mutate: updatePromo, isPending: isUpdatePending } = useUpdatePromo();
    const { mutate: deletePromo } = useDeletePromo();

    const activePromos = promos.filter((promo) => promo.isActive).length;
    const totalUsed = promos.reduce((sum, promo) => sum + promo.usedCount, 0);
    const bestDiscount = promos.reduce((max, promo) => Math.max(max, promo.value), 0);

    const stats = [
        { label: 'Jami promokodlar', value: promos.length, icon: TicketPercent, color: 'bg-[#ef7f1a]' },
        { label: 'Faol promokodlar', value: activePromos, icon: ToggleRight, color: 'bg-[#285c7f]' },
        { label: 'Ishlatilgan', value: totalUsed, icon: Users, color: 'bg-[#7c6dc8]' },
        {
            label: 'Eng katta chegirma',
            value: bestDiscount ? `${bestDiscount}%` : '0%',
            icon: Percent,
            color: 'bg-emerald-600'
        }
    ];

    const handleCopy = async (code: string) => {
        await navigator.clipboard.writeText(code);
        toast.success('Promokod nusxalandi');
    };

    const handleDelete = (id: string) => {
        deletePromo(id);
        toast.success("Promokod o'chirildi");
    };

    const handleToggleActive = (promo: Coupon, isActive: boolean) => {
        setUpdatingPromoId(promo._id);

        updatePromo(
            { id: promo._id, data: { isActive } },
            {
                onSuccess: () => {
                    toast.success(isActive ? 'Promokod faollashtirildi' : "Promokod to'xtatildi");
                },
                onSettled: () => {
                    setUpdatingPromoId(null);
                }
            }
        );
    };

    const filteredPromos = useMemo(() => {
        const keyword = search.trim().toLowerCase();
        if (!keyword) return promos;

        return promos.filter((item) => item.code.toLowerCase().includes(keyword));
    }, [search, promos]);

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Promokodlar'
                text='Chegirma kodlari, foydalanish limitlari va promo aksiyalarni boshqarish sahifasi.'
                href='promo'
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
                            placeholder='Promokod qidirish'
                            className='h-full min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-[#9d907e] dark:placeholder:text-slate-500'
                        />
                    </label>

                    <span className='text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                        {filteredPromos.length} ta promokod ko'rsatildi
                    </span>
                </div>

                <div className='grid gap-4 p-4 xl:grid-cols-2'>
                    {isLoading ? (
                        <div className='rounded-[22px] bg-white p-6 text-sm font-bold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'>
                            Promokodlar yuklanmoqda...
                        </div>
                    ) : filteredPromos.length ? (
                        filteredPromos.map((promo) => {
                            const usagePercent = getUsagePercent(promo);

                            return (
                                <article
                                    key={promo._id}
                                    className='overflow-hidden rounded-[22px] bg-white ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                    <div className='flex flex-col gap-4 bg-[linear-gradient(135deg,#ef7f1a_0%,#285c7f_100%)] p-5 text-white sm:flex-row sm:items-center sm:justify-between'>
                                        <div className='min-w-0'>
                                            <div className='inline-flex items-center gap-3 rounded-2xl bg-white/15 px-3 py-2 backdrop-blur'>
                                                <span className='text-xs font-black'>
                                                    {isUpdatePending && updatingPromoId === promo._id
                                                        ? 'Saqlanmoqda'
                                                        : promo.isActive
                                                          ? 'Faol'
                                                          : 'Toxtatilgan'}
                                                </span>
                                                <Switch
                                                    size='default'
                                                    checked={promo.isActive}
                                                    disabled={isUpdatePending && updatingPromoId === promo._id}
                                                    onCheckedChange={(checked) => handleToggleActive(promo, checked)}
                                                    className='data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-white/35'
                                                    aria-label={`${promo.code} holatini o'zgartirish`}
                                                />
                                            </div>
                                            <h3 className='mt-4 truncate text-3xl font-black tracking-wide'>
                                                {promo.code}
                                            </h3>
                                        </div>

                                        <div className='rounded-2xl bg-white/15 px-5 py-4 text-center backdrop-blur'>
                                            <p className='text-xs font-black text-white/75 uppercase'>Chegirma</p>
                                            <p className='mt-1 text-3xl font-black'>
                                                {promo.type === 'PERCENT'
                                                    ? `${promo.value}%`
                                                    : formatMoney(promo.value)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='grid gap-4 p-4 md:grid-cols-2'>
                                        <div className='rounded-2xl bg-[#fffaf2] p-4 dark:bg-slate-950'>
                                            <p className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                                Amaldagi sana
                                            </p>
                                            <p className='mt-2 font-black text-[#2f2a25] dark:text-white'>
                                                {dayjs(promo.startDate).format('DD.MM.YYYY')}
                                            </p>
                                        </div>
                                        <div className='rounded-2xl bg-[#fffaf2] p-4 dark:bg-slate-950'>
                                            <p className='text-xs font-black text-[#9d907e] uppercase dark:text-slate-500'>
                                                Tugash sanasi
                                            </p>
                                            <p className='mt-2 font-black text-[#2f2a25] dark:text-white'>
                                                {dayjs(promo.endDate).format('DD.MM.YYYY')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-3 border-t border-[#f0e4d3] p-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800'>
                                        <div className='flex items-center justify-between gap-3 text-sm font-bold text-[#6f6255] dark:text-slate-300'>
                                            <span>Ishlatildi: {promo.usedCount}</span>
                                        </div>
                                        <div className='flex items-center justify-end gap-2'>
                                            <button
                                                type='button'
                                                onClick={() => handleCopy(promo.code)}
                                                className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                                                <Copy size={17} />
                                            </button>
                                            <Link
                                                href={`/admin/promo/new?id=${promo._id}`}
                                                className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                                                <Edit3 size={17} />
                                            </Link>
                                            <button
                                                type='button'
                                                onClick={() => handleDelete(promo._id)}
                                                className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10'>
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })
                    ) : (
                        <div className='rounded-[22px] bg-white p-6 text-sm font-bold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'>
                            Promokod topilmadi.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminPromoPage;
