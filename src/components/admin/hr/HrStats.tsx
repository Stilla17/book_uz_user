import type { HrApplication } from '@/types/hr';

import { FileUser, UserCheck, UserRoundSearch, UsersRound } from 'lucide-react';

export const HrStats = ({ applications, total }: { applications: HrApplication[]; total: number }) => {
    const stats = [
        { label: 'Jami arizalar', value: total, icon: UsersRound, color: 'bg-[#ef7f1a]' },
        { label: 'Yangi', value: applications.filter((item) => item.status === 'new').length, icon: FileUser, color: 'bg-blue-600' },
        { label: 'Ko‘rib chiqilmoqda', value: applications.filter((item) => item.status === 'reviewing').length, icon: UserRoundSearch, color: 'bg-amber-500' },
        { label: 'Qabul qilingan', value: applications.filter((item) => item.status === 'approved').length, icon: UserCheck, color: 'bg-emerald-600' }
    ];

    return (
        <section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
            {stats.map(({ label, value, icon: Icon, color }) => (
                <article key={label} className='rounded-3xl bg-admin-white p-5 shadow-sm ring-1 ring-base-300'>
                    <span className={`grid size-11 place-items-center rounded-2xl text-white ${color}`}><Icon size={20} /></span>
                    <p className='mt-4 text-2xl font-black'>{value}</p>
                    <p className='text-sm font-bold text-admin-dim'>{label}</p>
                </article>
            ))}
        </section>
    );
};
