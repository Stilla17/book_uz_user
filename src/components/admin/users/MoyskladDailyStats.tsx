import type { MoyskladDailyStatsResponse } from '@/types/admin-users';

import { CalendarDays, RefreshCw, UserPlus, UserX } from 'lucide-react';

const formatDate = (value: string) => {
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
};

export const MoyskladDailyStats = ({ data, isLoading }: { data?: MoyskladDailyStatsResponse; isLoading: boolean }) => {
    const days = data?.days || [];
    const maxValue = Math.max(...days.map((item) => item.integrated), 1);

    return (
        <section className='rounded-[24px] bg-[#fffaf2] p-5 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div>
                    <div className='flex items-center gap-2'><RefreshCw size={20} className='text-[#ef7f1a]' /><h2 className='text-lg font-black text-[#2f2a25] dark:text-white'>MoySklad kunlik integratsiyasi</h2></div>
                    <p className='mt-1 text-sm font-semibold text-[#8b7e70] dark:text-slate-400'>Faqat telefon raqami va tug‘ilgan sanasi mavjud mijozlar.</p>
                </div>
                <div className='grid grid-cols-2 gap-3 sm:min-w-[340px]'>
                    <div className='rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'>
                        <p className='flex items-center gap-1 text-xs font-black uppercase'><UserPlus size={14} /> Bugun qo‘shildi</p>
                        <p className='mt-1 text-2xl font-black'>{data?.today.integrated || 0}</p>
                    </div>
                    <div className='rounded-2xl bg-red-50 p-3 text-red-700 dark:bg-red-500/10 dark:text-red-300'>
                        <p className='flex items-center gap-1 text-xs font-black uppercase'><UserX size={14} /> Bugun tozalandi</p>
                        <p className='mt-1 text-2xl font-black'>{data?.today.removedInvalid || 0}</p>
                    </div>
                </div>
            </div>

            <div className='mt-5 border-t border-[#eadfce] pt-4 dark:border-slate-800'>
                {isLoading ? (
                    <div className='h-32 animate-pulse rounded-2xl bg-[#f2e7d8] dark:bg-slate-900' />
                ) : days.length ? (
                    <div className='grid gap-2'>
                        {days.map((item) => (
                            <div key={item.date} className='grid grid-cols-[90px_1fr_42px] items-center gap-3 text-sm'>
                                <span className='flex items-center gap-1 font-bold text-[#8b7e70] dark:text-slate-400'><CalendarDays size={14} /> {formatDate(item.date).slice(0, 5)}</span>
                                <div className='h-3 overflow-hidden rounded-full bg-[#f2e7d8] dark:bg-slate-900'>
                                    <div className='h-full rounded-full bg-[#ef7f1a] transition-all' style={{ width: `${Math.max((item.integrated / maxValue) * 100, item.integrated ? 5 : 0)}%` }} />
                                </div>
                                <span className='text-right font-black text-[#2f2a25] dark:text-white'>{item.integrated}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='py-6 text-center text-sm font-bold text-[#8b7e70] dark:text-slate-400'>MoySklad sync statistikasi hali shakllanmagan.</p>
                )}
            </div>
        </section>
    );
};
