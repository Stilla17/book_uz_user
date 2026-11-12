import Image from 'next/image';

import type { HrApplication, HrStatus } from '@/types/hr';
import { hrStatusOptions } from '@/utils/hr';

import { FileText, Loader2, Save } from 'lucide-react';

type Props = {
    application: HrApplication;
    fullName: string;
    status: HrStatus;
    adminNote: string;
    saving: boolean;
    onStatus: (status: HrStatus) => void;
    onNote: (note: string) => void;
    onSave: () => void;
};

export const HrDecisionPanel = ({ application, fullName, status, adminNote, saving, onStatus, onNote, onSave }: Props) => (
    <aside className='space-y-5'>
        {application.photo?.url ? (
            <section className='overflow-hidden rounded-3xl bg-admin-white p-3 ring-1 ring-base-300'>
                <Image src={application.photo.url} alt={fullName} width={480} height={600} className='max-h-[440px] w-full rounded-2xl object-cover' />
            </section>
        ) : null}
        <section className='rounded-3xl bg-admin-white p-5 ring-1 ring-base-300'>
            <div className='mb-4 flex items-center gap-2'><FileText size={20} className='text-warning' /><h2 className='text-lg font-black'>HR qarori</h2></div>
            <label className='grid gap-2 text-sm font-black'>Holati
                <select value={status} onChange={(event) => onStatus(event.target.value as HrStatus)} className='h-11 rounded-2xl bg-base-200 px-4 outline-none'>
                    {hrStatusOptions.map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
                </select>
            </label>
            <label className='mt-4 grid gap-2 text-sm font-black'>Admin izohi
                <textarea value={adminNote} onChange={(event) => onNote(event.target.value)} maxLength={2000} rows={7} placeholder='Suhbat natijasi yoki ichki izoh...' className='resize-y rounded-2xl bg-base-200 px-4 py-3 text-sm font-semibold outline-none' />
            </label>
            <button type='button' disabled={saving} onClick={onSave} className='mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-warning font-black text-warning-content disabled:opacity-60'>
                {saving ? <Loader2 size={17} className='animate-spin' /> : <Save size={17} />} Saqlash
            </button>
        </section>
    </aside>
);
