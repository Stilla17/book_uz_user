import Link from 'next/link';

import type { HrApplication, HrPagination, HrStatus } from '@/types/hr';
import { formatHrDate, hrStatusMeta, hrStatusOptions } from '@/utils/hr';

import { Download, Eye, Trash2 } from 'lucide-react';

type Props = {
    applications: HrApplication[];
    pagination?: HrPagination;
    page: number;
    isLoading: boolean;
    isFetching: boolean;
    isUpdating: boolean;
    isDeleting: boolean;
    downloadingId: string;
    onStatus: (id: string, status: HrStatus) => void;
    onDownload: (id: string, applicationNumber: string) => void;
    onDelete: (id: string, name: string) => void;
    onPage: (page: number) => void;
};

export const HrApplicationsTable = ({ applications, pagination, page, isLoading, isFetching, isUpdating, isDeleting, downloadingId, onStatus, onDownload, onDelete, onPage }: Props) => (
    <section className='overflow-hidden rounded-3xl bg-admin-white ring-1 ring-base-300'>
        <div className='flex items-center justify-between border-b border-base-300 p-4'>
            <h2 className='font-black'>Arizalar ({pagination?.total || 0})</h2>
            {isFetching && !isLoading ? <span className='text-xs font-bold text-admin-dim'>Yangilanmoqda...</span> : null}
        </div>
        <div className='overflow-x-auto'>
            <table className='w-full min-w-[1050px] text-left text-sm'>
                <thead className='border-b border-base-300 text-xs uppercase text-admin-dim'>
                    <tr><th className='p-4'>Xodim</th><th className='p-4'>Ariza raqami</th><th className='p-4'>Telefon</th><th className='p-4'>Sana</th><th className='p-4'>Holat</th><th className='p-4'>Amallar</th></tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={6} className='p-10 text-center font-bold text-admin-dim'>Ma’lumotlar yuklanmoqda...</td></tr>
                    ) : applications.length === 0 ? (
                        <tr><td colSpan={6} className='p-10 text-center font-bold text-admin-dim'>Hozircha ma’lumotnoma topilmadi.</td></tr>
                    ) : applications.map((application) => {
                        const fullName = [application.lastName, application.firstName, application.middleName].filter(Boolean).join(' ');
                        return (
                            <tr key={application._id} className='border-b border-base-300 last:border-0'>
                                <td className='p-4'><p className='font-black'>{fullName}</p><p className='mt-1 text-xs text-admin-dim'>{application.birthPlace}</p></td>
                                <td className='p-4 font-mono text-xs font-bold'>{application.applicationNumber}</td>
                                <td className='p-4 font-bold'>{application.phone}</td>
                                <td className='p-4'>{formatHrDate(application.submittedAt)}</td>
                                <td className='p-4'>
                                    <select value={application.status} disabled={isUpdating} onChange={(event) => onStatus(application._id, event.target.value as HrStatus)} className={`rounded-full px-3 py-2 text-xs font-black outline-none ${hrStatusMeta[application.status].className}`}>
                                        {hrStatusOptions.map(([key, meta]) => <option key={key} value={key}>{meta.label}</option>)}
                                    </select>
                                </td>
                                <td className='p-4'><div className='flex items-center gap-2'>
                                    <Link href={`/admin/hr/${application._id}`} title='Ko‘rish' className='grid size-9 place-items-center rounded-xl bg-base-200'><Eye size={16} /></Link>
                                    <button type='button' title='Word yuklash' disabled={downloadingId === application._id} onClick={() => onDownload(application._id, application.applicationNumber)} className='grid size-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 disabled:opacity-50'><Download size={16} /></button>
                                    <button type='button' title='O‘chirish' disabled={isDeleting} onClick={() => onDelete(application._id, fullName)} className='grid size-9 place-items-center rounded-xl bg-red-50 text-red-600 disabled:opacity-50'><Trash2 size={16} /></button>
                                </div></td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
        {pagination && pagination.pages > 1 ? (
            <div className='flex items-center justify-between border-t border-base-300 p-4'>
                <p className='text-sm font-bold text-admin-dim'>{pagination.page} / {pagination.pages} sahifa</p>
                <div className='flex gap-2'><button type='button' disabled={page <= 1} onClick={() => onPage(page - 1)} className='h-9 rounded-xl bg-base-200 px-4 text-sm font-black disabled:opacity-40'>Oldingi</button><button type='button' disabled={page >= pagination.pages} onClick={() => onPage(page + 1)} className='h-9 rounded-xl bg-base-200 px-4 text-sm font-black disabled:opacity-40'>Keyingi</button></div>
            </div>
        ) : null}
    </section>
);
