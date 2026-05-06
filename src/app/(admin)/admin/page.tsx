import {
    BookOpen,
    CircleDollarSign,
    PackageCheck,
    Users
} from 'lucide-react';

const stats = [
    { label: 'Jami kitoblar', value: '12,480', icon: BookOpen, color: 'bg-[#ef7f1a]' },
    { label: 'Buyurtmalar', value: '1,284', icon: PackageCheck, color: 'bg-[#7c6dc8]' },
    { label: 'Foydalanuvchilar', value: '8,932', icon: Users, color: 'bg-[#43a27a]' },
    { label: 'Daromad', value: '94.2M', icon: CircleDollarSign, color: 'bg-[#285c7f]' }
];

export default function AdminPage() {
    return (
        <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]'>
            <section className='min-w-0 space-y-5'>
                <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
                    {stats.map(({ label, value, icon: Icon, color }) => (
                        <div
                            key={label}
                            className='rounded-[24px] bg-[#fffaf2] p-4 shadow-sm ring-1 ring-[#eadfce] dark:bg-slate-950 dark:ring-slate-800'>
                            <div className='flex items-center justify-between'>
                                <span className={`grid size-11 place-items-center rounded-2xl ${color} text-white`}>
                                    <Icon size={20} />
                                </span>
                                <span className='rounded-full bg-[#f2e7d8] px-3 py-1 text-xs font-black text-[#8b7e70] dark:bg-slate-800 dark:text-slate-300'>
                                    +12%
                                </span>
                            </div>
                            <p className='mt-4 text-2xl font-black text-[#2f2a25] dark:text-white'>{value}</p>
                            <p className='text-sm font-bold text-[#9d907e] dark:text-slate-400'>{label}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}