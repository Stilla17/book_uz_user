import type { FormEvent } from 'react';

import type { HrStatus } from '@/types/hr';
import { hrStatusOptions } from '@/utils/hr';

import { Search } from 'lucide-react';

type Props = {
    searchInput: string;
    status: HrStatus | '';
    dateFrom: string;
    dateTo: string;
    onSearchInput: (value: string) => void;
    onStatus: (value: HrStatus | '') => void;
    onDateFrom: (value: string) => void;
    onDateTo: (value: string) => void;
    onSubmit: (event: FormEvent) => void;
};

export const HrFilters = ({ searchInput, status, dateFrom, dateTo, onSearchInput, onStatus, onDateFrom, onDateTo, onSubmit }: Props) => (
    <form onSubmit={onSubmit} className='grid gap-3 rounded-3xl bg-admin-white p-4 ring-1 ring-base-300 md:grid-cols-[1fr_190px_160px_160px_auto]'>
        <label className='relative'>
            <Search className='absolute top-3 left-3 text-admin-dim' size={18} />
            <input value={searchInput} onChange={(event) => onSearchInput(event.target.value)} placeholder='F.I.Sh., telefon yoki ariza raqami' className='h-11 w-full rounded-xl bg-base-200 pr-3 pl-10 text-sm font-semibold outline-none' />
        </label>
        <select value={status} onChange={(event) => onStatus(event.target.value as HrStatus | '')} className='h-11 rounded-xl bg-base-200 px-3 text-sm font-bold outline-none'>
            <option value=''>Barcha holatlar</option>
            {hrStatusOptions.map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
        </select>
        <input type='date' value={dateFrom} onChange={(event) => onDateFrom(event.target.value)} className='h-11 rounded-xl bg-base-200 px-3 text-sm font-bold outline-none' title='Boshlanish sanasi' />
        <input type='date' value={dateTo} onChange={(event) => onDateTo(event.target.value)} className='h-11 rounded-xl bg-base-200 px-3 text-sm font-bold outline-none' title='Tugash sanasi' />
        <button className='h-11 rounded-xl bg-warning px-5 text-sm font-black text-warning-content'>Qidirish</button>
    </form>
);
