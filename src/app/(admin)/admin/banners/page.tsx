'use client';

import Link from 'next/link';

import { useDeleteBanner } from '@/components/admin/hooks/bannerHooks/useDeleteBanner';
import { useBannerQuery } from '@/components/admin/hooks/queries/banner';
import StatsCardsAdmin from '@/components/admin/other/StatsCardsAdmin';
import HeadSection from '@/components/admin/sections/HeadSection';
import { getLocalizedText } from '@/utils/book-formatters';
import { getImageUrl } from '@/utils/image';

import dayjs from 'dayjs';
import { CalendarDays, Edit3, ImageIcon, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminBannerPage = () => {
    const { data: banners = [], isLoading } = useBannerQuery();
    const { mutate: deleteBanner, isPending: isDeletePending } = useDeleteBanner();

    const stats = [{ label: 'Jami bannerlar', value: banners.length, icon: ImageIcon, color: 'bg-[#ef7f1a]' }];

    const handleDelete = (id: string) => {
        deleteBanner(id, {
            onSuccess: () => toast.success("Banner o'chirildi"),
            onError: (error: any) =>
                toast.error(error?.response?.data?.message || error?.message || "Bannerni o'chirishda xatolik")
        });
    };

    return (
        <div className='space-y-5'>
            <HeadSection
                title='Bannerlar'
                text="Saytdagi asosiy reklama bannerlari, aksiyalar va ko'rinadigan vizual bloklarni boshqarish."
                href='banners'
            />

            <StatsCardsAdmin stats={stats} isLoading={isLoading} />

            <section className='rounded-[24px] bg-[#fffaf2] shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                <div className='grid gap-4 p-4 xl:grid-cols-2'>
                    {isLoading ? (
                        <div className='rounded-[22px] bg-white p-6 text-sm font-bold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'>
                            Bannerlar yuklanmoqda...
                        </div>
                    ) : banners.length ? (
                        banners.map((banner, index) => (
                            <article
                                key={banner._id}
                                className='overflow-hidden rounded-[22px] bg-white ring-1 ring-[#eadfce] dark:bg-slate-900 dark:ring-slate-800'>
                                <div className='relative grid min-h-48 place-items-center overflow-hidden bg-[#f2e7d8] p-5 dark:bg-slate-950'>
                                    {banner.imageUrl ? (
                                        <img
                                            src={getImageUrl(banner.imageUrl)}
                                            alt={banner.name || getLocalizedText(banner.title)}
                                            className='absolute inset-0 h-full w-full object-cover'
                                        />
                                    ) : (
                                        <div className='absolute inset-0 bg-[linear-gradient(135deg,#ef7f1a_0%,#285c7f_100%)] opacity-90' />
                                    )}
                                    <div className='absolute inset-0 bg-black/30' />
                                    <div className='relative z-10 max-w-md text-center text-white'>
                                        <span className='mx-auto grid size-12 place-items-center rounded-2xl bg-white/20 backdrop-blur'>
                                            <ImageIcon size={22} />
                                        </span>
                                        <h3 className='mt-4 text-2xl font-black'>
                                            {index + 1}. {banner.name || getLocalizedText(banner.title, 'Banner')}
                                        </h3>
                                        <p className='mt-2 text-sm font-semibold text-white/85'>
                                            {getLocalizedText(banner.subtitle, getLocalizedText(banner.description))}
                                        </p>
                                    </div>
                                </div>

                                <div className='grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center'>
                                    <div className='min-w-0'>
                                        <div className='flex flex-wrap items-center gap-2'>
                                            <span className='rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#6f6255] dark:bg-slate-950 dark:text-slate-300'>
                                                {banner.type || 'hero'}
                                            </span>
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-black ${
                                                    banner.isActive
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10'
                                                        : 'bg-amber-50 text-red-600 dark:bg-red-500/10'
                                                }`}>
                                                {banner.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>

                                        <p className='mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#8b7e70] dark:text-slate-400'>
                                            <CalendarDays size={16} />
                                            {banner.createdAt ? dayjs(banner.createdAt).format('DD.MM.YYYY') : '-'}
                                        </p>
                                    </div>

                                    <div className='flex items-center justify-end gap-2'>
                                        <Link
                                            href={`/admin/banners/new?id=${banner._id}`}
                                            className='grid size-9 place-items-center rounded-xl text-[#817466] transition hover:bg-[#f2e7d8] hover:text-[#ef7f1a] dark:text-slate-300 dark:hover:bg-slate-950'>
                                            <Edit3 size={17} />
                                        </Link>
                                        <button
                                            disabled={isDeletePending}
                                            onClick={() => handleDelete(banner._id)}
                                            className='grid size-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-500/10'>
                                            <Trash2 size={17} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className='rounded-[22px] bg-white p-6 text-sm font-bold text-[#8b7e70] ring-1 ring-[#eadfce] dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-800'>
                            Banner topilmadi.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminBannerPage;
