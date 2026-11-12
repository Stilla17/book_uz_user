import type { ReactNode } from 'react';

import Link from 'next/link';

import type { HrApplication } from '@/types/hr';
import { formatHrDate, hrStatusMeta } from '@/utils/hr';

import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';

export const HrInfoRow = ({ label, value }: { label: string; value?: string | number }) => (
    <div className='flex items-start justify-between gap-4 border-b border-base-300 py-3 last:border-0'>
        <span className='text-sm font-bold text-admin-dim'>{label}</span>
        <span className='max-w-[65%] text-right text-sm font-black break-words'>{value || '—'}</span>
    </div>
);

export const HrDetailSection = ({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) => (
    <section className='rounded-3xl bg-admin-white p-5 shadow-sm ring-1 ring-base-300'>
        <div className='mb-3 flex items-center gap-2'><Icon size={20} className='text-warning' /><h2 className='text-lg font-black'>{title}</h2></div>
        {children}
    </section>
);

export const HrDetailHeader = ({ application, fullName, downloading, onDownload }: { application: HrApplication; fullName: string; downloading: boolean; onDownload: () => void }) => (
    <section className='flex flex-col gap-4 rounded-3xl bg-admin-white p-5 ring-1 ring-base-300 md:flex-row md:items-center md:justify-between'>
        <div>
            <Link href='/admin/hr' className='inline-flex items-center gap-2 text-sm font-black text-admin-dim transition hover:text-warning'><ArrowLeft size={17} /> HR ma’lumotnomalari</Link>
            <div className='mt-3 flex flex-wrap items-center gap-3'><h1 className='text-2xl font-black'>{fullName}</h1><span className={`rounded-full px-3 py-1 text-xs font-black ${hrStatusMeta[application.status].className}`}>{hrStatusMeta[application.status].label}</span></div>
            <p className='mt-2 font-mono text-xs font-bold text-admin-dim'>{application.applicationNumber} · {formatHrDate(application.submittedAt)}</p>
        </div>
        <button type='button' disabled={downloading} onClick={onDownload} className='inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white disabled:opacity-60'>
            {downloading ? <Loader2 size={17} className='animate-spin' /> : <Download size={17} />} Word yuklash
        </button>
    </section>
);

export const HrDetailNotFound = () => (
    <div className='grid min-h-[420px] place-items-center rounded-3xl bg-admin-white p-6 text-center ring-1 ring-base-300'>
        <div><h1 className='text-xl font-black'>Ma’lumotnoma topilmadi</h1><Link href='/admin/hr' className='mt-5 inline-flex h-11 items-center gap-2 rounded-2xl bg-warning px-5 font-black text-warning-content'><ArrowLeft size={17} /> HR ro‘yxatiga qaytish</Link></div>
    </div>
);
