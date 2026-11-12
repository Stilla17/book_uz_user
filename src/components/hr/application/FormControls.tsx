import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

import type { LucideIcon } from 'lucide-react';

const inputClass =
    'h-12 w-full rounded-2xl border border-[#e8dcc9] bg-white px-4 text-sm font-semibold text-[#2f2a25] outline-none transition placeholder:text-[#aa9d8a] focus:border-[#ef7f1a] focus:ring-4 focus:ring-[#ef7f1a]/10';

export const FormField = ({ label, required, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string }) => (
    <label className='grid gap-2 text-sm font-black text-[#554d44]'>
        <span>{label} {required ? <b className='text-[#ef7f1a]'>*</b> : null}</span>
        <input {...props} required={required} className={inputClass} />
    </label>
);

export const FormTextarea = ({ label, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
    <label className='grid gap-2 text-sm font-black text-[#554d44]'>
        <span>{label}</span>
        <textarea {...props} className='min-h-28 w-full resize-y rounded-2xl border border-[#e8dcc9] bg-white px-4 py-3 text-sm font-semibold text-[#2f2a25] outline-none transition placeholder:text-[#aa9d8a] focus:border-[#ef7f1a] focus:ring-4 focus:ring-[#ef7f1a]/10' />
    </label>
);

export const FormSection = ({ icon: Icon, title, description, children }: { icon: LucideIcon; title: string; description: string; children: ReactNode }) => (
    <section className='rounded-[28px] bg-[#fffaf3] p-5 shadow-sm ring-1 ring-[#eadfce] md:p-7'>
        <div className='mb-6 flex items-start gap-3'>
            <span className='grid size-11 shrink-0 place-items-center rounded-2xl bg-[#ef7f1a] text-white shadow-lg shadow-orange-200'><Icon size={21} /></span>
            <div><h2 className='text-xl font-black text-[#2f2a25]'>{title}</h2><p className='mt-1 text-sm font-semibold text-[#8c806f]'>{description}</p></div>
        </div>
        {children}
    </section>
);
