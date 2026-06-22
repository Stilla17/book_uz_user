import { ElementType, ReactNode } from 'react';

export const Field = ({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) => (
    <label className='block min-w-0 space-y-2'>
        <span className='text-sm font-black text-[#6f6255] dark:text-slate-300'>{label}</span>
        {children}
        {hint ? <span className='block text-xs font-semibold text-[#9d907e] dark:text-slate-500'>{hint}</span> : null}
    </label>
);

export const SectionTitle = ({ icon: Icon, title }: { icon: ElementType; title: string }) => (
    <div className='mb-4 flex items-center gap-2'>
        <span className='grid size-10 place-items-center rounded-2xl bg-[#f2e7d8] text-[#ef7f1a] dark:bg-slate-900'>
            <Icon size={18} />
        </span>
        <h3 className='text-lg font-black text-[#2f2a25] dark:text-white'>{title}</h3>
    </div>
);

export const inputClass =
    'h-12 rounded-2xl border-[#eadfce] bg-white font-semibold text-[#2f2a25] shadow-sm placeholder:text-[#b0a391] dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500';
