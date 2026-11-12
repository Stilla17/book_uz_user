'use client';

import { type FormEvent, useState } from 'react';

import { useAdminHrApplications, useDeleteHrApplication, useUpdateHrApplication } from '@/components/admin/hooks/queries/hr';
import { AdminHrService } from '@/components/admin/services/hr.service';
import type { HrStatus } from '@/types/hr';
import { getHrErrorMessage } from '@/utils/hr';

import { HrApplicationsTable } from './HrApplicationsTable';
import { HrFilters } from './HrFilters';
import { HrStats } from './HrStats';
import toast from 'react-hot-toast';

export const HrApplicationsView = () => {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState<HrStatus | ''>('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [page, setPage] = useState(1);
    const [downloadingId, setDownloadingId] = useState('');
    const { data, isLoading, isFetching } = useAdminHrApplications({ page, limit: 20, search, status, dateFrom, dateTo });
    const updateApplication = useUpdateHrApplication();
    const deleteApplication = useDeleteHrApplication();
    const applications = data?.applications || [];

    const submitSearch = (event: FormEvent) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };
    const updateFilter = <T,>(setter: (value: T) => void) => (value: T) => { setter(value); setPage(1); };
    const changeStatus = async (id: string, nextStatus: HrStatus) => {
        try {
            await updateApplication.mutateAsync({ id, data: { status: nextStatus } });
            toast.success('Ariza holati yangilandi');
        } catch (error) { toast.error(getHrErrorMessage(error, 'Holatni yangilab bo‘lmadi')); }
    };
    const download = async (id: string, applicationNumber: string) => {
        try {
            setDownloadingId(id);
            await AdminHrService.downloadDocx(id, applicationNumber);
        } catch (error) { toast.error(getHrErrorMessage(error, 'Word faylini yuklab bo‘lmadi')); }
        finally { setDownloadingId(''); }
    };
    const remove = async (id: string, name: string) => {
        if (!window.confirm(`${name} ma’lumotnomasini o‘chirmoqchimisiz?`)) return;
        try {
            await deleteApplication.mutateAsync(id);
            toast.success('Ma’lumotnoma o‘chirildi');
        } catch (error) { toast.error(getHrErrorMessage(error, 'Ma’lumotnomani o‘chirib bo‘lmadi')); }
    };

    return (
        <div className='space-y-5'>
            <div><h1 className='text-2xl font-black'>HR ma’lumotnomalari</h1><p className='mt-1 text-sm font-semibold text-admin-dim'>Yangi xodimlar yuborgan ma’lumotlarni ko‘rish va boshqarish.</p></div>
            <HrStats applications={applications} total={data?.pagination.total || 0} />
            <HrFilters searchInput={searchInput} status={status} dateFrom={dateFrom} dateTo={dateTo} onSearchInput={setSearchInput} onStatus={updateFilter(setStatus)} onDateFrom={updateFilter(setDateFrom)} onDateTo={updateFilter(setDateTo)} onSubmit={submitSearch} />
            <HrApplicationsTable applications={applications} pagination={data?.pagination} page={page} isLoading={isLoading} isFetching={isFetching} isUpdating={updateApplication.isPending} isDeleting={deleteApplication.isPending} downloadingId={downloadingId} onStatus={changeStatus} onDownload={download} onDelete={remove} onPage={setPage} />
        </div>
    );
};
