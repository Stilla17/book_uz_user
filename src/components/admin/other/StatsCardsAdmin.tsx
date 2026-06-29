import React from 'react';

import type { LucideIcon } from 'lucide-react';

type Stat = {
    label: string;
    value?: number | string;
    icon: LucideIcon;
    color: string;
};

type Props = {
    stats: Stat[];
    isLoading: boolean;
};

const StatsCardsAdmin = ({ stats, isLoading }: Props) => {
    return (
        <section className='grid gap-4 md:grid-cols-3'>
            {stats.map(({ label, value, icon: Icon, color }) => (
                <div
                    key={label}
                    className='rounded-[22px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                    <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
                        <Icon size={20} />
                    </span>
                    {isLoading ? (
                        <div className='mt-4 h-8 w-16 animate-pulse rounded-full bg-[#f2e7d8] dark:bg-slate-900' />
                    ) : (
                        <div>
                            <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value}</p>
                            <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                        </div>
                    )}
                </div>
            ))}
        </section>
    );
};

export default StatsCardsAdmin;
