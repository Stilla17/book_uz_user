'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { useAdminHrApplication, useUpdateHrApplication } from '@/components/admin/hooks/queries/hr';
import { AdminHrService } from '@/components/admin/services/hr.service';
import type { HrStatus } from '@/types/hr';
import { getHrErrorMessage } from '@/utils/hr';

import { HrDecisionPanel } from './HrDecisionPanel';
import { HrDetailHeader, HrDetailNotFound } from './HrDetailShared';
import { HrInformationSections } from './HrInformationSections';
import toast from 'react-hot-toast';

export const HrApplicationDetails = () => {
    const params = useParams();
    const id = String(params?.id || '');
    const { data: application, isLoading } = useAdminHrApplication(id);
    const updateApplication = useUpdateHrApplication();
    const [status, setStatus] = useState<HrStatus>('new');
    const [adminNote, setAdminNote] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (!application) return;
        setStatus(application.status);
        setAdminNote(application.adminNote || '');
    }, [application]);

    const save = async () => {
        try {
            await updateApplication.mutateAsync({ id, data: { status, adminNote } });
            toast.success('HR ma’lumotlari saqlandi');
        } catch (error) { toast.error(getHrErrorMessage(error, 'Ma’lumotlarni saqlab bo‘lmadi')); }
    };
    const download = async () => {
        if (!application) return;
        try {
            setIsDownloading(true);
            await AdminHrService.downloadDocx(id, application.applicationNumber);
        } catch (error) { toast.error(getHrErrorMessage(error, 'Word faylini yuklab bo‘lmadi')); }
        finally { setIsDownloading(false); }
    };

    if (isLoading) return <div className='grid min-h-[420px] place-items-center rounded-3xl bg-admin-white font-black text-admin-dim ring-1 ring-base-300'>Ma’lumotnoma yuklanmoqda...</div>;
    if (!application) return <HrDetailNotFound />;

    const fullName = [application.lastName, application.firstName, application.middleName].filter(Boolean).join(' ');
    return (
        <div className='space-y-5'>
            <HrDetailHeader application={application} fullName={fullName} downloading={isDownloading} onDownload={download} />
            <div className='grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(330px,0.7fr)]'>
                <HrInformationSections application={application} fullName={fullName} />
                <HrDecisionPanel application={application} fullName={fullName} status={status} adminNote={adminNote} saving={updateApplication.isPending} onStatus={setStatus} onNote={setAdminNote} onSave={save} />
            </div>
        </div>
    );
};
